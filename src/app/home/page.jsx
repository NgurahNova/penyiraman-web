"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/components/firebase";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  Thermometer,
  Droplet,
  Clock,
  FlaskConical,
  Ruler,
  Cloud,
} from "lucide-react";
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
    if (value < 30) return "text-red-600";
    if (value < 60) return "text-amber-500";
    return "text-green-600";
  };

  // Function to determine temperature color
  const getTemperatureColor = (value) => {
    if (value > 30) return "text-red-600";
    if (value < 18) return "text-blue-600";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-800">
      <ProtectedRoute>
        <div className="min-h-screen">
          <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          <div
            className={`flex-grow flex flex-col p-6 transition-all duration-300 ${
              isExpanded ? "ml-48" : "ml-2"
            }`}
          >
            {/* Header with Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-400 to-green-500 rounded-2xl shadow-xl mb-8 overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-center p-6">
                <div className="text-white mb-4 md:mb-0">
                  <h1 className="text-4xl font-bold">
                    Smart Greenhouse Monitoring
                  </h1>
                  <p className="text-lg mt-2 opacity-90">
                    Pantau kondisi tanaman Anda secara real-time
                  </p>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <Clock className="mr-3 text-white" />
                  <span className="text-2xl font-medium text-white">
                    {time}
                  </span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 flex justify-center md:justify-start gap-6 flex-wrap">
                <div className="flex items-center text-white">
                  <Thermometer className="mr-2" />
                  <span>
                    Suhu: <strong>{temperature}°C</strong>
                  </span>
                </div>
                <div className="flex items-center text-white">
                  <Droplet className="mr-2" />
                  <span>
                    Rata-rata Kelembaban:{" "}
                    <strong>
                      {Math.round(
                        Object.values(soilMoisture).reduce((a, b) => a + b, 0) /
                          Object.values(soilMoisture).length
                      )}
                      %
                    </strong>
                  </span>
                </div>
                <div className="flex items-center text-white">
                  <FlaskConical className="mr-2" />
                  <span>
                    TDS: <strong>{tdsValue} ppm</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Penyiraman Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-700">
                <Droplet className="mr-2 text-blue-500" />
                <span>Sistem Penyiraman</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Temperature Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-cyan-400">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-700">
                        Suhu Greenhouse
                      </h3>
                      <div className="bg-red-100 p-2 rounded-full">
                        <Thermometer className="text-red-500" size={20} />
                      </div>
                    </div>
                    <div
                      className={`text-5xl font-bold mt-4 ${getTemperatureColor(
                        temperature
                      )}`}
                    >
                      {temperature}°C
                    </div>
                    <p className="text-gray-500 mt-2 text-sm">
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
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-blue-400"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-700">
                          {sensor.replace("sensor_", "Sensor ")}
                        </h3>
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Droplet className="text-blue-500" size={20} />
                        </div>
                      </div>
                      <div
                        className={`text-5xl font-bold mt-4 ${getMoistureColor(
                          soilMoisture[sensor]
                        )}`}
                      >
                        {soilMoisture[sensor]}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                        <div
                          className={`${
                            soilMoisture[sensor] < 30
                              ? "bg-red-500"
                              : soilMoisture[sensor] < 60
                              ? "bg-amber-500"
                              : "bg-green-500"
                          } h-3 rounded-full transition-all`}
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
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-700">
                <FlaskConical className="mr-2 text-green-500" />
                <span>Sistem Nutrisi</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Water Temperature Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-cyan-400">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-700">
                        Suhu Air
                      </h3>
                      <div className="bg-cyan-100 p-2 rounded-full">
                        <Thermometer className="text-cyan-500" size={20} />
                      </div>
                    </div>
                    <div
                      className={`text-5xl font-bold mt-4 ${getTemperatureColor(
                        temperaturetds
                      )}`}
                    >
                      {temperaturetds}°C
                    </div>
                    <p className="text-gray-500 mt-2 text-sm">
                      {temperaturetds > 30
                        ? "Suhu air tinggi"
                        : temperaturetds < 18
                        ? "Suhu air rendah"
                        : "Suhu air optimal"}
                    </p>
                  </div>
                </div>

                {/* TDS Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-green-400 ">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        Nilai TDS
                      </h3>
                      <FlaskConical className="text-green-500" size={24} />
                    </div>
                    <div className="text-5xl font-bold mt-4 text-green-600">
                      {tdsValue} <span className="text-2xl">ppm</span>
                    </div>
                    <p className="text-gray-600 mt-3 text-sm">
                      {tdsValue < 560
                        ? "Nutrisi rendah"
                        : tdsValue > 900
                        ? "Nutrisi tinggi"
                        : "Nutrisi optimal"}
                    </p>
                  </div>
                </div>

                {/* Ultrasonic Sensor 1 */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        Level Tangki 1
                      </h3>
                      <Ruler
                        className={`${
                          distance1 <= 35
                            ? "text-green-500"
                            : distance1 < 40
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                        size={24}
                      />
                    </div>
                    <div className="text-5xl font-bold mt-4 text-yellow-600">
                      {distance1} <span className="text-2xl">CM</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div
                        className={`${
                          distance1 <= 35
                            ? "bg-green-500"
                            : distance1 < 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        } h-3 rounded-full transition-all`}
                        style={{
                          // Progress bar decreases as distance increases
                          width: `${
                            (distance1 / 40) * 100 > 100
                              ? 0
                              : 100 - (distance1 / 40) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Ultrasonic Sensor 2 */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        Level Tangki 2
                      </h3>
                      <Ruler
                        className={`${
                          distance2 <= 35
                            ? "text-green-500"
                            : distance2 < 40
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                        size={24}
                      />
                    </div>
                    <div className="text-5xl font-bold mt-4 text-yellow-600">
                      {distance2} <span className="text-2xl">CM</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div
                        className={`${
                          distance1 <= 35
                            ? "bg-green-500"
                            : distance1 < 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        } h-3 rounded-full transition-all`}
                        style={{
                          // Progress bar decreases as distance increases
                          width: `${
                            (distance2 / 40) * 100 > 100
                              ? 0
                              : 100 - (distance2 / 40) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status Overview Section */}
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default Page;
