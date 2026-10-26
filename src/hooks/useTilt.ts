import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { Accelerometer } from "expo-sensors";
import { EMPTY_TILT, TiltSession, type TiltState } from "../game/tiltSession";
import type { Gesture } from "../game/tilt";

export function useTilt(
  requested: boolean,
  enabled: boolean,
  onGesture: (o: Gesture) => void,
) {
  const controller = useRef<TiltSession | null>(null);
  const callback = useRef(onGesture);
  callback.current = onGesture;
  const active = useRef(enabled);
  active.current = enabled;
  const [state, setState] = useState<TiltState>(EMPTY_TILT);
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    if (Platform.OS === "web" || !requested) {
      setState(EMPTY_TILT);
      return;
    }
    setState({ ...EMPTY_TILT, status: "checking" });
    const session = new TiltSession(
      {
        isAvailable: () => Accelerometer.isAvailableAsync(),
        subscribe: (receive) => {
          Accelerometer.setUpdateInterval(50);
          return Accelerometer.addListener(({ x, y, z }) => {
            // Core Motion reports gravity with the opposite sign to Android.
            const sign = Platform.OS === "ios" ? -1 : 1;
            receive({ x: x * sign, y: y * sign, z: z * sign });
          });
        },
      },
      (gesture) => callback.current(gesture),
      setState,
    );
    controller.current = session;
    session.setEnabled(active.current);
    void session.start();
    const appState = AppState.addEventListener("change", (next) => {
      if (next !== "active") session.dispose();
      else {
        session.dispose();
        setState({ ...EMPTY_TILT, status: "checking" });
        setGeneration((value) => value + 1);
      }
    });
    return () => {
      appState.remove();
      session.dispose();
      if (controller.current === session) controller.current = null;
    };
  }, [requested, generation]);
  useEffect(() => {
    controller.current?.setEnabled(enabled);
  }, [enabled]);
  const visibleState: TiltState =
    Platform.OS === "web" || !requested
      ? EMPTY_TILT
      : controller.current
        ? state
        : { ...EMPTY_TILT, status: "checking" };
  return {
    ...visibleState,
    available: visibleState.status === "ready",
    calibrate: () => controller.current?.calibrate(),
    retry: () => {
      setState({ ...EMPTY_TILT, status: "checking" });
      setGeneration((value) => value + 1);
    },
  };
}
