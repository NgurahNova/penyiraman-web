"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 fixed bottom-0 w-full text-right pr-6 lg:text-center z-50">
      <div className="max-w-xl mx-auto px-5">
        <p>
          &copy; {new Date().getFullYear()} Penyiraman. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
