"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../components/firebase";

// Import ikon-ikon alternatif
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { MdOutlineWaterDrop, MdWaterDrop } from "react-icons/md";
import { GiChemicalDrop } from "react-icons/gi";

const menuItems = [
  { path: "/home", label: "Home", icon: IoHomeOutline, activeIcon: IoHome },
  {
    path: "/penyiraman",
    label: "Penyiraman",
    icon: MdOutlineWaterDrop,
    activeIcon: MdWaterDrop,
  },
  {
    path: "/nutrisi",
    label: "Nutrisi",
    icon: GiChemicalDrop,
    activeIcon: GiChemicalDrop,
  },
];

const Navbar = ({ isExpanded, setIsExpanded }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded, setIsExpanded]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  }, [router]);

  return (
    <nav
      className={`bg-gray-800 text-white transition-all duration-300 fixed top-0 left-0 h-screen flex flex-col ${
        isExpanded ? "w-48" : "w-16"
      } shadow-lg z-10`}
      aria-label="Main navigation"
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="p-4 cursor-pointer text-center hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md mx-auto mt-2"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? <IoArrowBack size={24} /> : <RxHamburgerMenu size={24} />}
      </button>

      {/* Menu Items */}
      <ul className="space-y-6 mt-6 flex-grow">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center ${
                  isExpanded ? "px-4" : "px-0 justify-center"
                } py-2 mx-2 rounded-md ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
                } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`${isActive ? "text-white" : "text-gray-300"} ${
                    isExpanded ? "text-xl" : "text-2xl"
                  }`}
                />
                {isExpanded && (
                  <span className="ml-4 truncate">{item.label}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout Button */}
      <div className="p-4 mt-auto mb-8">
        <button
          onClick={handleLogout}
          className={`flex items-center ${
            isExpanded ? "justify-start px-4" : "justify-center px-0"
          } w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400`}
          aria-label="Logout"
        >
          <FiLogOut className={`${isExpanded ? "text-xl" : "text-2xl"}`} />
          {isExpanded && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
