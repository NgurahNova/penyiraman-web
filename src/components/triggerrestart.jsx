"use client";
import { useEffect, useState } from "react";
import { database, ref, set, onValue } from "./firebase";

const TriggerRestart = () => {
  const [deviceState, setDeviceState] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State untuk menonaktifkan tombol sementara

  // Update Firebase saat tombol ditekan
  const toggleRestart = () => {
    if (isButtonDisabled) return; // Jika tombol dinonaktifkan, hentikan eksekusi
    const newState = !deviceState; // Toggle state
    set(ref(database, "MonitoringNutrisi/controlIoT/restart"), newState); // Update Firebase
    setDeviceState(newState); // Update state lokal

    // Nonaktifkan tombol sementara selama 5 detik
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false); // Aktifkan tombol kembali setelah 5 detik
      setDeviceState(false); // Kembalikan state ke "false" (Restart selesai)
      set(ref(database, "MonitoringNutrisi/controlIoT/restart"), false); // Reset state di Firebase
    }, 5000); // 5 detik
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
        disabled={isButtonDisabled} // Nonaktifkan tombol jika isButtonDisabled true
        className={`px-6 py-3 text-white font-bold rounded-lg transition ${
          deviceState || isButtonDisabled ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {deviceState || isButtonDisabled ? "Restarting..." : "Restart"}
      </button>
    </div>
  );
};

export default TriggerRestart;