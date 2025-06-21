"use client";
import React, { useEffect, useState, useRef } from "react";
import { database, ref, onValue } from "@/components/firebase";
import { update } from "firebase/database";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Sprout,
  Thermometer,
  Droplet,
  Clock,
  FlaskConical,
  Ruler,
  Calendar,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Beaker,
  Container,
  Waves,
  BadgeAlert,
  Bell,
  ThermometerSnowflake,
  ThermometerSun,
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
  const [threshold, setThreshold] = useState("");
  const inputRef = useRef(null);
  const [deviceStatus, setDeviceStatus] = useState({
    lastSeen: null,
    status: "Offline",
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

   const [currentDate, setCurrentDate] = useState(
      new Date().toISOString().split("T")[0]
    );

  useEffect(() => {
      const updateDate = () => {
        const newDate = new Date().toISOString().split("T")[0];
        if (newDate !== currentDate) {
          setCurrentDate(newDate);
        }
      };
  
      // Periksa tanggal setiap menit
      const interval = setInterval(updateDate, 60000);
  
      // Jalankan sekali saat komponen dimuat untuk menangkap perubahan tanggal
      updateDate();
  
      // Bersihkan interval saat komponen dilepas
      return () => clearInterval(interval);
    }, [currentDate]);

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

  // Ambil last_seen dari Firebase
  useEffect(() => {
    const lastSeenRef = ref(database, "MonitoringNutrisi/realtime/last_seen");

    const unsubscribe = onValue(lastSeenRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        setDeviceStatus((prev) => ({
          ...prev,
          lastSeen: value,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Evaluasi status Online/Offline setiap 5 detik
  useEffect(() => {
    const updateStatus = () => {
      if (!deviceStatus.lastSeen) return;

      const lastSeen = new Date(deviceStatus.lastSeen); // waktu dari Firebase (UTC)
      const now = new Date();

      // Konversi waktu sekarang ke UTC+8
      const nowUTC8 = new Date(now.getTime() + (8 * 60 * 60 * 1000));

      const diffSeconds = (nowUTC8 - lastSeen) / 1000;
      const isOnline = diffSeconds < 120;

      setDeviceStatus((prev) => ({
        ...prev,
        status: isOnline ? "Online" : "Offline",
      }));
    };

    updateStatus(); // evaluasi langsung saat mount
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, [deviceStatus.lastSeen]);

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
  
    useEffect(() => {
  const thresholdRef = ref(database, "MonitoringNutrisi/controlIoT/threshold");
  onValue(thresholdRef, (snapshot) => {
    const data = snapshot.val();
    if (data !== null) {
      setThreshold(data);
    }
  });
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


const handleThresholdSave = () => {
  const newValue = parseInt(inputRef.current.value);
  if (!isNaN(newValue)) {
    const thresholdRef = ref(database, "MonitoringNutrisi/controlIoT");
    update(thresholdRef, { threshold: newValue });
  }
};

  const getTankLevelStatus = (distance) => {
    const level = Math.min(distance, threshold);
    const percentage = (level / threshold) * 100;
    if (percentage > 70) {
      return {
        textColor: "text-red-500",
        borderColor: "border-red-200",
        bgColor: "bg-red-500",
        icon: <AlertTriangle className="text-red-500" size={20} />,
        status: "Level Rendah",
      };
    } else if (percentage > 30) {
      return {
        textColor: "text-yellow-500",
        borderColor: "border-yellow-200",
        bgColor: "bg-yellow-500",
        icon: <AlertCircle className="text-yellow-500" size={20} />,
        status: "Level menengah",
      };
    } else {
      return {
        textColor: "text-green-500",
        borderColor: "border-green-200",
        bgColor: "bg-green-500",
        icon: <CheckCircle className="text-green-500" size={20} />,
        status: "Level Optimal",
      };
    }
  };

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

  // Function to determine temperature color and icon
  const getTemperatureColorAndIcon = (value) => {
    if (value > 30) {
      return {
        textColor: "text-red-600",
        icon: <ThermometerSun className="text-red-500" size={24} />,
      };
    }
    if (value < 18) {
      return {
        textColor: "text-blue-600",
        icon: <ThermometerSnowflake className="text-blue-500" size={24} />,
      };
    }
    return {
      textColor: "text-green-600",
      icon: <Thermometer className="text-green-500" size={24} />,
    };
  };

  // Function to determine TDS status, color and icon
  const getTdsStatusColorAndIcon = (value) => {
    if (value < 560) {
      return {
        status: "Nutrisi rendah",
        textColor: "text-yellow-600",
        icon: <ArrowDown className="text-yellow-500" size={24} />,
        bgColor: "bg-yellow-500",
      };
    }
    if (value > 900) {
      return {
        status: "Nutrisi tinggi",
        textColor: "text-red-600",
        icon: <ArrowUp className="text-red-500" size={24} />,
        bgColor: "bg-red-500",
      };
    }
    return {
      status: "Nutrisi optimal",
      textColor: "text-green-600",
      icon: <CheckCircle className="text-green-500" size={24} />,
      bgColor: "bg-green-500",
    };
  };

  const tempDetails = getTemperatureColorAndIcon(temperaturetds);
  const tdsDetails = getTdsStatusColorAndIcon(tdsValue);
  const tank1Status = getTankLevelStatus(distance1);
  const tank2Status = getTankLevelStatus(distance2);

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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                {/* Kiri: Judul dan Status */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h1 className="text-3xl font-bold flex items-center">
                    <Sprout className="mr-2 text-green-500" size={28} />
                    Nutrisi
                  </h1>
                </div>

                {/* Kanan: Jam */}
                <div className="flex md:items-end w-fit mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-100">
                  <Clock className="mr-2 text-blue-500" />
                  <span className="text-xl font-medium text-gray-700 mr-4">{time}</span>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-md ${
                      deviceStatus.status === "Online"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {deviceStatus.status === "Online" ? "Device Online" : "Device Offline"}
                  </span>
                </div>
              </div>


            <div className="lg:grid max-sm:space-y-6 lg:grid-cols-4 gap-4">
              {/* Water Temperature Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800">
                      Suhu Air
                    </h3>
                    {tempDetails.icon}
                  </div>
                  <div
                    className={`text-5xl font-bold mt-4 ${tempDetails.textColor}`}
                  >
                    {temperaturetds}°C
                  </div>
                  <p className="text-gray-600 mt-3 text-sm flex items-center">
                    {temperaturetds > 30 ? (
                      <>
                        <AlertTriangle
                          className="mr-1 text-red-500"
                          size={16}
                        />
                        Suhu air tinggi
                      </>
                    ) : temperaturetds < 15 ? (
                      <>
                        <AlertCircle className="mr-1 text-blue-500" size={16} />
                        Suhu air rendah
                      </>
                    ) : (
                      <>
                        <CheckCircle
                          className="mr-1 text-green-500"
                          size={16}
                        />
                        Suhu air optimal
                      </>
                    )}
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
                    <Beaker className="text-green-500" size={24} />
                  </div>
                  <div
                    className={`text-5xl font-bold mt-4 ${tdsDetails.textColor}`}
                  >
                    {tdsValue} <span className="text-2xl">ppm</span>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm flex items-center">
                    {tdsDetails.icon}
                    <span className="ml-1">{tdsDetails.status}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white col-span-2 p-4 rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200">
              <div className="flex items-center">
                <Container className="mr-2 text-blue-500" size={20} />
                <span className="font-medium text-gray-800">
                  Tangki Nutrisi
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* Tangki A */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        Level Tangki A
                      </h3>
                      <Waves className={tank1Status.textColor} size={24} />
                    </div>
                    <div className={`${tank1Status.textColor} text-5xl font-bold mt-4`}>
                      {Math.min(distance1, threshold)} <span className="text-2xl">CM</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div
                        className={`${tank1Status.bgColor} h-3 rounded-full transition-all`}
                        style={{
                          width: `${
                            Math.min((distance1 / threshold) * 100, 100)
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm flex items-center">
                      {tank1Status.icon}
                      <span className="ml-1">{tank1Status.status}</span>
                    </p>
                  </div>
                </div>

                {/* Tangki B */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200">
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        Level Tangki B
                      </h3>
                      <Waves className={tank2Status.textColor} size={24} />
                    </div>
                    <div className={`${tank2Status.textColor} text-5xl font-bold mt-4`}>
                      {Math.min(distance2, threshold)} <span className="text-2xl">CM</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div
                        className={`${tank2Status.bgColor} h-3 rounded-full transition-all`}
                        style={{
                          width: `${
                            Math.min((distance2 / threshold) * 100, 100)
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm flex items-center">
                      {tank2Status.icon}
                      <span className="ml-1">{tank2Status.status}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200">
                  <h4 className="text-lg font-semibold mb-2 text-gray-800">Ketinggian Nutrisi</h4>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      ref={inputRef}
                      defaultValue={threshold}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-yellow-300"
                      placeholder="Masukkan nilai"
                    />
                    <button
                      onClick={handleThresholdSave}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md"
                    >
                      Simpan
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Nilai ini akan digunakan oleh perangkat untuk menetapkan ketinggian maksimal tangki nutrisi.</p>
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
                  <p className="text-gray-600 mt-4 text-sm text-center flex items-center justify-center">
                    <AlertCircle className="mr-1 text-red-500" size={16} />
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
                    <Droplet className="text-green-500" size={24} />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="scale-110">
                      <TriggerRelay />
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm text-center flex items-center justify-center">
                    <Bell className="mr-1 text-green-500" size={16} />
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
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <BadgeAlert className="mr-2 text-blue-500" size={20} />
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
                              <span className="font-medium text-gray-800 flex items-center">
                                <Clock
                                  className="mr-2 text-blue-500"
                                  size={16}
                                />
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
                                  <div className="text-sm text-gray-700 flex items-center">
                                    <Thermometer
                                      className="mr-1 text-blue-500"
                                      size={14}
                                    />
                                    Suhu Air:
                                    <span
                                      className={`ml-2 font-medium ${
                                        historyData[getTodayDate()]?.[time]
                                          ?.temperaturetds > 30
                                          ? "text-red-600"
                                          : historyData[getTodayDate()]?.[time]
                                              ?.temperaturetds < 15
                                          ? "text-blue-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.temperaturetds
                                      }
                                      °C
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700 flex items-center">
                                    <Beaker
                                      className="mr-1 text-green-500"
                                      size={14}
                                    />
                                    TDS:
                                    <span
                                      className={`ml-2 font-medium ${
                                        historyData[getTodayDate()]?.[time]
                                          ?.tdsValue < 560
                                          ? "text-yellow-600"
                                          : historyData[getTodayDate()]?.[time]
                                              ?.tdsValue > 900
                                          ? "text-red-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.tdsValue
                                      }{" "}
                                      PPM
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700 flex items-center">
                                    <Container
                                      className="mr-1 text-yellow-500"
                                      size={14}
                                    />
                                    Level Tangki A:
                                    <span
                                      className={`ml-2 font-medium ${
                                        historyData[getTodayDate()]?.[time]
                                          ?.distance1 <= 10
                                          ? "text-green-600"
                                          : historyData[getTodayDate()]?.[time]
                                              ?.distance1 <= 30
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.distance1
                                      }{" "}
                                      CM
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700 flex items-center">
                                    <Container
                                      className="mr-1 text-yellow-500"
                                      size={14}
                                    />
                                    Level Tangki B:
                                    <span
                                      className={`ml-2 font-medium ${
                                        historyData[getTodayDate()]?.[time]
                                          ?.distance2 <= 10
                                          ? "text-green-600"
                                          : historyData[getTodayDate()]?.[time]
                                              ?.distance2 <= 30
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {
                                        historyData[getTodayDate()]?.[time]
                                          ?.distance2
                                      }{" "}
                                      CM
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-700 flex items-center">
                                    <Droplet
                                      className="mr-1 text-blue-500"
                                      size={14}
                                    />
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
                                  <div className="text-sm text-gray-700 flex items-center">
                                    <Droplet
                                      className="mr-1 text-blue-500"
                                      size={14}
                                    />
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
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <BadgeAlert className="mr-2 text-blue-500" size={20} />
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
                              <span className="font-medium text-gray-800 flex items-center">
                                <Calendar
                                  className="mr-2 text-blue-500"
                                  size={16}
                                />
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
                                    <div className="text-sm font-bold border-b border-gray-200 pb-2 mb-3 text-blue-600 flex items-center">
                                      <Clock
                                        className="mr-1 text-blue-500"
                                        size={14}
                                      />
                                      {time}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="text-sm text-gray-700 flex items-center">
                                        <Thermometer
                                          className="mr-1 text-blue-500"
                                          size={14}
                                        />
                                        Suhu Air:
                                        <span
                                          className={`ml-2 font-medium ${
                                            historyData[date]?.[time]
                                              ?.temperaturetds > 30
                                              ? "text-red-600"
                                              : historyData[date]?.[time]
                                                  ?.temperaturetds < 15
                                              ? "text-blue-600"
                                              : "text-green-600"
                                          }`}
                                        >
                                          {
                                            historyData[date]?.[time]
                                              ?.temperaturetds
                                          }
                                          °C
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700 flex items-center">
                                        <Beaker
                                          className="mr-1 text-green-500"
                                          size={14}
                                        />
                                        TDS:
                                        <span
                                          className={`ml-2 font-medium ${
                                            historyData[date]?.[time]
                                              ?.tdsValue < 560
                                              ? "text-yellow-600"
                                              : historyData[date]?.[time]
                                                  ?.tdsValue > 900
                                              ? "text-red-600"
                                              : "text-green-600"
                                          }`}
                                        >
                                          {historyData[date]?.[time]?.tdsValue}{" "}
                                          PPM
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700 flex items-center">
                                        <Container
                                          className="mr-1 text-yellow-500"
                                          size={14}
                                        />
                                        Level A:
                                        <span
                                          className={`ml-2 font-medium ${
                                            historyData[date]?.[time]
                                              ?.distance1 <= 10
                                              ? "text-green-600"
                                              : historyData[date]?.[time]
                                                  ?.distance1 <= 30
                                              ? "text-yellow-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {historyData[date]?.[time]?.distance1}{" "}
                                          CM
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700 flex items-center">
                                        <Container
                                          className="mr-1 text-yellow-500"
                                          size={14}
                                        />
                                        Level Tangki B:
                                        <span
                                          className={`ml-2 font-medium ${
                                            historyData[date]?.[time]
                                              ?.distance2 <= 10
                                              ? "text-green-600"
                                              : historyData[date]?.[time]
                                                  ?.distance2 <= 30
                                              ? "text-yellow-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {historyData[date]?.[time]?.distance2}{" "}
                                          CM
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-700 flex items-center">
                                        <Droplet
                                          className="mr-1 text-blue-500"
                                          size={14}
                                        />
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
                                      <div className="text-sm text-gray-700 flex items-center">
                                        <Droplet
                                          className="mr-1 text-blue-500"
                                          size={14}
                                        />
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
