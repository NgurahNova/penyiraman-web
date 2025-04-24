"use client";
import { useEffect, useState } from "react";
import { database, ref, set, onValue } from "./firebase";

const TriggerRelay = () => {
  const [relayAState, setRelayAState] = useState(false);
  const [relayBState, setRelayBState] = useState(false);

  // Update Firebase saat tombol ditekan
  const toggleRelays = async () => {
    const newState = !relayAState; // Toggle state berdasarkan relayA
    try {
      // Update kedua relay di Firebase
      await set(ref(database, "MonitoringNutrisi/controlIoT/relayA"), newState);
      await set(ref(database, "MonitoringNutrisi/controlIoT/relayB"), newState);
      // Update state lokal
      setRelayAState(newState);
      setRelayBState(newState);

    } catch (error) {
      console.error("Gagal mengupdate relay di Firebase:", error);
    }
  };

  // Mendengarkan perubahan dari Firebase
  useEffect(() => {
    // Referensi untuk relayA
    const relayARef = ref(database, "MonitoringNutrisi/controlIoT/relayA");
    // Referensi untuk relayB
    const relayBRef = ref(database, "MonitoringNutrisi/controlIoT/relayB");

    // Pantau perubahan pada relayA
    onValue(relayARef, (snapshot) => {
      const value = snapshot.val();
      setRelayAState(value);
    });

    // Pantau perubahan pada relayB
    onValue(relayBRef, (snapshot) => {
      const value = snapshot.val();
      setRelayBState(value);
    });
  }, []);

  return (
    <div className="flex flex-col items-center pt-6 space-y-4">
      <button
        onClick={toggleRelays}
        className={`px-6 py-3 text-white font-bold rounded-lg transition ${
          relayAState && relayBState ? "bg-green-500" : "bg-gray-500" 
        }`}
      >
        {relayAState && relayBState ? "ON" : "OFF"}
      </button>
    </div>
  );
};

export default TriggerRelay;