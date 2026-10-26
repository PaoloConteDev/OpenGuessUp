import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calibrationAngle,
  tiltAngle,
  TiltGate,
  type Gravity,
  type Gesture,
} from "../src/game/tilt";
import {
  TiltSession,
  type SensorClock,
  type SensorSource,
  type TiltState,
} from "../src/game/tiltSession";

function vector(angle: number, side = 1, scale = 1): Gravity {
  const rad = (angle * Math.PI) / 180;
  return { x: side * Math.cos(rad) * scale, y: 0, z: Math.sin(rad) * scale };
}
function gateStream(baseline = 0) {
  const gate = new TiltGate();
  gate.calibrate(baseline);
  let time = 0;
  const events: Gesture[] = [];
  return {
    gate,
    events,
    feed(angle: number, duration: number, enabled = true, step = 50) {
      for (let elapsed = 0; elapsed < duration; elapsed += step) {
        time += step;
        const result = gate.sample(angle, enabled, time);
        if (result) events.push(result);
      }
    },
    gap(ms: number) {
      time += ms;
    },
  };
}

test("Gravity angle preserves down/up in both landscape directions and at different gravity scales", () => {
  for (const side of [-1, 1])
    for (const scale of [0.8, 1, 1.2])
      for (const angle of [-60, -25, 0, 25, 60])
        assert.ok(
          Math.abs(tiltAngle(vector(angle, side, scale))! - angle) < 0.0001,
        );
  assert.equal(tiltAngle({ x: NaN, y: 0, z: 1 }), null);
  assert.equal(tiltAngle({ x: 0, y: 0, z: 0 }), null);
  assert.equal(tiltAngle({ x: 0, y: 0, z: 3 }), null);
});
test("Calibration accepts a naturally tilted forehead but rejects flat, moving, stale or incomplete samples", () => {
  const samples = Array.from({ length: 20 }, (_, i) => ({
    angle: 25 + (i % 2 ? 1 : -1),
    at: i * 50,
  }));
  assert.equal(calibrationAngle(samples, 1000), 25);
  assert.equal(
    calibrationAngle(
      samples.map((s) => ({ ...s, angle: 80 })),
      1000,
    ),
    null,
  );
  assert.equal(
    calibrationAngle(
      samples.map((s, i) => ({ ...s, angle: i * 2 })),
      1000,
    ),
    null,
  );
  assert.equal(calibrationAngle(samples, 4000), null);
  assert.equal(calibrationAngle(samples.slice(0, 3), 1000), null);
});
test("One outcome per tilt; neutral return required even if tilted in the opposite direction", () => {
  const s = gateStream();
  s.feed(0, 300);
  s.feed(-42, 1500);
  assert.deepEqual(s.events, ["correct"]);
  s.feed(42, 1000);
  assert.equal(s.events.length, 1);
  s.feed(0, 600);
  s.feed(42, 500);
  assert.deepEqual(s.events, ["correct", "skip"]);
});
test("A 30 degree gesture works relative to a 25 degree calibrated baseline", () => {
  const s = gateStream(25);
  s.feed(25, 300);
  s.feed(-5, 600);
  assert.deepEqual(s.events, ["correct"]);
  s.feed(25, 600);
  s.feed(55, 600);
  assert.deepEqual(s.events, ["correct", "skip"]);
});
test("Jitter and a single acceleration spike do not produce an outcome", () => {
  const s = gateStream();
  s.feed(0, 300);
  for (let i = 0; i < 20; i++) s.feed(i % 2 ? 6 : -6, 50);
  s.feed(80, 50);
  s.feed(0, 500);
  assert.deepEqual(s.events, []);
});
test("Countdown may establish neutral but never scores; the first nod after countdown works", () => {
  const s = gateStream();
  s.feed(0, 1000, false);
  s.feed(-45, 500);
  assert.deepEqual(s.events, ["correct"]);
});
test("Tilting while disabled cannot score on resume without returning to neutral", () => {
  const s = gateStream();
  s.feed(0, 300);
  s.feed(-45, 1000, false);
  s.feed(-45, 500);
  assert.deepEqual(s.events, []);
  s.feed(0, 600);
  s.feed(-45, 500);
  assert.deepEqual(s.events, ["correct"]);
});
test("Detection is based on elapsed time at 5, 10, 20 and 50Hz", () => {
  for (const step of [20, 50, 100, 200]) {
    const s = gateStream();
    s.feed(0, 400, true, step);
    s.feed(40, 800, true, step);
    assert.deepEqual(s.events, ["skip"]);
  }
});
test("A gap in readings disarms the gate", () => {
  const s = gateStream();
  s.feed(0, 500);
  s.gap(3000);
  s.feed(-50, 1000);
  assert.deepEqual(s.events, []);
  s.feed(0, 600);
  s.feed(-50, 500);
  assert.deepEqual(s.events, ["correct"]);
});

