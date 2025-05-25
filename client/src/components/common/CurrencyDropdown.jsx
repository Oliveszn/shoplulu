import React from "react";
import { useState } from "react";

const CurrencyDropdown = () => {
  const [currency, setCurrency] = useState("NGN");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    setIsOpen(false);
  };
  return (
    <div className="relative ml-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-all"
      >
        <span>{currency}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full bg-white text-black rounded-md shadow-lg z-50">
          <button
            onClick={() => handleSelect("NGN")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
              currency === "NGN" ? "bg-gray-100 font-medium" : ""
            }`}
          >
            NGN
          </button>
          <button
            onClick={() => handleSelect("USD")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
              currency === "USD" ? "bg-gray-100 font-medium" : ""
            }`}
          >
            USD
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
