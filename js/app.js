/**
 * Main Application
 *
 * Orchestrates:
 * - PID controller → simulation → visualization
 * - Event loop at 60 FPS
 * - UI event handlers
 * - Data recording for graphs
 * - Performance metrics calculation
 */

import { PIDController } from './pid-controller.js';
import { CartSimulation } from './simulation.js';
import { Visualization } from './visualization.js';
import { Graphs } from './graphs.js';
import { SidePanel } from './side-panel.js';
import { getPreset } from './presets.js';

class App {
    constructor() {
        // Core components
        this.pid = new PIDController(2.0, 0.1, 0.5);
        this.simulation = new CartSimulation();
        this.visualization = new Visualization('simulation-canvas');
        this.graphs = new Graphs();
        this.sidePanel = new SidePanel();

        // State
        this.target = 50;
        this.running = true;
        this.time = 0;
        this.dt = 1 / 60; // 60 FPS

        // Auto-step mode
        this.autoStepEnabled = false;
        this.autoStepInterval = 5; // seconds
        this.autoStepTimer = 0;
        this.autoStepPositions = [25, 75];
        this.autoStepIndex = 0;

        // Performance metrics
        this.metrics = {
            riseTime: null,
            settlingTime: null,
            overshoot: null,
            steadyStateError: null
        };
        this.metricTracking = {
            startTime: null,
            startPosition: null,
            peakValue: null,
            targetReached: false,
            settledTime: null
        };

        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        // Initialize graphs
        this.graphs.init();

        // Setup UI event handlers
        this.setupEventHandlers();

        // Start animation loop
        this.animate();
    }

    /**
     * Setup all UI event handlers
     */
    setupEventHandlers() {
        // PID gain sliders
        document.getElementById('kp-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.pid.kp = value;
            document.getElementById('kp-value').textContent = value.toFixed(1);
        });

