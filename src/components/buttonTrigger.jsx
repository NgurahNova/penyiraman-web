"use client";
import { useEffect, useState } from "react";
import { database, ref, set, onValue } from "./firebase";

const ControlButton = () => {
  const [deviceState, setDeviceState] = useState(false);

  // Update Firebase saat tombol ditekan
  const toggleDevice = () => {
    const newState = !deviceState;
    set(ref(database, "control/watering_trigger"), newState);
    setDeviceState(newState);
  };

  // Mendengarkan perubahan dari Firebase
  useEffect(() => {
    const deviceRef = ref(database, "control/watering_trigger");
    onValue(deviceRef, (snapshot) => {
      const value = snapshot.val();
      setDeviceState(value);
    });
  }, []);

  return (
    <div className="flex flex-col items-center pt-6">
      <button
        onClick={toggleDevice}
        className={`px-6 py-3 text-white font-bold rounded-lg transition ${
          deviceState ? "bg-gray-500" : "bg-green-500"
        }`}
      >
        {deviceState ? "Turn OFF" : "Watering"}
      </button>
    </div>
  );
};

export default ControlButton;
