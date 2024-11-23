"use client";

import { useEffect, useState, useCallback } from "react";
import { Advocate } from "@/types/Advocate";
import { normalizeString } from "@/utils";
import Card from "@/components/Card/Card";
import Logo from "@/components/Logo/Logo";
import Pagination from "@/components/Pagination/Pagination";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of advocates

  const fetchAdvocates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/advocates?page=${currentPage}&itemsPerPage=${itemsPerPage}`
      );
      const { data, totalItems }: { data: Advocate[]; totalItems: number } = await response.json();
      setAdvocates(data);
      setFilteredAdvocates(data);
      setTotalItems(totalItems);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
    setCurrentPage(1);
  };

  const handleCardClick = (index: number) => {
    setActiveCardIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <main className="p-6">
      <Logo />

      <div className="mt-8">
        <label htmlFor="search" className="block text-gray-600 mb-2">
          Search Advocates
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
        <p className="text-gray-600 mt-2">
          Showing{" "}
          <span className="font-semibold">{filteredAdvocates.length}</span> of{" "}
          <span className="font-semibold">{totalItems}</span> results
        </p>
      </div>

      {loading ? (
        <p className="mt-4 text-blue-600">Loading advocates...</p>
      ) : filteredAdvocates.length === 0 ? (
        <p className="mt-4 text-red-600">No advocates match your search.</p>
      ) : (
        <div className="bg-primary mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAdvocates.map((advocate, index) => (
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
