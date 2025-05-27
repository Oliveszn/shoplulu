import React from "react";
import { Link } from "react-router-dom";

const MobileNav = () => {
  return (
    <div className="px-6 overflow-auto">
      {/* <header>
        <button className="cursor-pointer ml-auto flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M8.17 13.83L13.83 8.17M13.83 13.83L8.17 8.17M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z"
              stroke="#1A0C0B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2 ">
          <h1>LOGO</h1>
        </div>
      </header> */}

      <hr className="my-6" />

      <main className="flex flex-col justify-start">
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-3">
            <li>ALL PRODUCTS</li>
            <li>NEW ARRIVALS</li>
            <li>SS23 COLLECTION</li>
            <li>WINTER COLLECION</li>
          </ul>
          <ul className="flex flex-col gap-3">
            <li>MEN</li>
            <li>WOMEN</li>
            <li>ACCESSORIES</li>
          </ul>
        </div>

        <hr className="my-6" />

        <div>
          <Link>Login</Link>
        </div>

        <hr className="my-6" />

        <div>
          <ul className="flex flex-col gap-3">
            <li>ABOUT</li>
            <li>OUR STORE</li>
            <li>FAQS</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default MobileNav;
