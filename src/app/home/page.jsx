"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/components/firebase";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Collapse } from "react-collapse";

const Page = () => {
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

  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
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
        <Navbar />
        <div className="flex-grow flex flex-col p-2">
          <div className="flex">
            <div className="flex flex-col">
              <div className="w-[250px] h-32 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold pt-4">
                Temperature
                <div className="text-5xl p-4">{temperature}°C</div>
              </div>
              <div className="w-[250px] h-32 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold pt-4">
                Time
                <div className="text-5xl p-4">{time}</div>
              </div>
            </div>
            <div className="flex-grow bg-gray-700 m-2 rounded-md text-2xl font-bold pt-6 text-center flex flex-col items-center">
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

          <div className="flex flex-grow mb-12">
            <div className="w-1/2 bg-gray-700 m-2 rounded-md p-6 text-center text-2xl font-bold">
              Today History
              <div className="h-[500px] overflow-y-auto mt-4">
                {sortedTimeEntries(getTodayDate()).map((time) => (
                  <div key={time} className="pt-2">
                    <div
                      className="cursor-pointer font-semibold bg-gray-800 p-2 rounded-md"
                      onClick={() => toggleDate(time)}
                    >
                      {time}
                    </div>
                    <Collapse isOpened={expandedDate === time}>
                      <div className="bg-red-400 p-4 rounded-md mt-2 text-left">
                        <div>Time: {time}</div>
                        <div>
                          Event: {historyData[getTodayDate()]?.[time]?.event}
                        </div>
                        <div>
                          Temperature:{" "}
                          {historyData[getTodayDate()]?.[time]?.temperature}°C
                        </div>
                        <div>Soil Moisture:</div>
                        <ul className="list-disc ml-4">
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
                    </Collapse>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/2 bg-gray-700 m-2 rounded-md p-6 text-center text-2xl font-bold">
              All History
              <div className="h-[600px] overflow-y-auto mt-4">
                {sortedHistoryDates.map((date) => (
                  <div key={date} className="mb-2">
                    <div
                      className="cursor-pointer font-semibold bg-gray-800 p-2 rounded-md"
                      onClick={() => toggleDate(date)}
                    >
                      {date}
                    </div>
                    <Collapse isOpened={expandedDate === date}>
                      <div className="bg-gray-900 p-4 rounded-md mt-2">
                        <div className="max-h-[500px] overflow-y-auto">
                          {sortedTimeEntries(date).map((time) => (
                            <div
                              key={time}
                              className="bg-gray-800 p-4 rounded-md mt-4 text-left"
                            >
                              <div>Time: {time}</div>
                              <div>
                                Event: {historyData[date]?.[time]?.event}
                              </div>
                              <div>
                                Temperature:{" "}
                                {historyData[date]?.[time]?.temperature}°C
                              </div>
                              <div>Soil Moisture:</div>
                              <ul className=" pl-2 list-disc ml-4">
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
