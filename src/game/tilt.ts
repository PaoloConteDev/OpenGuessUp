// Gravity is measured in the device's natural coordinates. Screen normal Z is
// independent of landscape-left/right: forehead = vertical, face down = -Z.
export class TiltGate {
  baseline = 0;
  filtered = 0;
  armed = false;
  stable = 0;
  initialized = false;
  calibrate(z: number) {
    this.baseline = z;
    this.filtered = z;
    this.armed = false;
    this.stable = 0;
    this.initialized = true;
  }
  reset() {
    this.armed = false;
    this.stable = 0;
  }
  sample(z: number, enabled: boolean): "correct" | "skip" | null {
    if (!Number.isFinite(z) || !this.initialized) return null;
    this.filtered += 0.22 * (z - this.filtered);
    const delta = this.filtered - this.baseline;
    if (!enabled) {
      this.reset();
      return null;
    }
    if (Math.abs(delta) < 0.18) {
      if (++this.stable >= 4) this.armed = true;
    } else this.stable = 0;
    if (this.armed && Math.abs(delta) > 0.58) {
      this.reset();
      return delta < 0 ? "correct" : "skip";
    }
    return null;
  }
}
