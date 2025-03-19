"use client";
import { useEffect, useState } from "react";
import { database, ref, set, onValue } from "./firebase";

const TriggerRestart = () => {
  const [deviceState, setDeviceState] = useState(false);

  // Update Firebase saat tombol ditekan
  const toggleRestart = () => {
    const newState = !deviceState; // Toggle state
    set(ref(database, "MonitoringNutrisi/controlIoT/restart"), newState); // Update Firebase
    setDeviceState(newState); // Update state lokal
  };

  // Mendengarkan perubahan dari Firebase
  useEffect(() => {
    const deviceRef = ref(database, "MonitoringNutrisi/controlIoT/restart");
    onValue(deviceRef, (snapshot) => {
      const value = snapshot.val();
      setDeviceState(value);
    });
  }, []);

  return (
    <div className="pt-6 flex flex-col items-center">
      <button
        onClick={toggleRestart}
        className={`px-6 py-3 text-white font-bold rounded-lg transition ${
          deviceState ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {deviceState ? "Restarting..." : "Restart"}
      </button>
    </div>
  );
};

export default TriggerRestart;
