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
  const [expandedDate, setExpandedDate] = useState(null);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

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

  // Function to render time entry data
  const renderTimeEntryData = (date, time) => {
    if (!historyData[date] || !historyData[date][time]) return null;

    const entryData = historyData[date][time];
    return (
      <div className="bg-gray-900 p-3 rounded-md mt-1 text-left">
        <p className="text-lg">Temperature: {entryData.temperature}°C</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
          {Object.keys(entryData.soil_moisture || {}).map((sensor) => (
            <div
              key={sensor}
              className="bg-gray-800 p-2 rounded text-sm text-center"
            >
              <span className="text-lg lg:text-xl font-semibold">
                {sensor.replace("sensor_", "Sensor ")}
              </span>
              <span className="text-base lg:text-lg text-center">
                <p>{entryData.soil_moisture[sensor]} %</p>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex min-h-screen ">
        <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <div
          className={`flex-grow flex flex-col p-4 transition-all duration-300 ${
            isExpanded ? "ml-48" : "ml-14"
          }`}
        >
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col lg:w-auto">
              <div className="w-full lg:w-[250px] h-40 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold flex flex-col pt-6">
                Temperature
                <div className="flex-grow flex justify-center items-center text-5xl">
                  {temperature}°C
                </div>
              </div>
              <div className="w-full lg:w-[250px] h-40 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold flex flex-col pt-6">
                Time
                <div className="text-5xl p-4">{time}</div>
              </div>
            </div>
            <div className="w-full bg-gray-700 m-2 rounded-md text-2xl font-bold pt-6 text-center flex flex-col items-center">
              <div>Soil Humidity Sensor</div>
              <div className=" flex flex-wrap justify-center  lg:gap-14 p-6">
                {Object.keys(soilMoisture).map((sensor, index) => (
                  <div key={index} className="w-30 mt-8 p-4 rounded-md ">
                    {sensor.replace("sensor_", "Sensor ")}
                    <div className="text-3xl lg:text-5xl font-bold pt-4">
                      {soilMoisture[sensor]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col lg:w-auto">
              <div className="w-full lg:w-[250px] h-40 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold pt-4">
                Restart device
                <ControlButtonRestart />
              </div>
              <div className="w-full lg:w-[250px] h-40 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold pt-4">
                Watering Button
                <ControlButton />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row flex-grow mb-12">
            <div className="w-full lg:w-1/2 bg-gray-700 m-2 rounded-md p-6 text-center text-2xl font-bold">
              Today History
              <div className="h-[500px] overflow-y-auto mt-4">
                {sortedTimeEntries(getTodayDate()).length > 0 ? (
                  sortedTimeEntries(getTodayDate()).map((time) => (
                    <div key={time} className="pt-2">
                      <div
                        className="cursor-pointer font-semibold bg-gray-800 p-2 rounded-md"
                        onClick={() => toggleDate(time)}
                      >
                        {time}
                      </div>
                      <Collapse isOpened={expandedDate === time}>
                        {renderTimeEntryData(getTodayDate(), time)}
                      </Collapse>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-xl mt-8">
                    No data for today
                  </div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-1/2 bg-gray-700 m-2 rounded-md p-6 text-center text-2xl font-bold">
              Prevous History
              <div className="h-[500px] overflow-y-auto mt-4">
                {sortedHistoryDates.filter((date) => date !== getTodayDate())
                  .length > 0 ? (
                  sortedHistoryDates
                    .filter((date) => date !== getTodayDate())
                    .map((date) => (
                      <div key={date} className="pt-2">
                        <div
                          className="cursor-pointer font-semibold bg-gray-800 p-2 rounded-md"
                          onClick={() => toggleHistory(date)}
                        >
                          {date}
                        </div>
                        <Collapse isOpened={expandedHistory === date}>
                          <div className="mt-2 bg-gray-800 p-4 rounded-md text-left">
                            {sortedTimeEntries(date).map((time) => (
                              <div key={time} className="py-1">
                                <div
                                  className="cursor-pointer text-lg bg-gray-700 p-2 my-1 rounded-md"
                                  onClick={() => toggleDate(`${date}-${time}`)}
                                >
                                  {time}
                                </div>
                                <Collapse
                                  isOpened={expandedDate === `${date}-${time}`}
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
                  <div className="text-gray-400 text-xl mt-8">
                    No historical data available
                  </div>
                )}
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
