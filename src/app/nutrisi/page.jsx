"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/components/firebase";
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

  // Function to determine tank level status
  const getTankLevelStatus = (distance) => {
    if (distance <= 10) {
      return {
        textColor: "text-green-500",
        borderColor: "border-green-200",
        bgColor: "bg-green-500",
        icon: <CheckCircle className="text-green-500" size={20} />,
        status: "Level optimal",
      };
    } else if (distance <  30) {
      return {
        textColor: "text-yellow-500",
        borderColor: "border-yellow-200",
        bgColor: "bg-yellow-500",
        icon: <AlertCircle className="text-yellow-500" size={20} />,
        status: "Level menengah",
      };
    } else {
      return {
        textColor: "text-red-500",
        borderColor: "border-red-200",
        bgColor: "bg-red-500",
        icon: <AlertTriangle className="text-red-500" size={20} />,
        status: "Level rendah",
      };
    }
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h1 className="text-3xl font-bold flex items-center">
                <Sprout className="mr-2 text-green-500" size={28} />
                Nutrisi
              </h1>
              <div className="flex md:items-center w-fit mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-100">
                <Clock className="mr-2 text-blue-500" />
                <span className="text-xl font-medium text-gray-800">
                  {time}
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
                    Tangki A/B MIX
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  {/* Ultrasonic Sensor 1 */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-800">
                          Level Tangki A
                        </h3>
                        <Waves className={tank1Status.textColor} size={24} />
                      </div>
                      <div
                        className={`${tank1Status.textColor} text-5xl font-bold mt-4`}
                      >
                        {distance1} <span className="text-2xl">CM</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                        <div
                          className={`${tank1Status.bgColor} h-3 rounded-full transition-all`}
                          style={{
                            width: `${
                              (distance1 / 40) * 100 > 100
                                ? 0
                                : 100 - (distance1 / 40) * 100
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
                  {/* Ultrasonic Sensor 2 */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-800">
                          Level Tangki B
                        </h3>
                        <Waves className={tank2Status.textColor} size={24} />
                      </div>
                      <div
                        className={`${tank2Status.textColor} text-5xl font-bold mt-4`}
                      >
                        {distance2} <span className="text-2xl">CM</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                        <div
                          className={`${tank2Status.bgColor} h-3 rounded-full transition-all`}
                          style={{
                            width: `${
                              (distance2 / 40) * 100 > 100
                                ? 0
                                : 100 - (distance2 / 40) * 100
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
