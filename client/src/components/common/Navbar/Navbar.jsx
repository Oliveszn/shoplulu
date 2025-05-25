import React from "react";
import { Link } from "react-router-dom";
import CurrencyDropdown from "../CurrencyDropdown";

const Navbar = () => {
  let links = [
    { name: "SHOP", link: "/shop" },
    { name: "ABOUT", link: "/about" },
    { name: "OUR STORE", link: "/ourstore" },
  ];

  let secLinks = [
    { name: "SHOP", link: "/shop" },
    { name: "ABOUT", link: "/about" },
    { name: "OUR STORE", link: "/ourstore" },
  ];
  return (
    <nav className="w-full fixed z-50 top-0 bg-red-800">
      <div className="flex flex-row container mx-auto items-center bg-green-600">
        <ul className="flex flex-row items-center justify-start flex-gro bg-red-400">
          {links.map((item) => (
            <li key={item.name} className="mr-6">
              <Link to={item.link} key={item.name} className="">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="absolute left-1/2 transform -translate-x-1/2 ">
          <h1>LOGO</h1>
        </div>

        <div className="flex items-center ml-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <g id="search">
              <g id="Group">
                <path
                  id="Vector"
                  d="M7.61169 13.2234C10.7109 13.2234 13.2234 10.7109 13.2234 7.61169C13.2234 4.51244 10.7109 2 7.61169 2C4.51244 2 2 4.51244 2 7.61169C2 10.7109 4.51244 13.2234 7.61169 13.2234Z"
                  stroke="#1A0C0B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  id="Vector_2"
                  d="M11.5143 11.8057L13.7143 14"
                  stroke="#1A0C0B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </g>
          </svg>
          <CurrencyDropdown />

          <Link>LOGIN</Link>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <g id="paper-bag">
              <g id="Group 28">
                <path
                  id="Vector"
                  d="M13.013 14.0003H2.89706C2.77032 14.0003 2.66663 13.8966 2.66663 13.7698V4.76144C2.66663 4.6347 2.77032 4.53101 2.89706 4.53101H13.013C13.1397 4.53101 13.2434 4.6347 13.2434 4.76144V13.7698C13.2434 13.8966 13.1397 14.0003 13.013 14.0003ZM3.12749 13.5394H12.7826V4.99187H3.12749V13.5394Z"
                  fill="#1A0C0B"
                  stroke="#1A0C0B"
                  stroke-width="0.8"
                ></path>
                <path
                  id="Vector_2"
                  d="M10.4953 6.83619C10.3609 6.83619 10.2509 6.72622 10.2509 6.5918V4.19272C10.2509 2.88524 9.18782 1.82215 7.88034 1.82215C6.57286 1.82215 5.50977 2.88524 5.50977 4.19272V6.5918C5.50977 6.72622 5.3998 6.83619 5.26538 6.83619C5.13097 6.83619 5.021 6.72622 5.021 6.5918V4.19272C5.021 2.61641 6.30404 1.33337 7.88034 1.33337C9.45665 1.33337 10.7397 2.61641 10.7397 4.19272V6.5918C10.7397 6.72622 10.6297 6.83619 10.4953 6.83619Z"
                  fill="#1A0C0B"
                  stroke="#1A0C0B"
                  stroke-width="0.8"
                ></path>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
