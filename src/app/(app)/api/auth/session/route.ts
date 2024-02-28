import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";
import { Session, User } from "lucia";

export async function GET(req: NextRequest) {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return NextResponse.json({
				user: null,
				session: null
			});
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return NextResponse.json(result);
}