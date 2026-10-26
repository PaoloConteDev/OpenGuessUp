import { useEffect, useRef, useState } from "react";
import { AppState, Modal, Platform, View } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library/legacy";
import * as FS from "expo-file-system/legacy";
import { useVideoPlayer, VideoView } from "expo-video";
import { Video, X } from "lucide-react-native";
import { Button, IconButton, Txt } from "./UI";
import { useI18n } from "../i18n/context";
import { C } from "../theme";
import type { Phase } from "../game/engine";
const prefix = "open-guess-turn-";
export async function cleanOldVideos() {
  if (Platform.OS !== "android" || !FS.cacheDirectory) return;
  try {
    const files = await FS.readDirectoryAsync(FS.cacheDirectory);
    for (const file of files.filter((f) => f.startsWith(prefix))) {
      const uri = FS.cacheDirectory + file;
      const stat = await FS.getInfoAsync(uri);
      if (
        stat.exists &&
        "modificationTime" in stat &&
        Date.now() / 1000 - (stat.modificationTime ?? 0) > 86400
      )
        await FS.deleteAsync(uri, { idempotent: true });
    }
  } catch {}
}
export function Recording({
  phase,
  enabled,
  onEnabled,
  onReady,
  onStatus,
}: {
  phase: Phase;
  enabled: boolean;
  onEnabled: (v: boolean) => void;
  onReady: (v: boolean) => void;
  onStatus: (text: string) => void;
}) {
  const { t } = useI18n();
  const [cameraPermission, requestCamera] = useCameraPermissions();
  const [micPermission, requestMic] = useMicrophonePermissions();
  const [ready, setReady] = useState(false);
  const camera = useRef<CameraView>(null);
  const recording = useRef(false);
  const mounted = useRef(true);
  const [uris, setUris] = useState<string[]>([]);
  const urisRef = useRef<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const permitted = cameraPermission?.granted && micPermission?.granted;
  useEffect(() => {
    onReady(!enabled || (!!permitted && ready));
  }, [enabled, permitted, ready]);
  useEffect(() => {
    mounted.current = true;
    const sub = AppState.addEventListener("change", (s) => {
      if (s !== "active" && recording.current) camera.current?.stopRecording();
    });
    return () => {
      mounted.current = false;
      sub.remove();
      if (recording.current) camera.current?.stopRecording();
      for (const uri of urisRef.current)
        void FS.deleteAsync(uri, { idempotent: true }).catch(() => {});
    };
  }, []);
  useEffect(() => {
    if (
      phase === "active" &&
      enabled &&
      permitted &&
      ready &&
      !recording.current
    ) {
      recording.current = true;
      void (async () => {
        try {
          const data = await camera.current?.recordAsync({ maxDuration: 125 });
          if (data?.uri) {
            const path = FS.cacheDirectory + prefix + Date.now() + ".mp4";
            await FS.moveAsync({ from: data.uri, to: path });
            if (mounted.current) {
              urisRef.current = [...urisRef.current, path];
              setUris(urisRef.current);
            } else await FS.deleteAsync(path, { idempotent: true });
          }
        } catch {
          if (mounted.current) {
            onStatus(
              t("Video non disponibile o interrotto. Il gioco continua."),
            );
            onEnabled(false);
          }
        } finally {
          recording.current = false;
        }
      })();
    } else if ((phase !== "active" || !enabled) && recording.current) {
      camera.current?.stopRecording();
    }
  }, [phase, enabled, permitted, ready]);
  async function enable() {
    try {
      const c = await requestCamera();
      const m = await requestMic();
      if (c.granted && m.granted) {
        setReady(false);
        onEnabled(true);
      } else {
        onStatus(t("Permesso negato. Puoi giocare senza video."));
        onEnabled(false);
      }
    } catch {
      onStatus(t("Video non disponibile o interrotto. Il gioco continua."));
    }
  }
  if (Platform.OS !== "android") return null;
  return (
    <View style={{ gap: 10 }}>
      {phase === "preparation" && (
        <>
          <Button
            title={t(enabled ? "Continua senza video" : "Attiva registrazione")}
            secondary
            icon={Video}
            onPress={() => (enabled ? onEnabled(false) : void enable())}
          />
          <Txt style={{ fontSize: 12, color: C.muted, lineHeight: 19 }}>
            {t(
              "Solo Android. Fotocamera frontale e microfono, attivi soltanto durante il turno.",
            )}
          </Txt>
        </>
      )}
      {enabled &&
        permitted &&
        (["preparation", "countdown", "active", "paused"].includes(phase) ||
          recording.current) && (
          <View
            style={{
              width: phase === "active" ? 58 : 120,
              height: phase === "active" ? 34 : 68,
              borderRadius: 10,
              overflow: "hidden",
              alignSelf: "center",
            }}
          >
            <CameraView
              ref={camera}
              style={{ flex: 1 }}
              mode="video"
              facing="front"
              videoQuality="480p"
              mute={false}
              onCameraReady={() => setReady(true)}
              onMountError={() => {
                setReady(false);
                onEnabled(false);
                onStatus(
                  t("Video non disponibile o interrotto. Il gioco continua."),
                );
              }}
            />
          </View>
        )}
      {enabled && !ready && phase === "preparation" && (
        <Txt style={{ color: C.muted }}>{t("Avvio fotocamera…")}</Txt>
      )}
      {phase === "review" &&
        uris.map((uri, i) => (
          <View
            key={uri}
            style={{
              gap: 8,
              padding: 12,
              backgroundColor: C.panelLight,
              borderRadius: 15,
            }}
          >
            <Txt>
              {t("Video del turno")} {i + 1}
            </Txt>
            <Button
              title={t("Anteprima video")}
              secondary
              icon={Video}
              onPress={() => setPreview(uri)}
            />
            <Button
              title={t("Salva in galleria")}
              secondary
              disabled={busy}
              onPress={() => {
                setBusy(true);
                void (async () => {
                  try {
                    const p = await MediaLibrary.requestPermissionsAsync(true, [
                      "video",
                    ]);
                    if (!p.granted) {
                      onStatus(t("Permesso negato. Puoi giocare senza video."));
                      return;
                    }
                    await MediaLibrary.saveToLibraryAsync(uri);
                    onStatus(t("Video salvato"));
                  } catch {
                    onStatus(
                      t(
                        "Video non disponibile o interrotto. Il gioco continua.",
                      ),
                    );
                  } finally {
                    setBusy(false);
                  }
                })();
              }}
            />
            <Button
              title={t("Condividi video")}
              secondary
              onPress={() => {
                void Sharing.isAvailableAsync()
                  .then((ok) =>
                    ok
                      ? Sharing.shareAsync(uri, { mimeType: "video/mp4" })
                      : onStatus(
                          t(
                            "Video non disponibile o interrotto. Il gioco continua.",
                          ),
                        ),
                  )
                  .catch(() =>
                    onStatus(
                      t(
                        "Video non disponibile o interrotto. Il gioco continua.",
                      ),
                    ),
                  );
              }}
            />
            <Button
              title={t("Elimina video")}
              secondary
              icon={X}
              onPress={() => {
                void FS.deleteAsync(uri, { idempotent: true });
                urisRef.current = urisRef.current.filter((u) => u !== uri);
                setUris(urisRef.current);
              }}
            />
          </View>
        ))}
      {preview && <Preview uri={preview} onClose={() => setPreview(null)} />}
    </View>
  );
}
function Preview({ uri, onClose }: { uri: string; onClose: () => void }) {
  const { t } = useI18n();
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });
  return (
    <Modal onRequestClose={onClose} animationType="slide">
      <View style={{ flex: 1, backgroundColor: C.bg, padding: 20, gap: 15 }}>
        <Button
          title={t("Chiudi finestra")}
          icon={X}
          secondary
          onPress={onClose}
        />
        <VideoView
          player={player}
          style={{ flex: 1 }}
          nativeControls
          contentFit="contain"
        />
      </View>
    </Modal>
  );
}
