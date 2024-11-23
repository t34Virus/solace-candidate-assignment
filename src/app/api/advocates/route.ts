import { generateAdvocates } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const itemsPerPage = parseInt(url.searchParams.get("itemsPerPage") || "25", 10);

  const totalAdvocates = 1500000; 
  const advocates = generateAdvocates(totalAdvocates);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = advocates.slice(startIndex, startIndex + itemsPerPage);

  return new Response(
    JSON.stringify({
      data: paginatedData,
      totalItems: totalAdvocates,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

