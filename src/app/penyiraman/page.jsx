"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/components/firebase";
import ControlButtonRestart from "@/components/buttonRestart";
import ControlButton from "@/components/buttonTrigger";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Collapse } from "react-collapse";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Thermometer,
  Droplet,
  Clock,
  History,
  RefreshCw,
  Sprout,
  Calendar,
  Clock3,
} from "lucide-react";

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
  const [historyData, setHistoryData] = useState({});
  const [expandedDate, setExpandedDate] = useState(null);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [searchTodayHistory, setSearchTodayHistory] = useState("");
  const [searchPrevHistory, setSearchPrevHistory] = useState("");

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

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
    const historyRef = ref(database, "history_data");
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHistoryData(data);
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

  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const toggleHistory = (date) => {
    setExpandedHistory(expandedHistory === date ? null : date);
  };

  const sortedHistoryDates = Object.keys(historyData).sort().reverse();

  const sortedTimeEntries = (date) => {
    return historyData[date]
      ? Object.keys(historyData[date]).sort().reverse()
      : [];
  };

  // Function to filter today's history entries based on search
  const filteredTodayEntries = () => {
    const entries = sortedTimeEntries(getTodayDate());
    if (!searchTodayHistory) return entries;
    return entries.filter((time) =>
      time.toLowerCase().includes(searchTodayHistory.toLowerCase())
    );
  };

  // Function to filter previous history dates based on search
  const filteredPreviousDates = () => {
    const dates = sortedHistoryDates.filter((date) => date !== getTodayDate());
    if (!searchPrevHistory) return dates;
    return dates.filter((date) =>
      date.toLowerCase().includes(searchPrevHistory.toLowerCase())
    );
  };

  // Function to get moisture level color
  const getMoistureColor = (value) => {
    if (value < 30) return "text-red-500";
    if (value < 60) return "text-orange-500";
    return "text-green-500";
  };

  // Function to get temperature color
  const getTemperatureColor = (value) => {
    if (value > 30) return "text-red-500";
    if (value < 18) return "text-blue-500";
    return "text-green-500";
  };

  // Function to render time entry data
  const renderTimeEntryData = (date, time) => {
    if (!historyData[date] || !historyData[date][time]) return null;

    const entryData = historyData[date][time];
    return (
      <div className="bg-white p-4 rounded-xl mt-2 text-left shadow-md border border-blue-100">
        <p className="text-lg flex items-center">
          <Thermometer className="mr-2 text-red-400" size={20} />
          <span
            className={`font-medium ${getTemperatureColor(
              entryData.temperature
            )}`}
          >
            Temperature: {entryData.temperature}°C
          </span>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
          {Object.keys(entryData.soil_moisture || {}).map((sensor) => (
            <div
              key={sensor}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-md font-medium text-gray-800">
                  {sensor.replace("sensor_", "Sensor ")}
                </span>
                <Droplet className="text-blue-500" size={18} />
              </div>
              <div
                className={`text-2xl font-bold ${getMoistureColor(
                  entryData.soil_moisture[sensor]
                )}`}
              >
                {entryData.soil_moisture[sensor]}%
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${entryData.soil_moisture[sensor]}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          <div
            className={`flex-grow flex flex-col p-6 transition-all duration-300 ${
              isExpanded ? "ml-48" : "ml-2"
            } bg-white`}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Penyiraman</h1>
              <div className="flex md:items-center w-fit mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-100">
                <Clock className="mr-2 text-blue-500" />
                <span className="text-xl font-medium text-gray-700">
                  {time}
                </span>
              </div>
            </div>

            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Temperature Card */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Suhu Greenhouse
                    </h3>
                    <Thermometer className="text-red-500" size={24} />
                  </div>
                  <div
                    className={`text-5xl font-bold mt-3 ${getTemperatureColor(
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

              {/* Soil Moisture Summary Card */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Kelembaban Rata-rata
                    </h3>
                    <Droplet className="text-blue-500" size={24} />
                  </div>

                  {Object.keys(soilMoisture).length > 0 ? (
                    <>
                      <div
                        className={`text-5xl font-bold mt-3 ${getMoistureColor(
                          Object.values(soilMoisture).reduce(
                            (sum, val) => sum + val,
                            0
                          ) / Object.values(soilMoisture).length
                        )}`}
                      >
                        {(
                          Object.values(soilMoisture).reduce(
                            (sum, val) => sum + val,
                            0
                          ) / Object.values(soilMoisture).length
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{
                            width: `${
                              Object.values(soilMoisture).reduce(
                                (sum, val) => sum + val,
                                0
                              ) / Object.values(soilMoisture).length
                            }%`,
                          }}
                        ></div>
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl font-bold mt-3 text-gray-500">
                      Tidak ada data
                    </div>
                  )}
                </div>
              </div>

              {/* Restart Button Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Mulai ulang Perangkat
                    </h3>
                    <RefreshCw className="text-red-500" size={24} />
                  </div>
                  <div className="mt-3 flex justify-center">
                    <div className="scale-110">
                      <ControlButtonRestart />
                    </div>
                  </div>
                  <p className="text-gray-500 mt-4 text-sm text-center">
                    Gunakan tombol ini untuk memulai ulang perangkat
                  </p>
                </div>
              </div>

              {/* Watering Button Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Kontrol Penyiraman
                    </h3>
                    <Sprout className="text-green-500" size={24} />
                  </div>
                  <div className="mt-3 flex justify-center">
                    <div className="scale-110">
                      <ControlButton />
                    </div>
                  </div>
                  <p className="text-gray-500 mt-4 text-sm text-center">
                    Gunakan tombol ini untuk mengaktifkan penyiraman manual
                  </p>
                </div>
              </div>
            </div>

            {/* Sensor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {Object.keys(soilMoisture).map((sensor, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        {sensor.replace("sensor_", "Sensor ")}
                      </h3>
                      <Droplet className="text-blue-500" size={24} />
                    </div>
                    <div
                      className={`text-4xl font-bold mt-3 ${getMoistureColor(
                        soilMoisture[sensor]
                      )}`}
                    >
                      {soilMoisture[sensor]}%
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${soilMoisture[sensor]}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* History Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-16">
              {/* Today's History */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                <div className="p-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <h3 className="text-xl font-medium text-gray-800 flex items-center">
                      <Clock3 className="mr-2 text-blue-500" size={22} />
                      Riwayat Hari Ini
                    </h3>
                    <span className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                      {getTodayDate()}
                    </span>
                  </div>

                  {/* Search bar for today's history */}
                  <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="bg-white border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                      placeholder="Cari waktu..."
                      value={searchTodayHistory}
                      onChange={(e) => setSearchTodayHistory(e.target.value)}
                    />
                  </div>

                  <div className="h-96 overflow-y-auto pr-2 light-scrollbar">
                    {filteredTodayEntries().length > 0 ? (
                      filteredTodayEntries().map((time) => (
                        <div key={time} className="mb-2">
                          <div
                            className={`cursor-pointer font-medium rounded-lg p-3 flex items-center justify-between transition-all duration-200 bg-gray-100 ${
                              expandedDate === time
                                ? "bg-blue-50 border border-blue-100"
                                : "bg-gray-50 hover:bg-gray-100 border border-gray-100"
                            }`}
                            onClick={() => toggleDate(time)}
                          >
                            <div className="flex items-center text-black">
                              <Clock className="mr-2 text-blue-500" size={18} />
                              {time}
                            </div>
                            <span className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200 text-blue-600">
                              {expandedDate === time ? "Tutup" : "Detail"}
                            </span>
                          </div>
                          <Collapse isOpened={expandedDate === time}>
                            {renderTimeEntryData(getTodayDate(), time)}
                          </Collapse>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <History size={48} className="mb-3 opacity-50" />
                        <p className="text-xl">Belum ada data untuk hari ini</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Previous History */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                <div className="p-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <h3 className="text-xl font-medium text-gray-800 flex items-center">
                      <Calendar className="mr-2 text-green-500" size={22} />
                      Riwayat Sebelumnya
                    </h3>
                  </div>

                  {/* Search bar for previous history */}
                  <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="bg-white border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                      placeholder="Cari tanggal... (YYYY-MM-DD)"
                      value={searchPrevHistory}
                      onChange={(e) => setSearchPrevHistory(e.target.value)}
                    />
                  </div>

                  <div className="h-96 overflow-y-auto pr-2 light-scrollbar">
                    {filteredPreviousDates().length > 0 ? (
                      filteredPreviousDates().map((date) => (
                        <div key={date} className="mb-2">
                          <div
                            className={`cursor-pointer bg-gray-50 p-3 rounded-lg text-left flex justify-between items-center border border-gray-200 ${
                              expandedHistory === date
                                ? "bg-blue-50 border border-blue-100"
                                : "bg-gray-50 hover:bg-gray-100 border border-gray-100"
                            }`}
                            onClick={() => toggleHistory(date)}
                          >
                            <div className="flex items-center text-black ">
                              <Calendar
                                className="mr-2 text-green-500"
                                size={18}
                              />
                              {date}
                            </div>
                            <span className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200 text-blue-600">
                              {expandedHistory === date ? "Tutup" : "Detail"}
                            </span>
                          </div>
                          <Collapse isOpened={expandedHistory === date}>
                            <div className="mt-2 bg-white p-3 rounded-lg border border-gray-100 shadow-md">
                              {sortedTimeEntries(date).map((time) => (
                                <div key={time} className="mb-2">
                                  <div
                                    className={`cursor-pointer rounded-lg p-2.5 flex items-center justify-between transition-all duration-200 ${
                                      expandedDate === `${date}-${time}`
                                        ? "bg-blue-50 border border-blue-100"
                                        : "bg-gray-50 hover:bg-gray-100 border border-gray-100"
                                    }`}
                                    onClick={() =>
                                      toggleDate(`${date}-${time}`)
                                    }
                                  >
                                    <div className="flex items-center text-black">
                                      <Clock
                                        className="mr-2 text-blue-500"
                                        size={16}
                                      />
                                      {time}
                                    </div>
                                    <span className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200 text-blue-600">
                                      {expandedDate === `${date}-${time}`
                                        ? "Tutup"
                                        : "Detail"}
                                    </span>
                                  </div>
                                  <Collapse
                                    isOpened={
                                      expandedDate === `${date}-${time}`
                                    }
                                  >
                                    {renderTimeEntryData(date, time)}
                                  </Collapse>
                                </div>
                              ))}
                            </div>
                          </Collapse>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <History size={48} className="mb-3 opacity-50" />
                        <p className="text-xl">
                          Tidak ada data riwayat tersedia
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </ProtectedRoute>
      <style jsx global>{`
        .light-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .light-scrollbar::-webkit-scrollbar-track {
          background: #ffffff;
          border-radius: 4px;
        }
        .light-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
        .light-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e0;
        }
      `}</style>
    </div>
  );
};

export default Page;
