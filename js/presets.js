/**
 * Preset Scenarios for Demonstrating PID Behavior
 *
 * Each preset demonstrates specific control concepts:
 * - Well-tuned: Fast response, moderate overshoot, settles quickly
 * - Too much P: Large overshoot and sustained oscillation
 * - No damping: Sustained oscillation without D term
 * - P-only (tilted rail): Steady-state error from constant disturbance
 * - Aggressive D: Sluggish, overly cautious response
 */

export const PRESETS = {
    'well-tuned': {
        name: 'Well-tuned',
        description: 'Balanced gains for fast, stable response',
        kp: 8.0,
        ki: 3.0,
        kd: 5.0,
        friction: 0.5,
        gravity: 0,
        expectedBehavior: 'Fast rise (~1s), moderate overshoot (~19%), settles within ~7s'
    },
    'too-much-p': {
        name: 'Too much P',
        description: 'Excessive proportional gain causes oscillation',
        kp: 15.0,
        ki: 0.0,
        kd: 0.5,
        friction: 0.5,
        gravity: 0,
        expectedBehavior: 'Large overshoot (~55%), sustained oscillation (~11 crossings)'
    },
    'no-damping': {
        name: 'No damping',
        description: 'No derivative term, system oscillates',
        kp: 8.0,
        ki: 0.0,
        kd: 0.0,
        friction: 0.5,
        gravity: 0,
        expectedBehavior: 'Large overshoot (~67%), sustained oscillation (~9 crossings)'
    },
    'p-only-friction': {
        name: 'P-only (tilted rail)',
        description: 'No integral term, constant force causes steady-state error',
        kp: 3.0,
        ki: 0.0,
        kd: 2.0,
        friction: 0.3,
        gravity: -5,
        expectedBehavior: 'Cart stops short of target (SS error ~1.7) — needs Ki to fix'
    },
    'aggressive-d': {
        name: 'Aggressive D',
        description: 'Excessive derivative gain makes response sluggish',
        kp: 8.0,
        ki: 0.1,
        kd: 15.0,
        friction: 0.5,
        gravity: 0,
        expectedBehavior: 'Very slow approach (~4s rise), minimal overshoot (~2%)'
    }
};

/**
 * Get a preset configuration by name
 * @param {string} presetName - Name of the preset
 * @returns {object|null} - Preset configuration or null if not found
 */
export function getPreset(presetName) {
    return PRESETS[presetName] || null;
}

/**
 * Get all preset names
 * @returns {Array<string>} - Array of preset names
 */
export function getPresetNames() {
    return Object.keys(PRESETS);
}
