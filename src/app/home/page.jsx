"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/components/firebase";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Thermometer, Droplet, Clock, FlaskConical, Ruler } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

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
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperature(data.temperature);
        setSoilMoisture(data.soil_moisture);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const dataRef = ref(database, "MonitoringNutrisi/realtime");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDistance1(data.distance1);
        setDistance2(data.distance2);
        setTdsValue(data.tdsValue);
        setTemperatureTds(data.temperaturetds);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to determine moisture level color
  const getMoistureColor = (value) => {
    if (value < 30) return "text-red-500";
    if (value < 60) return "text-yellow-500";
    return "text-green-500";
  };

  // Function to determine temperature color
  const getTemperatureColor = (value) => {
    if (value > 30) return "text-red-500";
    if (value < 18) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <div className=" min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <ProtectedRoute>
        <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <div className="min-h-screen bg-gray-900 text-white">
          <div
            className={`flex-grow flex flex-col p-6 transition-all duration-300 ${
              isExpanded ? "ml-48" : "ml-14"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text text-white">
                Dashboard Monitoring
              </h1>{" "}
              <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg shadow-lg ">
                <Clock className="mr-2 text-blue-400" />
                <span className="text-xl font-medium ">{time}</span>
              </div>
            </div>

            {/* Penyiraman Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Droplet className="mr-2 text-blue-400" />
                <span>Sistem Penyiraman</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Temperature Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-300">
                        Suhu Greenhouse
                      </h3>
                      <Thermometer className="text-red-400" size={24} />
                    </div>
                    <div
                      className={`text-5xl font-bold mt-3 ${getTemperatureColor(
                        temperature
                      )}`}
                    >
                      {temperature}°C
                    </div>
                    <p className="text-gray-400 mt-2 text-sm">
                      {temperature > 30
                        ? "Suhu terlalu tinggi"
                        : temperature < 18
                        ? "Suhu terlalu rendah"
                        : "Suhu optimal"}
                    </p>
                  </div>
                </div>

                {/* Soil Moisture Cards */}
                {Object.keys(soilMoisture).map((sensor, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-300">
                          {sensor.replace("sensor_", "Sensor ")}
                        </h3>
                        <Droplet className="text-blue-400" size={24} />
                      </div>
                      <div
                        className={`text-5xl font-bold mt-3 ${getMoistureColor(
                          soilMoisture[sensor]
                        )}`}
                      >
                        {soilMoisture[sensor]}%
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${soilMoisture[sensor]}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrisi Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FlaskConical className="mr-2 text-green-400" />
                <span>Sistem Nutrisi</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Water Temperature Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-900/30 hover:shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-300">
                        Suhu Air
                      </h3>
                      <Thermometer className="text-blue-400" size={24} />
                    </div>
                    <div
                      className={`text-5xl font-bold mt-3 ${getTemperatureColor(
                        temperaturetds
                      )}`}
                    >
                      {temperaturetds}°C
                    </div>
                    <p className="text-gray-400 mt-2 text-sm">
                      {temperaturetds > 30
                        ? "Suhu air tinggi"
                        : temperaturetds < 18
                        ? "Suhu air rendah"
                        : "Suhu air optimal"}
                    </p>
                  </div>
                </div>

                {/* TDS Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-900/30 hover:shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-300">
                        Nilai TDS
                      </h3>
                      <FlaskConical className="text-green-400" size={24} />
                    </div>
                    <div className="text-5xl font-bold mt-3 text-green-500">
                      {tdsValue} <span className="text-2xl">ppm</span>
                    </div>
                    <p className="text-gray-400 mt-2 text-sm">
                      {tdsValue < 500
                        ? "Nutrisi rendah"
                        : tdsValue > 1500
                        ? "Nutrisi tinggi"
                        : "Nutrisi optimal"}
                    </p>
                  </div>
                </div>

                {/* Ultrasonic Sensor 1 */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-900/30 hover:shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-300">
                        Level Tangki 1
                      </h3>
                      <Ruler className="text-yellow-400" size={24} />
                    </div>
                    <div className="text-5xl font-bold mt-3 text-yellow-500">
                      {distance1} <span className="text-2xl">CM</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                      <div
                        className="bg-yellow-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            100 -
                            ((distance1 / 30) * 100 > 100
                              ? 100
                              : (distance1 / 30) * 100)
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Ultrasonic Sensor 2 */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-900/30 hover:shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-300">
                        Level Tangki 2
                      </h3>
                      <Ruler className="text-yellow-400" size={24} />
                    </div>
                    <div className="text-5xl font-bold mt-3 text-yellow-500">
                      {distance2} <span className="text-2xl">CM</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                      <div
                        className="bg-yellow-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            100 -
                            ((distance2 / 30) * 100 > 100
                              ? 100
                              : (distance2 / 30) * 100)
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default Page;
