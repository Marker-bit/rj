import { put } from "@vercel/blob";

export const runtime = "edge";

export async function PUT(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File;
  const randomId = Math.random().toString(36).slice(2);
  const blob = await put(randomId, file, { access: "public" });

  return Response.json(blob);
}
