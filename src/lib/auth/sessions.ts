import { cookies } from "next/headers";
import { db } from "../db";
import { addSeconds } from "date-fns";

const sessionExpiresInSeconds = 60 * 60 * 24; // 1 day

export function generateSecureRandomString(): string {
	// Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
	const alphabet = "abcdefghijklmnpqrstuvwxyz23456789";

	// Generate 24 bytes = 192 bits of entropy.
	// We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);

	let id = "";
	for (let i = 0; i < bytes.length; i++) {
		// >> 3 s"removes" the right-most 3 bits of the byte
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

export async function createSession(userId: string): Promise<SessionWithToken> {
	const now = new Date();

	const id = generateSecureRandomString();
	const secret = generateSecureRandomString();
	const secretHash = await hashSecret(secret);

	const token = id + "." + secret;

	const session: SessionWithToken = {
		id,
		secretHash,
		createdAt: now,
		token,
    userId
	};

  await db.session.create({ data: session });

	return session;
}

export async function hashSecret(secret: string): Promise<Uint8Array> {
	const secretBytes = new TextEncoder().encode(secret);
	const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
	return new Uint8Array(secretHashBuffer);
}

export async function validateSessionToken(token: string): Promise<Session | null> {
	const tokenParts = token.split(".");
	if (tokenParts.length != 2) {
		return null;
	}
	const sessionId = tokenParts[0];
	const sessionSecret = tokenParts[1];

	const session = await getSession(sessionId);
  if (!session) {
    return null;
  }

	const tokenSecretHash = await hashSecret(sessionSecret);
	const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
	if (!validSecret) {
		return null;
	}

	return session;
}

export async function getSession(sessionId: string): Promise<Session | null> {
	const now = new Date();

	// const result = await executeQuery(
	// 	dbPool,
	// 	"SELECT id, secret_hash, created_at FROM session WHERE id = ?",
	// 	[sessionId]
	// );

  const session: Session | null = await db.session.findUnique({
    where: {
      id: sessionId
    }
  })
	if (!session) {
		return null;
	}

	// Check expiration
	if (now.getTime() - session.createdAt.getTime() >= sessionExpiresInSeconds * 1000) {
		await deleteSession(sessionId);
		return null;
	}

	return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
	await db.session.delete({ where: { id: sessionId } });
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}

interface SessionWithToken extends Session {
	token: string;
}

interface Session {
	id: string;
	secretHash: Uint8Array; // Uint8Array is a byte array
	createdAt: Date;
  userId: string
}

export function encodeSessionPublicJSON(session: Session): string {
	// Omit Session.secretHash
	const json = JSON.stringify({
		id: session.id,
		created_at: Math.floor(session.createdAt.getTime() / 1000)
	});
	return json;
}

export async function setSessionTokenCookie(session: SessionWithToken): Promise<void> {
	(await cookies()).set("session", session.token, {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: addSeconds(new Date(), sessionExpiresInSeconds)
	});
}

export async function deleteSessionTokenCookie(): Promise<void> {
	(await cookies()).set("session", "", {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0
	});
}