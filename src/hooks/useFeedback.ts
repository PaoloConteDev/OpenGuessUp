import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Settings } from "../game/engine";

export function useFeedback(settings: Pick<Settings, "sound" | "haptics">) {
  const correct = useAudioPlayer(require("../../assets/sounds/correct.wav"));
  const tick = useAudioPlayer(require("../../assets/sounds/tick.wav"));
  const finish = useAudioPlayer(require("../../assets/sounds/finish.wav"));
  const skip = useAudioPlayer(require("../../assets/sounds/skip.wav"));
  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    }).catch(() => {});
  }, []);
  return (kind: "correct" | "tick" | "finish" | "skip") => {
    if (settings.sound) {
      const player = { correct, tick, finish, skip }[kind];
      void (async () => {
        try {
          await player.seekTo(0);
          player.play();
        } catch {
          /* Sound must never interrupt a turn. */
        }
      })();
    }
    if (settings.haptics && kind !== "tick") {
      if (kind === "correct" || kind === "finish")
        void Haptics.notificationAsync(
          kind === "finish"
            ? Haptics.NotificationFeedbackType.Warning
            : Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
      else
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
          () => {},
        );
    }
  };
}
