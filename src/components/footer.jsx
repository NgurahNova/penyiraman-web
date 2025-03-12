import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 fixed bottom-0 w-full text-center">
      <div className="max-w-6xl mx-auto px-5">
        <p>
          &copy; {new Date().getFullYear()} Penyiraman. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
