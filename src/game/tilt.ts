export type Gesture = "correct" | "skip";
export type Gravity = { x: number; y: number; z: number };
export type Position = Gesture | "neutral" | "return";
export type AngleSample = { angle: number; at: number };

// Android accelerometer convention: screen facing up is +Z. Using all three
// axes gives an angle independent of landscape-left/right and gravity scale.
export function tiltAngle({ x, y, z }: Gravity): number | null {
  if (![x, y, z].every(Number.isFinite)) return null;
  const magnitude = Math.hypot(x, y, z);
  if (magnitude < 0.65 || magnitude > 1.35) return null;
  return (Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI;
}

export function calibrationAngle(samples: AngleSample[], now: number) {
  const recent = samples.filter(
    (s) => s.at >= now - 1000 && s.at <= now && Number.isFinite(s.angle),
  );
  if (recent.length < 5 || recent.at(-1)!.at - recent[0]!.at < 750) return null;
  const angles = recent.map((s) => s.angle);
  const mean = angles.reduce((sum, value) => sum + value, 0) / angles.length;
  if (Math.abs(mean) > 35 || Math.max(...angles) - Math.min(...angles) > 10)
    return null;
  return mean;
}

export class TiltGate {
  private baseline = 0;
  private filtered = 0;
  private initialized = false;
  private armed = false;
  private neutralSince: number | null = null;
  private tiltSince: number | null = null;
  private lastAt: number | null = null;
  private wasEnabled = false;
  calibrate(angle: number) {
    this.clear();
    if (!Number.isFinite(angle) || Math.abs(angle) > 35) return false;
    this.baseline = this.filtered = angle;
    this.initialized = true;
    return true;
  }
  reset() {
    this.armed = false;
    this.neutralSince = this.tiltSince = null;
  }
  clear() {
    this.reset();
    this.initialized = false;
    this.lastAt = null;
    this.wasEnabled = false;
  }
  get position(): Position {
    const delta = this.filtered - this.baseline;
    if (!this.initialized || Math.abs(delta) <= 12) return "neutral";
    if (Math.abs(delta) < 26) return "return";
    return delta < 0 ? "correct" : "skip";
  }
  sample(angle: number, enabled: boolean, now: number): Gesture | null {
    if (!this.initialized || !Number.isFinite(angle) || !Number.isFinite(now))
      return null;
    const gap = this.lastAt === null ? 50 : now - this.lastAt;
    if (
      enabled &&
      !this.wasEnabled &&
      gap <= 150 &&
      this.neutralSince !== null &&
      now - this.neutralSince >= 160 &&
      Math.abs(this.filtered - this.baseline) <= 12
    )
      this.armed = true;
    this.wasEnabled = enabled;
    if (gap < 0 || gap > 500) {
      this.reset();
      this.filtered = angle;
    }
    this.lastAt = now;
    const alpha = 1 - Math.exp(-Math.min(100, Math.max(0, gap)) / 90);
    this.filtered += alpha * (angle - this.filtered);
    const delta = this.filtered - this.baseline;
    if (Math.abs(delta) <= 12) {
      this.neutralSince ??= now;
    } else this.neutralSince = null;
    if (!enabled) {
      this.armed = false;
      this.tiltSince = null;
      return null;
    }
    if (this.neutralSince !== null && now - this.neutralSince >= 160)
      this.armed = true;
    if (this.armed && Math.abs(delta) >= 26) {
      this.tiltSince ??= now;
      if (now - this.tiltSince >= 80) {
        this.reset();
        return delta < 0 ? "correct" : "skip";
      }
    } else this.tiltSince = null;
    return null;
  }
}
