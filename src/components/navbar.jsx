"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaWater, FaHome, FaNutritionix } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../components/firebase"; // Sesuaikan path

const Navbar = ({ isExpanded, setIsExpanded }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect ke login setelah logout
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };

  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 fixed top-0 left-0 h-screen flex flex-col ${
        isExpanded ? "w-48" : "w-16"
      }`}
    >
      {/* Toggle Sidebar */}
      <div>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-4 cursor-pointer text-center"
        >
          {isExpanded ? <IoArrowBack size={24} /> : <RxHamburgerMenu size={24} />}
        </div>

        {/* Menu Items */}
        <ul className="space-y-6 mt-6 flex-grow">
          <li className="flex items-center px-4">
            <Link href="/home" className="flex items-center">
              <FaHome className="text-xl ml-2" />
              <p className={`ml-4 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                Home
              </p>
            </Link>
          </li>
          <li className="flex items-center px-4">
            <Link href="/penyiraman" className="flex items-center">
              <FaWater className="text-xl ml-2" />
              <p className={`ml-4 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                Penyiraman
              </p>
            </Link>
          </li>
          <li className="flex items-center px-4">
            <Link href="/nutrisi" className="flex items-center">
              <FaNutritionix className="text-xl ml-2" />
              <p className={`ml-4 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                Nutrisi
              </p>
            </Link>
          </li>
        </ul>
      </div>

      {/* Tombol Logout - Lebih Naik */}
      <div className="p-4 mt-auto mb-16">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
        >
          <FiLogOut className="text-xl" />
          {isExpanded && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
