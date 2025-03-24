import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../components/firebase";
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { MdOutlineWaterDrop, MdWaterDrop } from "react-icons/md";
import { GiChemicalDrop } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  // Effect to close menu when changing routes or resizing window
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-8 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-white">
                Smart Farming System
              </span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center px-3 py-2 rounded-md text-mb font-bold transition-colors duration-200 lg:text-lg ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-300 hover:text-blue-500"
                  }`}
                >
                  <Icon className="mr-1.5 text-lg" />
                  <span className={`${isActive ? "" : "relative"}`}>
                    {item.label}
                    {!isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Logout button positioned at the far right */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-bold text-red-600 hover:bg-red-700 hover:text-white transition-all duration-300 lg:text-lg ${
                isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiLogOut
                className={`mr-1.5 text-lg ${
                  isLoggingOut ? "animate-spin" : "animate-pulse"
                }`}
              />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-400 hover:text-blue-500 hover:bg-gray-700"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <HiX className="block h-8 w-8" aria-hidden="true" />
              ) : (
                <HiMenu className="block h-8 w-8" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with larger size */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-3 pt-3 pb-4 space-y-3 sm:px-4 border-t border-gray-700">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center px-4 py-3 rounded-md text-lg font-medium ${
                    isActive
                      ? "bg-gray-700 text-blue-500"
                      : "text-gray-300 hover:bg-gray-700 hover:text-blue-500"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="mr-3 text-xl" />
                  <span className={`${isActive ? "" : "relative"}`}>
                    {item.label}
                    {!isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Mobile logout button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full flex items-center px-4 py-3 rounded-md text-lg font-medium text-red-500 hover:bg-red-700 hover:text-white ${
                isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiLogOut
                className={`mr-3 text-xl ${
                  isLoggingOut ? "animate-spin" : "animate-pulse"
                }`}
              />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
