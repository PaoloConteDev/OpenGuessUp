import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { Accelerometer } from "expo-sensors";
import { TiltGate } from "../game/tilt";
export function useTilt(
  requested: boolean,
  enabled: boolean,
  onGesture: (o: "correct" | "skip") => void,
) {
  const gate = useRef(new TiltGate());
  const samples = useRef<{ z: number; at: number }[]>([]);
  const callback = useRef(onGesture);
  callback.current = onGesture;
  const active = useRef(enabled);
  active.current = enabled;
  const [available, setAvailable] = useState(false);
  const [calibrated, setCalibrated] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [error, setError] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    setCalibrated(false);
    gate.current.initialized = false;
    if (Platform.OS === "web" || !requested) {
      setAvailable(false);
      return;
    }
    let mounted = true;
    let sub: { remove: () => void } | undefined;
    Accelerometer.isAvailableAsync()
      .then((ok) => {
        if (!mounted) return;
        setAvailable(ok);
        if (ok) {
          Accelerometer.setUpdateInterval(50);
          sub = Accelerometer.addListener(({ z }) => {
            last.current = Date.now();
            samples.current = [
              ...samples.current.filter((s) => s.at > Date.now() - 1100),
              { z, at: Date.now() },
            ];
            const result = gate.current.sample(z, active.current);
            if (result) callback.current(result);
          });
        }
      })
      .catch(() => setAvailable(false));
    const started = Date.now();
    const watchdog = setInterval(() => {
      if (Date.now() - (last.current || started) > 2500) {
        setAvailable(false);
        setCalibrated(false);
      }
    }, 1000);
    return () => {
      mounted = false;
      sub?.remove();
      clearInterval(watchdog);
      gate.current.reset();
      samples.current = [];
      last.current = 0;
    };
  }, [requested]);
  useEffect(() => {
    if (!enabled) gate.current.reset();
  }, [enabled]);
  async function calibrate() {
    setCalibrating(true);
    setError(false);
    setCalibrated(false);
    await new Promise((r) => setTimeout(r, 1100));
    const s = samples.current.filter((s) => s.at > Date.now() - 1000);
    const mean = s.reduce((n, v) => n + v.z, 0) / s.length;
    const spread =
      Math.max(...s.map((x) => x.z)) - Math.min(...s.map((x) => x.z));
    if (s.length < 8 || Math.abs(mean) > 0.38 || spread > 0.18) {
      setError(true);
    } else {
      gate.current.calibrate(mean);
      setCalibrated(true);
    }
    setCalibrating(false);
  }
  return {
    available,
    calibrated,
    calibrating,
    error,
    calibrate,
    reset: () => {
      gate.current.reset();
      setCalibrated(false);
    },
  };
}
