import db from "../../../db";
import { advocates } from "../../../db/schema";
import { generateAdvocates } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const count = Number(url.searchParams.get("count")) || 50; 

  const data = generateAdvocates(count);

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json" },
  });
}
