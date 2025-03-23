"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/components/firebase";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Sprout } from "lucide-react";
import {
  Thermometer,
  Droplet,
  Clock,
  FlaskConical,
  Ruler,
  RefreshCw,
} from "lucide-react";
import { Collapse } from "react-collapse";
import TriggerRelay from "@/components/triggernutrisi";
import TriggerRestart from "@/components/triggerrestart";

const Page = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [distance1, setDistance1] = useState(0);
  const [distance2, setDistance2] = useState(0);
  const [relayA, setRelayA] = useState(false);
  const [relayB, setRelayB] = useState(false);
  const [tdsValue, setTdsValue] = useState(0);
  const [temperaturetds, setTemperatureTds] = useState(0);
  const [historyData, setHistoryData] = useState({});
  const [expandedDate, setExpandedDate] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    const dataRef = ref(database, "MonitoringNutrisi/realtime");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDistance1(data.distance1);
        setDistance2(data.distance2);
        setRelayA(data.relayA);
        setRelayB(data.relayB);
        setTdsValue(data.tdsValue);
        setTemperatureTds(data.temperaturetds);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch historical data from Firebase
  useEffect(() => {
    const historyRef = ref(database, "MonitoringNutrisi/history");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHistoryData(data);
      }
    });
  }, []);

  // Toggle the date collapse
  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  // Function to sort data by date (latest first)
  const sortedHistoryDates = Object.keys(historyData).sort().reverse();

  // Function to sort time entries by time (latest first)
  const sortedTimeEntries = (date) => {
    return historyData[date]
      ? Object.keys(historyData[date]).sort().reverse()
      : [];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to determine temperature color
  const getTemperatureColor = (value) => {
    if (value > 30) return "text-red-500";
    if (value < 18) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <div className="bg-gray-900 text-white">
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          <div
            className={`flex-grow flex flex-col p-6 transition-all duration-300 ${
              isExpanded ? "ml-48" : "ml-16"
            }`}
          >
            {/* Nutrisi Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text text-white">
                Nutrisi
              </h1>{" "}
              <div className="flex md:items-center w-fit mt-4 md:mt-0 bg-gray-800 px-4 py-2 rounded-lg shadow-lg ">
                <Clock className="mr-2 text-blue-400" />
                <span className="text-xl font-medium ">{time}</span>
              </div>
            </div>

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
                    {tdsValue < 560
                      ? "Nutrisi rendah"
                      : tdsValue > 900
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
              {/* Restart Button Card */}
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-red-900/30 hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-300">
                      Restart Perangkat
                    </h3>
                    <RefreshCw className="text-red-400" size={24} />
                  </div>
                  <div className="mt-3 flex justify-center">
                    <div className="scale-110">
                      <TriggerRestart />
                    </div>
                  </div>
                  <p className="text-gray-400 mt-4 text-sm text-center">
                    Gunakan tombol ini untuk merestart perangkat
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-green-900/30 hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-300">
                      Kontrol Nutrisi Manual
                    </h3>
                    <Sprout className="text-green-400" size={24} />
                  </div>
                  <div className="mt-3 flex justify-center">
                    <div className="scale-110">
                      <TriggerRelay />
                    </div>
                  </div>
                  <p className="text-gray-400 mt-4 text-sm text-center">
                    Gunakan tombol ini untuk mengaktifkan pompa nutrisi
                  </p>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-4 mt-4 flex items-center ">
                <Clock className="mr-2 text-blue-400" />
                <span>Riwayat Data</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Today's History */}
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-300">
                        Riwayat Hari Ini
                      </h3>
                    </div>
                    <div className="h-96 overflow-y-auto">
                      {sortedTimeEntries(getTodayDate()).length > 0 ? (
                        sortedTimeEntries(getTodayDate()).map((time) => (
                          <div key={time} className="mb-2">
                            <div
                              className="cursor-pointer bg-gray-700 p-3 rounded-lg text-left flex justify-between items-center"
                              onClick={() => toggleDate(time)}
                            >
                              <span className="font-medium">{time}</span>
                              <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                                {expandedDate === time
                                  ? "Sembunyikan"
                                  : "Detail"}
                              </span>
                            </div>
                            <Collapse isOpened={expandedDate === time}>
                              <div className="bg-gray-700 p-4 rounded-b-lg mt-1 text-left">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-gray-300">
                                    Suhu Air:
                                    <span className="ml-2 text-white">
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.temperaturetds
                                      }
                                      °C
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-300">
                                    TDS:
                                    <span className="ml-2 text-white">
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.tdsValue
                                      }{" "}
                                      PPM
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-300">
                                    Level Tangki 1:
                                    <span className="ml-2 text-white">
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.distance1
                                      }{" "}
                                      CM
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-300">
                                    Level Tangki 2:
                                    <span className="ml-2 text-white">
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.distance2
                                      }{" "}
                                      CM
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-300">
                                    Relay A:
                                    <span
                                      className={`ml-2 ${
                                        historyData[getTodayDate()]?.[time]
                                          ?.relayA
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {historyData[getTodayDate()]?.[time]
                                        ?.relayA
                                        ? "ON"
                                        : "OFF"}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-300">
                                    Relay B:
                                    <span
                                      className={`ml-2 ${
                                        historyData[getTodayDate()]?.[time]
                                          ?.relayB
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {historyData[getTodayDate()]?.[time]
                                        ?.relayB
                                        ? "ON"
                                        : "OFF"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Collapse>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-400">
                          Tidak ada data untuk hari ini
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* All History */}
                <div className="bg-gray-800 rounded-xl pb-10 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg ">
                  <div className="p-4 ">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-300">
                        Semua Riwayat
                      </h3>
                    </div>
                    <div className="h-96 overflow-y-auto">
                      {sortedHistoryDates.length > 0 ? (
                        sortedHistoryDates.map((date) => (
                          <div key={date} className="mb-2">
                            <div
                              className="cursor-pointer bg-gray-700 p-3 rounded-lg text-left flex justify-between items-center"
                              onClick={() => toggleDate(date)}
                            >
                              <span className="font-medium">{date}</span>
                              <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                                {expandedDate === date
                                  ? "Sembunyikan"
                                  : "Detail"}
                              </span>
                            </div>
                            <Collapse isOpened={expandedDate === date}>
                              <div className="bg-gray-700 p-4 rounded-b-lg mt-1 max-h-60 overflow-y-auto">
                                {sortedTimeEntries(date).map((time) => (
                                  <div
                                    key={time}
                                    className="bg-gray-600 p-3 rounded-lg mt-2 text-left"
                                  >
                                    <div className="text-sm font-bold border-b border-gray-500 pb-1 mb-2">
                                      {time}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="text-sm text-gray-300">
                                        Suhu Air:
                                        <span className="ml-2 text-white">
                                          {
                                            historyData[date]?.[time]
                                              ?.temperaturetds
                                          }
                                          °C
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-300">
                                        TDS:
                                        <span className="ml-2 text-white">
                                          {historyData[date]?.[time]?.tdsValue}{" "}
                                          PPM
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-300">
                                        Level Tangki 1:
                                        <span className="ml-2 text-white">
                                          {historyData[date]?.[time]?.distance1}{" "}
                                          CM
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-300">
                                        Level Tangki 2:
                                        <span className="ml-2 text-white">
                                          {historyData[date]?.[time]?.distance2}{" "}
                                          CM
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-300">
                                        Relay A:
                                        <span
                                          className={`ml-2 ${
                                            historyData[date]?.[time]?.relayA
                                              ? "text-green-500"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {historyData[date]?.[time]?.relayA
                                            ? "ON"
                                            : "OFF"}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-300">
                                        Relay B:
                                        <span
                                          className={`ml-2 ${
                                            historyData[date]?.[time]?.relayB
                                              ? "text-green-500"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {historyData[date]?.[time]?.relayB
                                            ? "ON"
                                            : "OFF"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Collapse>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-400">
                          Tidak ada data riwayat
                        </div>
                      )}
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
