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
  const [todayHistory, setTodayHistory] = useState(null);
  const [expandedDate, setExpandedDate] = useState(null);
  const [expandedToday, setExpandedToday] = useState(false); // State for Today History collapse

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch real-time data from Firebase
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

  // Fetch historical data from Firebase
  useEffect(() => {
    const todayDate = getTodayDate(); // Get today's date
    const historyRef = ref(database, "history_data");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHistoryData(data);
        if (data[todayDate]) {
          setTodayHistory(data[todayDate]); // Set today's history data
        } else {
          setTodayHistory(null); // No data for today
        }
      }
    });
  }, []);

  // Toggle the date collapse
  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  // Toggle the "Today History" collapse
  const toggleTimeHistory = (time) => {
    setExpandedDate(expandedDate === time ? null : time); // Toggle the time entry collapse
  };

  // Function to sort data by time (latest first)
  const sortedHistoryDates = Object.keys(historyData).sort((a, b) => {
    return new Date(b) - new Date(a); // Sort dates in descending order
  });

  // Function to sort time entries by time (latest first)
  const sortedTimeEntries = (date) => {
    if (historyData[date]) {
      return Object.keys(historyData[date]).sort((a, b) => {
        return new Date(b) - new Date(a); // Sort time in descending order
      });
    }
    return [];
  };

  return (
    <>
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-grow flex flex-col pl-2 pt-2 pr-2">
          <div className="flex">
            <div className="flex flex-col">
              <div className="w-[250px] h-32 bg-blue-500 m-2 rounded-md font-bold text-2xl pt-4 text-center">
                Temperature:
                <div className="font-bold text-5xl p-4">{temperature}°C</div>
              </div>
              <div className="w-[250px] h-32 bg-blue-500 m-2 rounded-md font-bold text-2xl pt-4 text-center">
                Temperature:
                <div className="font-bold text-5xl p-4">{temperature}°C</div>
              </div>
            </div>
            <div className="flex-grow bg-green-500 m-2 rounded-md font-bold text-2xl pt-6 text-center flex flex-col items-center">
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

          {/* Today History Section */}
          <div className="flex flex-grow mb-12">
            <div className="w-1/2 bg-red-500 m-2 rounded-md font-bold text-2xl pt-6 text-center ">
              Today History
              {todayHistory ? (
                sortedTimeEntries(getTodayDate()).map((time) => (
                  <div key={time} className="pt-2">
                    <div
                      className="cursor-pointer font-semibold"
                      onClick={() => toggleTimeHistory(time)} // Update to toggle by time
                    >
                      {time}
                      {expandedDate === time}
                    </div>
                    <Collapse isOpened={expandedDate === time}>
                      <div>
                        <div className="text-left">Time: {time}</div>
                        <div className="text-left">
                          Event: {todayHistory[time].event}
                        </div>
                        <div className="text-left">
                          Temperature: {todayHistory[time].temperature}°C
                        </div>
                        <div className="text-left">Soil Moisture:</div>
                        <ul className="list-disc ml-4">
                          {Object.keys(todayHistory[time].soil_moisture).map(
                            (sensor) => (
                              <li key={sensor} className="text-left">
                                {sensor}:{" "}
                                {todayHistory[time].soil_moisture[sensor]}%
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </Collapse>
                  </div>
                ))
              ) : (
                <div>-</div> // If no data for today, display "-"
              )}
            </div>

            {/* All History Section */}
            <div className="w-1/2 bg-yellow-500 m-2 rounded-md font-bold text-2xl  text-center">
              <div className="text-center pt-6">
                All History
                {sortedHistoryDates.map((date) => (
                  <div key={date} className="">
                    <div
                      className="cursor-pointer font-semibold"
                      onClick={() => toggleDate(date)}
                    >
                      {date}
                    </div>
                    <Collapse isOpened={expandedDate === date}>
                      {sortedTimeEntries(date).map((time) => (
                        <div
                          key={time}
                          className="pl-4 border-l-2 border-gray-300 ml-2 mt-2"
                        >
                          <div className="text-left">Time: {time}</div>
                          <div className="text-left">
                            Event: {historyData[date][time].event}
                          </div>
                          <div className="text-left">
                            Temperature: {historyData[date][time].temperature}
                            °C
                          </div>
                          <div className="text-left">Soil Moisture:</div>
                          <ul className="list-disc ml-4">
                            {Object.keys(
                              historyData[date][time].soil_moisture
                            ).map((sensor) => (
                              <li key={sensor} className="text-left">
                                {sensor}:{" "}
                                {historyData[date][time].soil_moisture[sensor]}%
                              </li>
                            ))}
                          </ul>
                          <div className="w-[95%] py-1 bg-white my-2 "></div>
                        </div>
                      ))}
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
