/**
 * Preset Validation Script
 *
 * Simulates each preset offline and reports performance metrics
 * to verify that presets behave as described.
 *
 * Usage: node test-presets.mjs
 */

// --- Inline copies of simulation classes (avoids ESM import issues) ---

class CartSimulation {
    constructor() {
        this.position = 50;
        this.velocity = 0;
        this.mass = 1.0;
        this.friction = 0.2;
        this.gravity = 0;
        this.disturbanceForce = 0;
        this.disturbanceDecay = 0.95;
    }
    update(controlForce, dt) {
        if (Math.abs(this.disturbanceForce) > 0.01) this.disturbanceForce *= this.disturbanceDecay;
        else this.disturbanceForce = 0;
        const frictionForce = -this.friction * this.velocity;
        const totalForce = controlForce + this.disturbanceForce + this.gravity + frictionForce;
        const acceleration = totalForce / this.mass;
        this.velocity += acceleration * dt;
        this.position += this.velocity * dt;
        if (this.position <= 0) { this.position = 0; this.velocity = Math.max(0, this.velocity); }
        if (this.position >= 100) { this.position = 100; this.velocity = Math.min(0, this.velocity); }
    }
    reset(position = 50) { this.position = position; this.velocity = 0; this.disturbanceForce = 0; }
}

class PIDController {
    constructor(kp, ki, kd) {
        this.kp = kp; this.ki = ki; this.kd = kd;
        this.integral = 0;
        this.previousMeasurement = null;
        this.integralMax = 100;
        this.outputMin = -100;
        this.outputMax = 100;
    }
    update(error, measurement, dt) {
        const pTerm = this.kp * error;
        this.integral += error * dt;
        this.integral = Math.max(-this.integralMax, Math.min(this.integralMax, this.integral));
        const iTerm = this.ki * this.integral;
        let dTerm = 0;
        if (this.previousMeasurement !== null) {
            dTerm = -this.kd * (measurement - this.previousMeasurement) / dt;
        }
        this.previousMeasurement = measurement;
        let output = pTerm + iTerm + dTerm;
        output = Math.max(this.outputMin, Math.min(this.outputMax, output));
        return { output, pTerm, iTerm, dTerm };
    }
    reset() { this.integral = 0; this.previousMeasurement = null; }
}

// --- Presets (must match js/presets.js) ---

const PRESETS = {
    'well-tuned': {
        name: 'Well-tuned', kp: 8.0, ki: 3.0, kd: 5.0, friction: 0.5, gravity: 0,
        expectedBehavior: 'Fast rise (~1s), moderate overshoot (~19%), settles within ~7s'
    },
    'too-much-p': {
        name: 'Too much P', kp: 15.0, ki: 0.0, kd: 0.5, friction: 0.5, gravity: 0,
        expectedBehavior: 'Large overshoot (~55%), sustained oscillation (~11 crossings)'
    },
    'no-damping': {
        name: 'No damping', kp: 8.0, ki: 0.0, kd: 0.0, friction: 0.5, gravity: 0,
        expectedBehavior: 'Large overshoot (~67%), sustained oscillation (~9 crossings)'
    },
    'p-only-friction': {
        name: 'P-only (tilted rail)', kp: 3.0, ki: 0.0, kd: 2.0, friction: 0.3, gravity: -5,
        expectedBehavior: 'Cart stops short of target (SS error ~1.7) — needs Ki to fix'
    },
    'aggressive-d': {
        name: 'Aggressive D', kp: 8.0, ki: 0.1, kd: 15.0, friction: 0.5, gravity: 0,
        expectedBehavior: 'Very slow approach (~4s rise), minimal overshoot (~2%)'
    }
};

// --- Simulation runner ---

function simulate(name, preset) {
    const dt = 1 / 60;
    const target = 75;
    const startPos = 50;
    const steps = Math.round(10 / dt); // 10 seconds

    const sim = new CartSimulation();
    sim.friction = preset.friction;
    sim.gravity = preset.gravity || 0;
    sim.reset(startPos);

    const pid = new PIDController(preset.kp, preset.ki, preset.kd);

    let peak = startPos;
    let riseTime = null;
    const positions = [];

    for (let i = 0; i < steps; i++) {
        const error = target - sim.position;
        const { output } = pid.update(error, sim.position, dt);
        sim.update(output, dt);
        positions.push(sim.position);

        if (sim.position > peak) peak = sim.position;
        if (riseTime === null && sim.position >= startPos + (target - startPos) * 0.9) {
            riseTime = i * dt;
        }
    }

    // Settling time: last time outside ±0.5 band
    const band = 0.5;
    let settleTime = '>10';
    for (let i = steps - 1; i >= 0; i--) {
        if (Math.abs(positions[i] - target) > band) {
            settleTime = ((i + 1) * dt).toFixed(2);
            break;
        }
    }
    if (parseFloat(settleTime) >= 10) settleTime = '>10';

    // Zero crossings (oscillation)
    let crossings = 0;
    for (let i = 1; i < positions.length; i++) {
        if ((positions[i] - target) * (positions[i - 1] - target) < 0) crossings++;
    }

    const finalPos = positions[positions.length - 1];
    const overshoot = ((peak - target) / (target - startPos) * 100);
    const ssError = target - finalPos;

    console.log(`\n=== ${name} ===`);
    console.log(`  Expected: ${preset.expectedBehavior}`);
    console.log(`  Gains: Kp=${preset.kp} Ki=${preset.ki} Kd=${preset.kd} friction=${preset.friction} gravity=${preset.gravity || 0}`);
    console.log(`  Rise time:    ${riseTime != null ? riseTime.toFixed(2) + 's' : '---'}`);
    console.log(`  Settle time:  ${settleTime}s`);
    console.log(`  Overshoot:    ${overshoot.toFixed(1)}%`);
    console.log(`  SS error:     ${ssError.toFixed(2)}`);
    console.log(`  Crossings:    ${crossings}`);
}

// --- Run all presets ---

console.log('PID Preset Validation');
console.log('=====================');
console.log('Simulating step from position 50 → 75 over 10 seconds at 60 Hz');

for (const [key, preset] of Object.entries(PRESETS)) {
    simulate(key, preset);
}
