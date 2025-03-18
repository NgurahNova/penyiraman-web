"use client";
import { useEffect, useState } from "react";
import { database, ref, set, onValue } from "./firebase";

const TriggerRelay = () => {
  const [relayAState, setRelayAState] = useState(false);
  const [relayBState, setRelayBState] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State untuk menonaktifkan tombol sementara

  // Update Firebase saat tombol ditekan
  const toggleRelays = async () => {
    if (isButtonDisabled) return; // Jika tombol dinonaktifkan, hentikan eksekusi
    const newState = !relayAState; // Toggle state berdasarkan relayA
    try {
      // Update kedua relay di Firebase
      await set(ref(database, "MonitoringNutrisi/controlIoT/relayA"), newState);
      await set(ref(database, "MonitoringNutrisi/controlIoT/relayB"), newState);
      // Update state lokal
      setRelayAState(newState);
      setRelayBState(newState);

      // Nonaktifkan tombol sementara selama 5 detik
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false); // Aktifkan tombol kembali setelah 5 detik
        setRelayAState(false); // Kembalikan state relayA ke "OFF"
        setRelayBState(false); // Kembalikan state relayB ke "OFF"
      }, 5000); // 5 detik
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
        disabled={isButtonDisabled} // Nonaktifkan tombol jika isButtonDisabled true
        className={`px-6 py-3 text-white font-bold rounded-lg transition ${
          relayAState || isButtonDisabled ? "bg-green-500" : "bg-gray-500" 
        }`}
      >
        {relayAState || isButtonDisabled ? "ON" : "OFF"}
      </button>
    </div>
  );
};

export default TriggerRelay;