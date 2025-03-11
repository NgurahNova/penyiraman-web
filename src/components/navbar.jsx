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
        isExpanded ? "w-48" : "w-14"
      }`}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer text-center"
      >
        {isExpanded ? <IoArrowBack size={24} /> : <RxHamburgerMenu size={24} />}
      </div>
      <ul className="space-y-6 mt-6">
        <li className="flex items-center px-4">
          <FaHome className="text-xl" />
          {isExpanded && <Link href="/home" className="ml-4">Home</Link>}
        </li>
        <li className="flex items-center px-4">
          <FaWater className="text-xl" />
          {isExpanded && <Link href="/penyiraman" className="ml-4">Penyiraman</Link>}
        </li>
        <li className="flex items-center px-4">
          <FaNutritionix className="text-xl" />
          {isExpanded && <Link href="/nutrisi" className="ml-4">Nutrisi</Link>}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
