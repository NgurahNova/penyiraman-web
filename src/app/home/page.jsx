import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import React from "react";

const Page = () => {
  return (
    <>
      <div className="flex min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* CONTENT */}
        <div className="flex-grow flex flex-col pl-2 pt-2 pr-2">
          {/* Baris pertama (kotak kiri dan kanan) */}
          <div className="flex">
            {/* Kotak sebelah kiri */}
            <div className="flex flex-col">
              <div className="w-[250px] h-32 bg-blue-500 m-2 rounded-md font-bold text-2xl p-2 text-center">
                Temperature{" "}
              </div>
              <div className="w-[250px] h-32 bg-blue-500 m-2 rounded-md font-bold text-2xl p-2 text-center">
                {" "}
                Humidity
              </div>
            </div>

            {/* Kotak sebelah kanan */}
            <div className="flex-grow  bg-green-500 m-2 rounded-md font-bold text-2xl p-2 text-center flex flex-col items-center">
              <div>Soil Humidity Sensor</div> {/* Judul */}
              <div className="flex h-full gap-52">
                <div className=" mt-2 p-2 rounded-md">sensor 1</div>
                <div className=" mt-2 p-2 rounded-md">sensor 2</div>
                <div className=" mt-2 p-2 rounded-md">sensor 3</div>
                <div className=" mt-2 p-2 rounded-md">sensor 4</div>
                <div className=" mt-2 p-2 rounded-md">sensor 5</div>
              </div>
              {/* Jumlah humidity sensor */}
            </div>
          </div>

          {/* Baris kedua (dua kotak sejajar, height full) */}
          <div className="flex flex-grow mb-12">
            <div className="w-1/2 bg-red-500 m-2 rounded-md font-bold text-2xl p-2 text-center">
              Today History
            </div>
            <div className="w-1/2 bg-yellow-500 m-2 rounded-md font-bold text-2xl p-2 text-center">
              Weekly History
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
