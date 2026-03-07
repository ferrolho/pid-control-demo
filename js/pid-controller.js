/**
 * PID Controller Implementation
 *
 * Implements: u(t) = Kp*e(t) + Ki*∫e(t)dt + Kd*de(t)/dt
 *
 * Features:
 * - Integral anti-windup (clamps accumulated integral)
 * - Derivative on measurement (avoids derivative kick on setpoint changes)
 * - Output saturation limits
 * - Exposes individual P, I, D terms for visualization
 */

export class PIDController {
    constructor(kp = 1.0, ki = 0.0, kd = 0.0) {
        this.kp = kp;
        this.ki = ki;
        this.kd = kd;

        // State variables
        this.integral = 0;
        this.previousMeasurement = null;

        // Limits
        this.integralMax = 100;
        this.outputMin = -100;
        this.outputMax = 100;

        // Last computed terms (for visualization)
        this.lastPTerm = 0;
        this.lastITerm = 0;
        this.lastDTerm = 0;
    }

    /**
     * Update the controller with new error and measurement
     * @param {number} error - Current error (setpoint - measurement)
     * @param {number} measurement - Current measured value
     * @param {number} dt - Time step in seconds
     * @returns {object} - { output, pTerm, iTerm, dTerm }
     */
    update(error, measurement, dt) {
        // Proportional term
        const pTerm = this.kp * error;

        // Integral term with anti-windup
        this.integral += error * dt;
        this.integral = Math.max(-this.integralMax, Math.min(this.integralMax, this.integral));
        const iTerm = this.ki * this.integral;

        // Derivative term (derivative on measurement to avoid derivative kick)
        let dTerm = 0;
        if (this.previousMeasurement !== null) {
            const derivative = (measurement - this.previousMeasurement) / dt;
            dTerm = -this.kd * derivative;
        }

        // Calculate total output
        let output = pTerm + iTerm + dTerm;

        // Saturate output
        output = Math.max(this.outputMin, Math.min(this.outputMax, output));

        // Store for next iteration
        this.previousMeasurement = measurement;

        // Store terms for visualization
        this.lastPTerm = pTerm;
        this.lastITerm = iTerm;
        this.lastDTerm = dTerm;

        return {
            output,
            pTerm,
            iTerm,
            dTerm
        };
    }

    /**
     * Reset controller state
     */
    reset() {
        this.integral = 0;
        this.previousMeasurement = null;
        this.lastPTerm = 0;
        this.lastITerm = 0;
        this.lastDTerm = 0;
    }

    /**
     * Update PID gains
     */
    setGains(kp, ki, kd) {
        this.kp = kp;
        this.ki = ki;
        this.kd = kd;
    }

    /**
     * Get current gains
     */
    getGains() {
        return {
            kp: this.kp,
            ki: this.ki,
            kd: this.kd
        };
    }
}
