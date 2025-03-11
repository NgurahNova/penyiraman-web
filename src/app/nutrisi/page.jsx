"use client";
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "@/components/firebase";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Collapse } from "react-collapse";

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

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Fetch real-time data from Firebase
  useEffect(() => {
    const dataRef = ref(database, "MonitoringNutrisi/realtime");
    onValue(dataRef, (snapshot) => {
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

  // Function to sort data by time (latest first)
  const sortedHistoryDates = Object.keys(historyData).sort().reverse();

  // Function to sort time entries by time (latest first)
  const sortedTimeEntries = (date) => {
    return historyData[date] ? Object.keys(historyData[date]).sort().reverse() : [];
  };

  return (
    <>
      <div className="flex min-h-screen">
      <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <div className={`flex-grow flex flex-col p-4 transition-all duration-300 ${
            isExpanded ? "ml-48" : "ml-14"
          }`}>
          <div className="flex">
            <div className="flex flex-col">
              <div className="w-[250px] h-32 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold pt-4">
                Temperature
                <div className="text-4xl p-4">{temperaturetds}°C</div>
              </div>
              <div className="w-[250px] h-32 bg-gray-700 m-2 rounded-md text-center text-2xl font-bold pt-4">
                TDS
                <div className="text-4xl p-4">{tdsValue} ppm</div>
              </div>
            </div>
            <div className="flex-grow bg-gray-700 m-2 rounded-md text-2xl font-bold pt-6 text-center flex flex-col items-center">
              <div>Ultrasonic Sensor</div>
              <div className="flex gap-40">
                <div className="w-full mt-10 p-2 rounded-md">
                  Sensor 1
                  <div className="text-4xl font-bold pt-4">{distance1} CM</div>
                </div>
                <div className="w-full mt-10 p-2 rounded-md">
                  Sensor 2
                  <div className="text-4xl font-bold pt-4">{distance2} CM</div>
                </div>
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
                      <div className="bg-gray-800 p-4 rounded-md mt-2 text-left">
                        <div>Time: {time}</div>
                        <div>
                          Temperature: {historyData[getTodayDate()]?.[time]?.temperaturetds}°C
                        </div>
                        <div>
                          TDS Value: {historyData[getTodayDate()]?.[time]?.tdsValue} PPM
                        </div>
                        <div>Ultrasonic:</div>
                        <ul className="list-disc ml-4">
                          <li>
                            Distance 1: {historyData[getTodayDate()]?.[time]?.distance1} CM
                          </li>
                          <li>
                            Distance 2: {historyData[getTodayDate()]?.[time]?.distance2} CM
                          </li>
                        </ul>
                        <div>
                          Relay A: {historyData[getTodayDate()]?.[time]?.relayA}
                        </div>
                        <div>
                          Relay B: {historyData[getTodayDate()]?.[time]?.relayB}
                        </div>
                      </div>
                    </Collapse>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/2 bg-gray-700 m-2 rounded-md p-6 text-center text-2xl font-bold">
              All History
              <div className="h-[500px] overflow-y-auto mt-4">
                {sortedHistoryDates.map((date) => (
                  <div key={date} className="mb-2">
                    <div
                      className="cursor-pointer font-semibold bg-gray-800 p-2 rounded-md"
                      onClick={() => toggleDate(date)}
                    >
                      {date}
                    </div>
                    <Collapse isOpened={expandedDate === date}>
                      <div className="bg-gray-900 p-6 rounded-md mt-2">
                        <div className="max-h-[400px] overflow-y-auto">
                          {sortedTimeEntries(date).map((time) => (
                            <div
                              key={time}
                              className="bg-gray-800 p-4 rounded-md mt-4 text-left"
                            >
                              <div>Time: {time}</div>
                              <div>
                                Temperature: {historyData[date]?.[time]?.temperature}°C
                              </div>
                              <div>
                                TDS Value: {historyData[date]?.[time]?.tdsValue} PPM
                              </div>
                              <div>Ultrasonic:</div>
                              <ul className="list-disc ml-4">
                                <li>
                                  Distance 1: {historyData[date]?.[time]?.distance1} CM
                                </li>
                                <li>
                                  Distance 2: {historyData[date]?.[time]?.distance2} CM
                                </li>
                              </ul>
                              <div>
                                Relay A: {historyData[date]?.[time]?.relayA}
                              </div>
                              <div>
                                Relay B: {historyData[date]?.[time]?.relayB}
                              </div>
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