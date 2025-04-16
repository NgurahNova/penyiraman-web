"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 fixed bottom-0 w-full text-center z-50">
      <div className="max-w-xl mx-auto px-5 text-black">
        <p>
          &copy; {new Date().getFullYear()} Penyiraman. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
