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
    if (value > 30) return "text-red-600";
    if (value < 18) return "text-blue-600";
    return "text-green-600";
  };

  return (
    <div className="bg-gray-50 text-gray-900">
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          <div
            className={`flex-grow flex flex-col p-6 transition-all duration-300 ${
              isExpanded ? "ml-48" : "ml-2"
            }`}
          >
            {/* Nutrisi Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h1 className="text-3xl font-bold ">Nutrisi</h1>
              <div className="flex md:items-center w-fit mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-100">
                <Clock className="mr-2 text-blue-500" />
                <span className="text-xl font-medium text-gray-800">
                  {time}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Water Temperature Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Suhu Air
                    </h3>
                    <Thermometer className="text-blue-500" size={24} />
                  </div>
                  <div
                    className={`text-5xl font-bold mt-4 ${getTemperatureColor(
                      temperaturetds
                    )}`}
                  >
                    {temperaturetds}°C
                  </div>
                  <p className="text-gray-600 mt-3 text-sm">
                    {temperaturetds > 30
                      ? "Suhu air tinggi"
                      : temperaturetds < 18
                      ? "Suhu air rendah"
                      : "Suhu air optimal"}
                  </p>
                </div>
              </div>

              {/* TDS Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-200">
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

              <div className="bg-white  col-span-2 p-4  rounded-xl -full shadow-md borderborder-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200">
                Tangki A/B MIX
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
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

              {/* Restart Button Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-red-200">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Restart Perangkat
                    </h3>
                    <RefreshCw className="text-red-500" size={24} />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="scale-110">
                      <TriggerRestart />
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm text-center">
                    Gunakan tombol ini untuk merestart perangkat
                  </p>
                </div>
              </div>

              {/* Manual Nutrient Control */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-200">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Kontrol Nutrisi Manual
                    </h3>
                    <Sprout className="text-green-500" size={24} />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="scale-110">
                      <TriggerRelay />
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm text-center">
                    Gunakan tombol ini untuk mengaktifkan pompa nutrisi
                  </p>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="mb-16 mt-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-green-800">
                <Clock className="mr-2 text-blue-500" />
                <span>Riwayat Data</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's History */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        Riwayat Hari Ini
                      </h3>
                    </div>
                    <div className="h-96 overflow-y-auto">
                      {sortedTimeEntries(getTodayDate()).length > 0 ? (
                        sortedTimeEntries(getTodayDate()).map((time) => (
                          <div key={time} className="mb-3">
                            <div
                              className="cursor-pointer bg-gray-50 p-3 rounded-lg text-left flex justify-between items-center border border-gray-200"
                              onClick={() => toggleDate(time)}
                            >
                              <span className="font-medium text-gray-800">
                                {time}
                              </span>
                              <span className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200 text-blue-600">
                                {expandedDate === time
                                  ? "Sembunyikan"
                                  : "Detail"}
                              </span>
                            </div>
                            <Collapse isOpened={expandedDate === time}>
                              <div className="bg-gray-50 p-4 rounded-b-lg mt-1 text-left border-x border-b border-gray-200">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="text-sm text-gray-700">
                                    Suhu Air:
                                    <span className="ml-2 text-gray-900 font-medium">
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.temperaturetds
                                      }
                                      °C
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    TDS:
                                    <span className="ml-2 text-gray-900 font-medium">
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.tdsValue
                                      }{" "}
                                      PPM
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    Level Tangki 1:
                                    <span className="ml-2 text-gray-900 font-medium">
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.distance1
                                      }{" "}
                                      CM
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    Level Tangki 2:
                                    <span className="ml-2 text-gray-900 font-medium">
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.distance2
                                      }{" "}
                                      CM
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    Relay A:
                                    <span
                                      className={`ml-2 font-medium ${
                                        historyData[getTodayDate()]?.[time]
                                          ?.relayA
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {historyData[getTodayDate()]?.[time]
                                        ?.relayA
                                        ? "ON"
                                        : "OFF"}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    Relay B:
                                    <span
                                      className={`ml-2 font-medium ${
                                        historyData[getTodayDate()]?.[time]
                                          ?.relayB
                                          ? "text-green-600"
                                          : "text-red-600"
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
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                          Tidak ada data untuk hari ini
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* All History */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        Semua Riwayat
                      </h3>
                    </div>
                    <div className="h-96 overflow-y-auto">
                      {sortedHistoryDates.length > 0 ? (
                        sortedHistoryDates.map((date) => (
                          <div key={date} className="mb-3">
                            <div
                              className="cursor-pointer bg-gray-50 p-3 rounded-lg text-left flex justify-between items-center border border-gray-200"
                              onClick={() => toggleDate(date)}
                            >
                              <span className="font-medium text-gray-800">
                                {date}
                              </span>
                              <span className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200 text-blue-600">
                                {expandedDate === date
                                  ? "Sembunyikan"
                                  : "Detail"}
                              </span>
                            </div>
                            <Collapse isOpened={expandedDate === date}>
                              <div className="bg-gray-50 p-4 rounded-b-lg mt-1 max-h-60 overflow-y-auto border-x border-b border-gray-200">
                                {sortedTimeEntries(date).map((time) => (
                                  <div
                                    key={time}
                                    className="bg-white p-3 rounded-lg mt-2 text-left border border-gray-200"
                                  >
                                    <div className="text-sm font-bold border-b border-gray-200 pb-2 mb-3 text-blue-600">
                                      {time}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="text-sm text-gray-700">
                                        Suhu Air:
                                        <span className="ml-2 text-gray-900 font-medium">
                                          {
                                            historyData[date]?.[time]
                                              ?.temperaturetds
                                          }
                                          °C
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        TDS:
                                        <span className="ml-2 text-gray-900 font-medium">
                                          {historyData[date]?.[time]?.tdsValue}{" "}
                                          PPM
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        Level Tangki 1:
                                        <span className="ml-2 text-gray-900 font-medium">
                                          {historyData[date]?.[time]?.distance1}{" "}
                                          CM
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        Level Tangki 2:
                                        <span className="ml-2 text-gray-900 font-medium">
                                          {historyData[date]?.[time]?.distance2}{" "}
                                          CM
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        Relay A:
                                        <span
                                          className={`ml-2 font-medium ${
                                            historyData[date]?.[time]?.relayA
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {historyData[date]?.[time]?.relayA
                                            ? "ON"
                                            : "OFF"}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        Relay B:
                                        <span
                                          className={`ml-2 font-medium ${
                                            historyData[date]?.[time]?.relayB
                                              ? "text-green-600"
                                              : "text-red-600"
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
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
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
