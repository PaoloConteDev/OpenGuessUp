import {
  calibrationAngle,
  tiltAngle,
  TiltGate,
  type AngleSample,
  type Gesture,
  type Gravity,
  type Position,
} from "./tilt";

export type TiltState = {
  status: "checking" | "ready" | "unavailable";
  calibrated: boolean;
  calibrating: boolean;
  calibrationSeconds: number;
  error: boolean;
  position: Position;
};
export const EMPTY_TILT: TiltState = {
  status: "unavailable",
  calibrated: false,
  calibrating: false,
  calibrationSeconds: 0,
  error: false,
  position: "neutral",
};
export type SensorSource = {
  isAvailable: () => Promise<boolean>;
  subscribe: (listener: (sample: Gravity) => void) => { remove: () => void };
};
export type SensorClock = {
  now: () => number;
  schedule: (fn: () => void, delay: number) => () => void;
};
const realClock: SensorClock = {
  now: Date.now,
  schedule: (fn, delay) => {
    const timer = setTimeout(fn, delay);
    return () => clearTimeout(timer);
  },
};

// Expo-free lifecycle controller: real subscriptions use the same logic as the
// simulated streams in tests, including dropout, calibration and late events.
export class TiltSession {
  state: TiltState = { ...EMPTY_TILT, status: "checking" };
  private gate = new TiltGate();
  private samples: AngleSample[] = [];
  private enabled = false;
  private disposed = false;
  private subscription?: { remove: () => void };
  private stopWatch?: () => void;
  private stopCalibration?: () => void;
  private lastSample: number | null = null;
  private startedAt = 0;
  constructor(
    private source: SensorSource,
    private onGesture: (gesture: Gesture) => void,
    private onState: (state: TiltState) => void,
    private clock: SensorClock = realClock,
  ) {}
  private update(patch: Partial<TiltState>) {
    if (this.disposed) return;
    const next = { ...this.state, ...patch };
    if (
      (Object.keys(next) as (keyof TiltState)[]).some(
        (key) => next[key] !== this.state[key],
      )
    ) {
      this.state = next;
      this.onState(next);
    }
  }
  async start() {
    this.startedAt = this.clock.now();
    this.watch();
    try {
      const supported = await this.source.isAvailable();
      if (this.disposed) return;
      if (!supported) {
        this.unavailable();
        return;
      }
      this.subscription = this.source.subscribe((sample) =>
        this.receive(sample),
      );
    } catch {
      this.unavailable();
    }
  }
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.gate.reset();
  }
  private unavailable() {
    if (this.disposed) return;
    this.stopCalibration?.();
    this.gate.clear();
    this.samples = [];
    this.update({
      status: "unavailable",
      calibrated: false,
      calibrating: false,
      calibrationSeconds: 0,
      position: "neutral",
    });
  }
  private watch() {
    this.stopWatch = this.clock.schedule(() => {
      if (this.disposed) return;
      if (this.clock.now() - (this.lastSample ?? this.startedAt) > 2500)
        this.unavailable();
      this.watch();
    }, 500);
  }
  private receive(vector: Gravity) {
    if (this.disposed) return;
    const angle = tiltAngle(vector);
    if (angle === null) return;
    const now = this.clock.now();
    this.lastSample = now;
    this.samples = [
      ...this.samples.filter((s) => s.at >= now - 1100),
      { angle, at: now },
    ];
    this.update({ status: "ready" });
    const gesture = this.gate.sample(
      angle,
      this.enabled && this.state.calibrated,
      now,
    );
    this.update({ position: this.gate.position });
    if (gesture) this.onGesture(gesture);
  }
  calibrate() {
    this.stopCalibration?.();
    this.gate.clear();
    this.update({
      calibrated: false,
      calibrating: false,
      calibrationSeconds: 0,
      error: false,
      position: "neutral",
    });
    if (this.disposed || this.state.status !== "ready") {
      this.update({ error: true });
      return;
    }
    this.samples = [];
    this.update({ calibrating: true, calibrationSeconds: 3 });
    const started = this.clock.now();
    const check = () => {
      if (this.disposed) return;
      const now = this.clock.now();
      const seconds = Math.max(0, Math.ceil((started + 3000 - now) / 1000));
      this.update({ calibrationSeconds: seconds });
      const baseline =
        seconds === 0
          ? calibrationAngle(
              this.samples.filter((s) => s.at >= started + 3000),
              now,
            )
          : null;
      if (baseline !== null && this.gate.calibrate(baseline)) {
        this.update({ calibrated: true, calibrating: false, error: false });
      } else if (now - started >= 7000) {
        this.update({ calibrated: false, calibrating: false, error: true });
      } else
        this.stopCalibration = this.clock.schedule(check, seconds ? 1000 : 100);
    };
    this.stopCalibration = this.clock.schedule(check, 1000);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stopWatch?.();
    this.stopCalibration?.();
    this.subscription?.remove();
    this.gate.clear();
    this.samples = [];
  }
}
