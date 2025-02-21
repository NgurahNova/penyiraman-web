"use client";

import React, { useState } from "react";
import { FaHome, FaWater, FaTachometerAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className={`navbar ${isExpanded ? "expanded" : ""}`}>
        <div onClick={toggleNavbar} className="px-2 py-5 cursor-pointer">
          {isExpanded ? (
            <IoArrowBack size={20} />
          ) : (
            <RxHamburgerMenu size={20} />
          )}
        </div>
        <ul className="space-y-4">
          <li className="flex items-center space-x-4">
            <FaHome className="text-xl" />
            {isExpanded && <span className="flex-grow text-center">Home</span>}
          </li>
          <li className="flex items-center space-x-4">
            <FaWater className="text-xl" />
            {isExpanded && (
              <span className="flex-grow text-center">Penyiraman</span>
            )}
          </li>
          <li className="flex items-center space-x-4">
            <FaTachometerAlt className="text-xl" />
            {isExpanded && (
              <span className="flex-grow text-center">Monitoring Air</span>
            )}
          </li>
        </ul>
        <style jsx>{`
          .navbar {
            position: sticky;
            top: 0;
            left: 0;
            width: ${isExpanded ? "200px" : "50px"};
            transition: width 0.3s;
            background-color: #333;
            color: white;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 1000;
          }
          .toggle-icon {
            margin: 10px;
            background-color: #444;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            display: flex;
            align-items: center;
            padding: 10px;
            cursor: pointer;
          }
          li span {
            margin-left: 10px;
          }
        `}</style>
      </div>
    </>
  );
};

export default Navbar;
