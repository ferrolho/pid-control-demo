/**
 * Preset Scenarios for Demonstrating PID Behavior
 *
 * Each preset demonstrates specific control concepts:
 * - Well-tuned: Fast response, minimal overshoot
 * - Too much P: Oscillation and overshoot
 * - No damping: Sustained oscillation
 * - P-only with friction: Steady-state error
 * - Aggressive D: Sluggish response
 */

export const PRESETS = {
    'well-tuned': {
        name: 'Well-tuned',
        description: 'Balanced gains for fast, stable response',
        kp: 2.0,
        ki: 0.1,
        kd: 0.5,
        friction: 0.2,
        expectedBehavior: 'Fast rise time, minimal overshoot, settles to target'
    },
    'too-much-p': {
        name: 'Too much P',
        description: 'Excessive proportional gain causes oscillation',
        kp: 8.0,
        ki: 0.1,
        kd: 0.5,
        friction: 0.2,
        expectedBehavior: 'Large overshoot and sustained oscillation'
    },
    'no-damping': {
        name: 'No damping',
        description: 'No derivative term, system oscillates',
        kp: 4.0,
        ki: 0.1,
        kd: 0.0,
        friction: 0.2,
        expectedBehavior: 'Oscillation without damping'
    },
    'p-only-friction': {
        name: 'P-only with friction',
        description: 'No integral term, friction causes steady-state error',
        kp: 2.0,
        ki: 0.0,
        kd: 0.5,
        friction: 0.5,
        expectedBehavior: 'Never reaches target due to friction'
    },
    'aggressive-d': {
        name: 'Aggressive D',
        description: 'Excessive derivative gain makes response sluggish',
        kp: 2.0,
        ki: 0.1,
        kd: 5.0,
        friction: 0.2,
        expectedBehavior: 'Slow, overly cautious approach to target'
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
