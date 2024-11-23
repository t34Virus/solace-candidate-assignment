"use client";

import { useEffect, useState, useCallback } from "react";
import { Advocate } from "@/types/Advocate";
import { normalizeString } from "@/utils";
import Card from "@/components/Card/Card";
import Logo from "@/components/Logo/Logo";
import Pagination from "@/components/Pagination/Pagination";

export default function Home() {
  const numberOfAdvocates = 1500;
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/advocates?count=${numberOfAdvocates}`)
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
      setCurrentPage(1);
      setActiveCardIndex(null);

      if (term) {
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
      } else {
        setFilteredAdvocates(advocates);
      }
    },
    [advocates]
  );

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
    setCurrentPage(1);
  }, [advocates]);

  const handleCardClick = (index: number) => {
    setActiveCardIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const paginatedAdvocates = filteredAdvocates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAdvocates.length / itemsPerPage);

  return (
    <main className="p-6">
      <Logo />

      <div className="mt-8">
        <label htmlFor="search" className="block text-gray-600 mb-2">
          {searchTerm ? (
            <>
              Searching for:
              <span className="font-semibold text-gray-800"> {searchTerm}</span>
            </>
          ) : (
            "Search Advocates"
          )}
        </label>
        <div className="flex gap-4 items-center">
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Type a keyword (e.g., 'John Doe')..."
            className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleReset}
            disabled={!searchTerm}
            className="nav_cta-button-new-2 w-button"
          >
            Reset
          </button>
        </div>
        <p className="text-gray-600">
          Showing{" "}
          <span className="font-semibold">{Math.min(itemsPerPage, filteredAdvocates.length)}</span> of{" "}
          <span className="font-semibold">{filteredAdvocates.length}</span> results
        </p>
      </div>

      {filteredAdvocates.length === 0 ? (
        <p className="mt-4 text-red-600">No advocates match your search.</p>
      ) : (
        <div className="bg-primary mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedAdvocates.map((advocate, index) => (
            <Card
              key={index}
              advocate={advocate}
              isActive={index === activeCardIndex}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items);
          setCurrentPage(1);
        }}
      />
    </main>
  );
}
