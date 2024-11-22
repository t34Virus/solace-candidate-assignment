"use client";

import { useEffect, useState, useCallback } from "react";
import { Advocate } from "@/types/Advocate";
import { normalizeString } from "@/utils";
import Card from "@/components/Card/Card";

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
          className="nav_cta-button-new-2 w-button"
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
      <div className="bg-primary mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredAdvocates.map((advocate, index) => (
          <Card key={index} advocate={advocate} />
        ))}
      </div>

      {/* No Results */}
      {filteredAdvocates.length === 0 && (
        <p className="mt-4 text-red-600">No advocates match your search.</p>
      )}
    </main>
  );
}
