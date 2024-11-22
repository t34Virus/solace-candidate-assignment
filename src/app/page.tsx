"use client";

import { useEffect, useState, useCallback } from "react";
import { Advocate } from "@/types/Advocate";
import { normalizeString } from "@/utils";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetch("/api/advocates")
      .then((response) => response.json())
      .then(({ data }: { data: Advocate[] }) => {
        setAdvocates(data);
        setFilteredAdvocates(data);
      })
      .catch((error) => console.error("Error fetching advocates:", error));
  }, []);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setSearchTerm(term);

      const filtered = advocates.filter((advocate) => {
        const searchableContent = [
          advocate.firstName,
          advocate.lastName,
          advocate.city,
          advocate.degree,
          advocate.yearsOfExperience,
          ...advocate.specialties,
        ]
          .filter((field): field is string => typeof field === "string" && field !== null)
          .map(normalizeString)
          .join(" ");

        return searchableContent.includes(normalizeString(term));
      });

      setFilteredAdvocates(filtered);
    },
    [advocates]
  );

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  }, [advocates]);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Solace Advocates</h1>

      {/* Search Section */}
      <div className="mt-8">
        <label htmlFor="search" className="block text-gray-600 mb-2">
          Search Advocates
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Type a keyword (e.g., 'John Doe')..."
          className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleReset}
          disabled={!searchTerm}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Reset
        </button>
      </div>

      {/* Display Search Term */}
      {searchTerm && (
        <p className="mt-4 text-gray-600">
          Searching for: <span className="font-semibold text-gray-800">{searchTerm}</span>
        </p>
      )}

      {/* Advocates Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {filteredAdvocates.map((advocate, index) => (
    <div
      key={index}
      className="w-64 h-64 border border-gray-300 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 group relative flex flex-col items-center justify-center text-center"
    >
      <h3 className="text-base font-semibold text-gray-800">{`${advocate.firstName || "N/A"} ${advocate.lastName || "N/A"}`}</h3>
      <p className="text-sm text-gray-600">{advocate.city || "N/A"}</p>
      <p className="text-sm text-gray-600">{advocate.degree || "N/A"}</p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Experience:</span>{" "}
        {advocate.yearsOfExperience || "N/A"}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Phone:</span>{" "} 
        {advocate.phoneNumber || "N/A"}
      </p>
      {/* Specialties */}
      <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 rounded-lg overflow-hidden">
        <h3 className="text-base font-semibold text-gray-800">Specialties</h3>
        <ul className="mt-2 max-h-48 overflow-y-auto w-full">
          {advocate.specialties.map((specialty, idx) => (
            <li
              key={idx}
              className={`text-sm px-2 py-1 ${
                idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
              }`}
            >
              {specialty}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ))}
</div>



      {/* No Results */}
      {filteredAdvocates.length === 0 && (
        <p className="mt-4 text-red-600">No advocates match your search.</p>
      )}
    </main>
  );
}
