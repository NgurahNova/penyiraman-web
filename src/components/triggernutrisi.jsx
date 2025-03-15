"use client";
import { useEffect, useState } from "react";
import { database, ref, set, onValue } from "./firebase";

const TriggerRelay = () => {
  const [relayState, setRelayState] = useState(false);

  // Update Firebase saat tombol ditekan
  const toggleRelays = () => {
    const newState = !relayState;
    set(ref(database, "MonitoringNutrisi/controlIoT/relayA"), newState);
    set(ref(database, "MonitoringNutrisi/controlIoT/relayB"), newState);
    setRelayState(newState);
  };

  // Mendengarkan perubahan dari Firebase
  useEffect(() => {
    const relayRef = ref(database, "MonitoringNutrisi/controlIoT/relayA"); // Ambil status dari relayA
    onValue(relayRef, (snapshot) => {
      const value = snapshot.val();
      setRelayState(value);
    });
  }, []);

  return (
    <div className="flex flex-col items-center pt-6">
      <button
        onClick={toggleRelays}
        className={`px-6 py-3 text-white font-bold rounded-lg transition ${
          relayState ? "bg-gray-500" : "bg-green-500"
        }`}
      >
        {relayState ? "OFF" : "ON"}
      </button>
    </div>
  );
};

export default TriggerRelay;
