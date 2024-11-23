"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  const handleClick = () => {
    router.push("https://www.solace.health/");
  };

  return (
    <div
      className="cursor-pointer"
      onClick={handleClick}
      aria-label="Go to Solace Health Homepage"
    >
        <Image
            src="/logo.svg"
            alt="Solace Health Logo"
            width={150} 
            height={50} 
            style={{ width: 150, height: 50 }}
            priority
        />
    </div>
  );
}