class Clock implements SensorClock {
  time = 0;
  id = 0;
  tasks = new Map<number, { at: number; fn: () => void }>();
  now = () => this.time;
  schedule = (fn: () => void, delay: number) => {
    const id = ++this.id;
    this.tasks.set(id, { at: this.time + delay, fn });
    return () => {
      this.tasks.delete(id);
    };
  };
  advance(ms: number) {
    const end = this.time + ms;
    for (;;) {
      const next = [...this.tasks]
        .filter(([, t]) => t.at <= end)
        .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
      if (!next) break;
      this.time = next[1].at;
      this.tasks.delete(next[0]);
      next[1].fn();
    }
    this.time = end;
  }
}
async function sessionFixture() {
  const clock = new Clock(),
    events: Gesture[] = [],
    states: TiltState[] = [];
  let receive: ((sample: Gravity) => void) | undefined;
  let removed = 0;
  const source: SensorSource = {
    isAvailable: async () => true,
    subscribe: (listener) => {
      receive = listener;
      return {
        remove: () => {
          removed++;
        },
      };
    },
  };
  const session = new TiltSession(
    source,
    (gesture) => events.push(gesture),
    (state) => states.push(state),
    clock,
  );
  await session.start();
  const feed = (angle: number, duration: number) => {
    for (let elapsed = 0; elapsed < duration; elapsed += 50) {
      clock.advance(50);
      receive!(vector(angle));
    }
  };
  return {
    session,
    clock,
    events,
    states,
    feed,
    get removed() {
      return removed;
    },
    emit: (v: Gravity) => receive!(v),
    calibrate(angle = 0) {
      feed(angle, 100);
      session.calibrate();
      feed(angle, 4100);
      assert.equal(session.state.calibrated, true);
    },
  };
}
test("Availability waits for actual samples rather than trusting hardware discovery", async () => {
  const f = await sessionFixture();
  assert.equal(f.session.state.status, "checking");
  f.clock.advance(3000);
  assert.equal(f.session.state.status, "unavailable");
  f.emit(vector(0));
  assert.equal(f.session.state.status, "ready");
  assert.equal(f.session.state.calibrated, false);
  f.session.dispose();
});
test("Sensor dropout recovers availability and requires a new calibration", async () => {
  const f = await sessionFixture();
  f.calibrate(20);
  f.session.setEnabled(true);
  f.clock.advance(3000);
  assert.equal(f.session.state.status, "unavailable");
  f.feed(-40, 500);
  assert.equal(f.session.state.status, "ready");
  assert.equal(f.session.state.calibrated, false);
  assert.deepEqual(f.events, []);
  f.calibrate(20);
  f.feed(20, 300);
  f.feed(-20, 600);
  assert.deepEqual(f.events, ["correct"]);
  f.session.dispose();
});
test("Calibration allows three seconds to move the phone from a flat viewing position to the forehead", async () => {
  const f = await sessionFixture();
  f.feed(80, 100);
  f.session.calibrate();
  f.feed(80, 2000);
  assert.equal(f.session.state.calibrating, true);
  assert.equal(f.session.state.error, false);
  assert.equal(f.session.state.calibrationSeconds, 1);
  f.feed(0, 2200);
  assert.equal(f.session.state.calibrated, true);
  assert.equal(f.session.state.error, false);
  f.session.dispose();
});
test("Calibration eventually rejects a phone that remains flat instead of silently accepting it", async () => {
  const f = await sessionFixture();
  f.feed(80, 100);
  f.session.calibrate();
  f.feed(80, 7100);
  assert.equal(f.session.state.calibrated, false);
  assert.equal(f.session.state.calibrating, false);
  assert.equal(f.session.state.error, true);
  f.session.dispose();
});
test("Manual, pause and feedback disable outcomes while preview keeps working", async () => {
  const f = await sessionFixture();
  f.calibrate();
  f.session.setEnabled(false);
  f.feed(-45, 500);
  assert.equal(f.session.state.position, "correct");
  assert.deepEqual(f.events, []);
  f.feed(0, 600);
  f.session.setEnabled(true);
  f.feed(-45, 500);
  assert.deepEqual(f.events, ["correct"]);
  f.session.dispose();
});
test("Disposed sessions remove the listener once and ignore queued events and pending calibration", async () => {
  const f = await sessionFixture();
  f.feed(0, 100);
  f.session.calibrate();
  const count = f.states.length;
  f.session.dispose();
  f.session.dispose();
  f.feed(-50, 4000);
  assert.equal(f.removed, 1);
  assert.equal(f.states.length, count);
  assert.equal(f.clock.tasks.size, 0);
  assert.deepEqual(f.events, []);
});
test("Disposal during asynchronous discovery never creates a late subscription", async () => {
  let resolve!: (available: boolean) => void;
  let subscribed = false;
  const clock = new Clock();
  const session = new TiltSession(
    {
      isAvailable: () =>
        new Promise((r) => {
          resolve = r;
        }),
      subscribe: () => {
        subscribed = true;
        return { remove() {} };
      },
    },
    () => {},
    () => {},
    clock,
  );
  const starting = session.start();
  session.dispose();
  resolve(true);
  await starting;
  assert.equal(subscribed, false);
  assert.equal(clock.tasks.size, 0);
});
test("Missing or throwing sensors produce an explicit manual fallback", async () => {
  for (const isAvailable of [
    async () => false,
    async (): Promise<boolean> => {
      throw new Error("Sensor error");
    },
  ]) {
    const session = new TiltSession(
      {
        isAvailable,
        subscribe: () => {
          throw new Error("must not subscribe");
        },
      },
      () => {},
      () => {},
      new Clock(),
    );
    await session.start();
    assert.equal(session.state.status, "unavailable");
    session.dispose();
  }
});
