"use client";
import { useEffect, useState } from "react";
import { database, ref, set, onValue } from "./firebase";

const ControlButtonRestart = () => {
  const [deviceState, setDeviceState] = useState(false);

  // Update Firebase saat tombol ditekan
  const toggleDevice = () => {
    const newState = !deviceState;
    set(ref(database, "control/restart_trigger"), newState);
    setDeviceState(newState);
  };

  // Mendengarkan perubahan dari Firebase
  useEffect(() => {
    const deviceRef = ref(database, "control/restart_trigger");
    onValue(deviceRef, (snapshot) => {
      const value = snapshot.val();
      setDeviceState(value);
    });
  }, []);

  return (
    <div className="pt-6 flex flex-col items-center">
      <button
        onClick={toggleDevice}
        className={`px-6 py-3 text-white font-bold rounded-lg transition ${
          deviceState ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {deviceState ? "Restarting..." : "Restart"}
      </button>
    </div>
  );
};

export default ControlButtonRestart;
