"use client";

import { useEffect, useState } from "react";
import { database, ref, onValue } from "./firebase"; // Pastikan path benar

const RealtimeData = () => {
  const [data, setData] = useState({
    soil_moisture: {
      sensor_1: 0,
      sensor_2: 0,
      sensor_3: 0,
      sensor_4: 0,
      sensor_5: 0,
    },
    temperature: 0,
  });

  useEffect(() => {
    const dataRef = ref(database, "realtime_data"); // Perbaikan cara mengambil referensi

    // Mendengarkan perubahan data di Firebase
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const realtimeData = snapshot.val();
      if (realtimeData) {
        setData(realtimeData);
      }
    });

    // Membersihkan listener saat komponen unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h1 className="text-xl font-bold">Realtime Data</h1>
      <h2 className="text-lg font-semibold mt-2">Soil Moisture Levels</h2>
      <ul className="list-disc ml-5">
        {Object.entries(data.soil_moisture).map(([sensor, value]) => (
          <li key={sensor} className="text-gray-700">
            {sensor}: <span className="font-bold">{value}%</span>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-semibold mt-2">Temperature</h2>
      <p className="text-gray-700">{data.temperature}°C</p>
    </div>
  );
};

export default RealtimeData;
