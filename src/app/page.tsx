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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Type a keyword (e.g., 'John Doe')..."
          style={{ border: "1px solid black", width: "25%" }}
        />
        <button onClick={handleReset}>Reset</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr key={`advocateNum${index}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((specialty, jindex) => (
                    <div key={`advocateNum${index}Specialty${jindex}`}
                    >{specialty}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}