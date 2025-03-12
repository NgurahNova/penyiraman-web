"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/components/firebase";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const Page = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState({
    sensor_1: 0,
    sensor_2: 0,
    sensor_3: 0,
    sensor_4: 0,
    sensor_5: 0,
  });
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [distance1, setDistance1] = useState(0);
  const [distance2, setDistance2] = useState(0);
  const [tdsValue, setTdsValue] = useState(0);
  const [temperaturetds, setTemperatureTds] = useState(0);

  useEffect(() => {
    const dataRef = ref(database, "realtime_data");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperature(data.temperature);
        setSoilMoisture(data.soil_moisture);
      }
    });
  }, []);

  useEffect(() => {
    const dataRef = ref(database, "MonitoringNutrisi/realtime");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDistance1(data.distance1);
        setDistance2(data.distance2);
        setTdsValue(data.tdsValue);
        setTemperatureTds(data.temperaturetds);
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex min-h-screen">
        {/* Navbar */}
        <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

        {/* Konten utama */}
        <div
          className={`flex-grow flex flex-col p-4 transition-all duration-300 ${
            isExpanded ? "ml-48" : "ml-14"
          }`}
        >
          <h1 className="text-2xl font-bold">Penyiraman</h1>
          {/* Baris 1 */}
          <div className="flex">
            <div className="flex flex-col">
              <div className="w-[250px] h-32 bg-gray-700 m-2 rounded-md text-center text-xl font-bold pt-4">
                Greenhouse Temperature
                <div className="text-5xl p-4">{temperature}°C</div>
              </div>
              <div className="w-[250px] h-32 bg-gray-700 m-2 rounded-md text-center text-xl font-bold pt-4">
                Time
                <div className="text-5xl p-4">{time}</div>
              </div>
            </div>
            <div className="flex-grow bg-gray-700 m-2 rounded-md text-xl font-bold pt-6 text-center flex flex-col items-center">
              <div>Soil Humidity Sensor</div>
              <div className="flex gap-40">
                {Object.keys(soilMoisture).map((sensor, index) => (
                  <div key={index} className="w-full mt-10 p-2 rounded-md">
                    {sensor.replace("sensor_", "Sensor ")}
                    <div className="text-5xl font-bold pt-4">
                      {soilMoisture[sensor]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold">Nutrisi</h1>
          {/* Baris 2 */}
          <div className="flex mt-4">
            <div className="flex flex-col">
              <div className="w-[250px] h-32 bg-gray-700 m-2 rounded-md text-center text-xl font-bold pt-4">
                Water Temperature
                <div className="text-4xl p-4">{temperaturetds}°C</div>
              </div>
              <div className="w-[250px] h-32 bg-gray-700 m-2 rounded-md text-center text-xl font-bold pt-4">
                TDS
                <div className="text-4xl p-4">{tdsValue} ppm</div>
              </div>
            </div>
            <div className="flex-grow bg-gray-700 m-2 rounded-md text-2xl font-bold pt-6 text-center flex flex-col items-center">
              <div>Ultrasonic Sensor</div>
              <div className="flex gap-40">
                <div className="w-full mt-10 p-2 rounded-md">
                  Sensor 1
                  <div className="text-4xl font-bold pt-4">{distance1} CM</div>
                </div>
                <div className="w-full mt-10 p-2 rounded-md">
                  Sensor 2
                  <div className="text-4xl font-bold pt-4">{distance2} CM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
