"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/components/firebase";
import ControlButtonRestart from "@/components/buttonRestart";
import ControlButton from "@/components/buttonTrigger";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Collapse } from "react-collapse";

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
  const [expandedToday, setExpandedToday] = useState(null);
  const [expandedAll, setExpandedAll] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

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
    const historyRef = ref(database, "history_data");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHistoryData(data);
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleToday = (time) => {
    setExpandedToday(expandedToday === time ? null : time);
  };

  const toggleAll = (date) => {
    setExpandedAll(expandedAll === date ? null : date);
  };

  const sortedHistoryDates = Object.keys(historyData).sort().reverse();

  const sortedTimeEntries = (date) => {
    return historyData[date]
      ? Object.keys(historyData[date]).sort().reverse()
      : [];
  };

  return (
    <>
      <div className="flex min-h-screen">
        <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <div
          className={`flex-grow flex flex-col p-4 transition-all duration-300 ${
            isExpanded ? "ml-48" : "ml-14"
          }`}
        >
          {/* Sensor and Control Panel */}
          <div className="flex">
            {/* Temperature & Time */}
            <div className="flex flex-col">
              <div className="w-[250px] h-40 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold flex flex-col pt-6 ">
                Temperature
                <div className="flex-grow flex justify-center items-center text-5xl">
                  {temperature}°C
                </div>
              </div>
              <div className="w-[250px] h-40 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold flex flex-col pt-6">
                Time
                <div className="text-5xl p-4">{time}</div>
              </div>
            </div>
            {/* Soil Moisture */}
            <div className="flex-grow bg-gray-700 m-2 rounded-md text-2xl font-bold pt-6 text-center flex flex-col items-center">
              <div>Soil Humidity Sensor</div>
              <div className="flex gap-16">
                {Object.keys(soilMoisture).map((sensor, index) => (
                  <div key={index} className="w-full mt-20 p-2 rounded-md">
                    {sensor.replace("sensor_", "Sensor ")}
                    <div className="text-5xl font-bold pt-4">
                      {soilMoisture[sensor]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Control Buttons */}
            <div className="flex flex-col">
              <div className="w-[250px] h-40 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold pt-4">
                Restart device
                <ControlButtonRestart />
              </div>
              <div className="w-[250px] h-40 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold pt-4">
                Watering Button
                <ControlButton />
              </div>
            </div>
          </div>

          {/* History Panels */}
          <div className="flex flex-grow mb-12">
            {/* Today History */}
            <div className="w-1/2 bg-gray-700 m-2 rounded-md p-6 text-center text-2xl font-bold">
              Today History
              <div className="h-[500px] overflow-y-auto mt-4">
                {sortedTimeEntries(getTodayDate()).map((time) => (
                  <div key={time} className="pt-2">
                    <div
                      className="cursor-pointer font-semibold bg-gray-800 p-2 rounded-md"
                      onClick={() => toggleToday(time)}
                    >
                      {time}
                    </div>
                    <Collapse isOpened={expandedToday === time}>
                      <div className="bg-gray-900 p-6 rounded-md mt-2">
                        <div className="bg-gray-800 p-4 rounded-md mt-4 text-left">
                          <div>Time: {time}</div>
                          <div>
                            Temperature:{" "}
                            {historyData[getTodayDate()]?.[time]?.temperature}°C
                          </div>
                          <div>Soil Moisture:</div>
                          <ul className="pl-2 list-disc ml-4">
                            {Object.keys(
                              historyData[getTodayDate()]?.[time]
                                ?.soil_moisture || {}
                            ).map((sensor) => (
                              <li key={sensor}>
                                {sensor}:{" "}
                                {
                                  historyData[getTodayDate()]?.[time]
                                    ?.soil_moisture[sensor]
                                }
                                %
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                ))}
              </div>
            </div>

            {/* All History */}
            <div className="w-1/2 bg-gray-700 m-2 rounded-md p-6 text-center text-2xl font-bold">
              All History
              <div className="h-[500px] overflow-y-auto mt-4">
                {sortedHistoryDates.map((date) => (
                  <div key={date} className="pt-2">
                    <div
                      className="cursor-pointer font-semibold bg-gray-800 p-2 rounded-md"
                      onClick={() => toggleAll(date)}
                    >
                      {date}
                    </div>
                    <Collapse isOpened={expandedAll === date}>
                      <div className="bg-gray-900 p-6 rounded-md mt-2">
                        <div className="max-h-[400px] overflow-y-auto">
                          {sortedTimeEntries(date).map((time) => (
                            <div
                              key={time}
                              className="bg-gray-800 p-4 rounded-md mt-4 text-left"
                            >
                              <div className="">Time: {time}</div>

                              <div>
                                Temperatur:{" "}
                                {historyData[date]?.[time]?.temperature}°C
                              </div>
                              <div>Soil Moisture:</div>
                              <ul className="pl-2 list-disc ml-4">
                                {Object.keys(
                                  historyData[date]?.[time]?.soil_moisture || {}
                                ).map((sensor) => (
                                  <li key={sensor}>
                                    {sensor}:{" "}
                                    {
                                      historyData[date]?.[time]?.soil_moisture[
                                        sensor
                                      ]
                                    }
                                    %
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Collapse>
                  </div>
                ))}
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
