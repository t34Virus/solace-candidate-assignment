"use client";

import { FC } from "react";
import { Advocate } from "@/types/Advocate";
import "./Card.css";

interface CardProps {
  advocate: Advocate;
  isActive: boolean;
  onClick: () => void;
}

const Card: FC<CardProps> = ({ advocate, isActive, onClick }) => {
  return (
    <div
      className={`card group relative ${isActive ? "active" : ""}`}
      onClick={onClick} 
    >
      <h3 className="text-base font-semibold text-gray-800">
        {`${advocate.firstName || "N/A"} ${advocate.lastName || "N/A"}`}
      </h3>
      <p className="text-sm text-gray-600">{advocate.city || "N/A"}</p>
      <p className="text-sm text-gray-600">{advocate.degree || "N/A"}</p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Experience:</span>{" "}
        {advocate.yearsOfExperience || "N/A"}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Phone:</span> {advocate.phoneNumber || "N/A"}
      </p>
      <div className={`card-overlay ${isActive ? "visible" : ""}`}>
        <h3 className="text-base font-semibold text-gray-800">Specialties</h3>
        <ul className="specialties-list">
          {advocate.specialties.map((specialty, idx) => (
            <li key={idx} className="specialties-item">
              {specialty}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Card;