        document.getElementById('ki-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.pid.ki = value;
            document.getElementById('ki-value').textContent = value.toFixed(2);
        });

        document.getElementById('kd-slider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.pid.kd = value;
            document.getElementById('kd-value').textContent = value.toFixed(1);
        });

        // Target position slider
        document.getElementById('target-slider').addEventListener('input', (e) => {
            if (!this.autoStepEnabled) {
                this.setTarget(parseFloat(e.target.value));
            }
        });

        // Canvas click to set target
        document.getElementById('simulation-canvas').addEventListener('click', (e) => {
            if (!this.autoStepEnabled) {
                const rect = e.target.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const position = this.visualization.clickToPosition(clickX);
                if (position !== null) {
                    this.setTarget(position);
                    document.getElementById('target-slider').value = position;
                }
            }
        });

        // Auto-step toggle
        document.getElementById('auto-step-toggle').addEventListener('change', (e) => {
            this.autoStepEnabled = e.target.checked;
            if (this.autoStepEnabled) {
                this.autoStepTimer = 0;
                this.autoStepIndex = 0;
                this.setTarget(this.autoStepPositions[0]);
                // Disable manual target slider
                document.getElementById('target-slider').disabled = true;
            } else {
                // Re-enable manual target slider
                document.getElementById('target-slider').disabled = false;
            }
        });

        // Play/Pause button
        document.getElementById('play-pause-btn').addEventListener('click', () => {
            this.running = !this.running;
            const btn = document.getElementById('play-pause-btn');
            btn.textContent = this.running ? '⏸ Pause' : '▶ Play';
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
        });

        // Disturbance button
        document.getElementById('disturbance-btn').addEventListener('click', () => {
            this.simulation.addDisturbance(30);
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyPreset(btn.dataset.preset);
            });
        });
    }

    /**
     * Set new target position
     */
    setTarget(newTarget) {
        this.target = newTarget;
        document.getElementById('target-value').textContent = Math.round(newTarget);

        // Reset metrics tracking
        this.resetMetrics();
    }

    /**
     * Apply a preset configuration
     */
    applyPreset(presetName) {
        const preset = getPreset(presetName);
        if (!preset) return;

        // Update PID gains
        this.pid.setGains(preset.kp, preset.ki, preset.kd);

        // Update sliders and displays
        document.getElementById('kp-slider').value = preset.kp;
        document.getElementById('kp-value').textContent = preset.kp.toFixed(1);

        document.getElementById('ki-slider').value = preset.ki;
        document.getElementById('ki-value').textContent = preset.ki.toFixed(2);

        document.getElementById('kd-slider').value = preset.kd;
        document.getElementById('kd-value').textContent = preset.kd.toFixed(1);

        // Update friction
        this.simulation.setFriction(preset.friction);

        // Reset system
        this.reset();
    }

    /**
     * Reset simulation
     */
    reset() {
        this.simulation.reset(this.simulation.position);
        this.pid.reset();
        this.visualization.clearTrail();
        this.graphs.clear();
        this.time = 0;
        this.resetMetrics();
    }

    /**
     * Reset metrics tracking
     */
    resetMetrics() {
        this.metricTracking = {
            startTime: this.time,
            startPosition: this.simulation.position,
            peakValue: this.simulation.position,
            targetReached: false,
            settledTime: null
        };
        this.metrics = {
            riseTime: null,
            settlingTime: null,
            overshoot: null,
            steadyStateError: null
        };
    }

    /**
     * Update metrics based on current state
     */
    updateMetrics() {
        const position = this.simulation.position;
        const error = this.target - position;
        const tolerance = 2; // 2% tolerance for settling

        // Track peak value for overshoot calculation
        if (this.metricTracking.startPosition < this.target) {
            // Moving up
            if (position > this.metricTracking.peakValue) {
                this.metricTracking.peakValue = position;
            }
        } else {
            // Moving down
            if (position < this.metricTracking.peakValue) {
                this.metricTracking.peakValue = position;
            }
        }

        // Rise time: time to first reach target (within tolerance)
        if (!this.metricTracking.targetReached && Math.abs(error) <= tolerance) {
            this.metrics.riseTime = this.time - this.metricTracking.startTime;
            this.metricTracking.targetReached = true;
        }

        // Settling time: time to reach and stay within tolerance
        if (this.metricTracking.targetReached) {
            if (Math.abs(error) <= tolerance) {
                if (this.metricTracking.settledTime === null) {
                    this.metricTracking.settledTime = this.time;
                }
            } else {
                // Left the tolerance band, reset settled time
                this.metricTracking.settledTime = null;
            }

            // Consider settled if stayed in band for 0.5 seconds
            if (this.metricTracking.settledTime !== null &&
                (this.time - this.metricTracking.settledTime) >= 0.5) {
                if (this.metrics.settlingTime === null) {
                    this.metrics.settlingTime = this.metricTracking.settledTime - this.metricTracking.startTime;
                }
            }
        }

        // Overshoot: percentage beyond target
        if (this.metricTracking.targetReached && this.metrics.overshoot === null) {
            const targetChange = Math.abs(this.target - this.metricTracking.startPosition);
            if (targetChange > 1) {
                const overshootAmount = Math.abs(this.metricTracking.peakValue - this.target);
                this.metrics.overshoot = (overshootAmount / targetChange) * 100;
            }
        }

        // Steady-state error: error after settling (measured 3 seconds after start)
        if (this.time - this.metricTracking.startTime >= 3.0) {
            this.metrics.steadyStateError = Math.abs(error);
        }

        // Update display
        this.updateMetricsDisplay();
    }

    /**
     * Update metrics display
     */
    updateMetricsDisplay() {
        document.getElementById('rise-time-value').textContent =
            this.metrics.riseTime !== null ? `${this.metrics.riseTime.toFixed(2)}s` : '—';

        document.getElementById('settling-time-value').textContent =
            this.metrics.settlingTime !== null ? `${this.metrics.settlingTime.toFixed(2)}s` : '—';

        document.getElementById('overshoot-value').textContent =
            this.metrics.overshoot !== null ? `${this.metrics.overshoot.toFixed(1)}%` : '—';

        document.getElementById('ss-error-value').textContent =
            this.metrics.steadyStateError !== null ? `${this.metrics.steadyStateError.toFixed(2)}` : '—';
    }

    /**
     * Main animation loop
     */
    animate() {
        if (this.running) {
            // Auto-step mode
            if (this.autoStepEnabled) {
                this.autoStepTimer += this.dt;
                if (this.autoStepTimer >= this.autoStepInterval) {
                    this.autoStepTimer = 0;
                    this.autoStepIndex = (this.autoStepIndex + 1) % this.autoStepPositions.length;
                    this.setTarget(this.autoStepPositions[this.autoStepIndex]);
                    document.getElementById('target-slider').value = this.target;
                }
            }

            // Calculate error
            const error = this.target - this.simulation.position;

            // Update PID controller
            const { output, pTerm, iTerm, dTerm } = this.pid.update(error, this.dt);

            // Update simulation
            this.simulation.update(output, this.dt);

            // Get current state
            const state = this.simulation.getState();

            // Update visualization
            this.visualization.draw(state.position, this.target, state.disturbance);

            // Update graphs
            this.graphs.update(this.time, this.target, state.position, error, { pTerm, iTerm, dTerm });

            // Update metrics
            this.updateMetrics();

            // Increment time
            this.time += this.dt;
        }

        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// Start application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
