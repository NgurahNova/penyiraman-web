"use client";
import React from "react";
import Link from "next/link";
import { FaWater, FaHome, FaNutritionix } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = ({ isExpanded, setIsExpanded }) => {
  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 h-screen fixed top-0 left-0 ${
        isExpanded ? "w-48" : "w-16"
      }`}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer text-center ml-2"
      >
        {isExpanded ? <IoArrowBack size={24} /> : <RxHamburgerMenu size={24} />}
      </div>
      <ul className="space-y-6 mt-6">
        <li className="flex items-center px-4">
          <Link href="/home" className="flex items-center">
            <FaHome className="text-xl ml-2" />
            <p
              className={`ml-4 transition-opacity duration-300 transform ${
                isExpanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-0"
              }`}
            >
              Home
            </p>
          </Link>
        </li>
        <li className="flex items-center px-4">
          <Link href="/penyiraman" className="flex items-center">
            <FaWater className="text-xl ml-2" />
            <p
              className={`ml-4 transition-opacity duration-300 transform ${
                isExpanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-0"
              }`}
            >
              Penyiraman
            </p>
          </Link>
        </li>
        <li className="flex items-center px-4">
          <Link href="/nutrisi" className="flex items-center">
            <FaNutritionix className="text-xl ml-2" />
            <p
              className={`ml-4 transition-opacity duration-300 transform ${
                isExpanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-0"
              }`}
            >
              Nutrisi
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
