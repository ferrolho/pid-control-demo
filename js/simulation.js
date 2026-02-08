/**
 * 1D Cart Simulation
 *
 * Simple physics simulation of a cart on a rail
 * F = ma with friction and disturbances
 *
 * State: position, velocity
 * Parameters: mass (affects inertia), friction (causes steady-state error)
 */

export class CartSimulation {
    constructor() {
        // State
        this.position = 50; // 0-100 scale
        this.velocity = 0;

        // Physical parameters
        this.mass = 1.0; // kg
        this.friction = 0.2; // friction coefficient

        // Bounds
        this.minPosition = 0;
        this.maxPosition = 100;

        // Disturbance state
        this.disturbanceForce = 0;
        this.disturbanceDecay = 0.95;
    }

    /**
     * Update simulation with control input
     * @param {number} controlForce - Force from PID controller
     * @param {number} dt - Time step in seconds
     */
    update(controlForce, dt) {
        // Apply disturbance (decays over time)
        if (Math.abs(this.disturbanceForce) > 0.01) {
            this.disturbanceForce *= this.disturbanceDecay;
        } else {
            this.disturbanceForce = 0;
        }

        // Total force = control + disturbance - friction
        const frictionForce = -this.friction * this.velocity;
        const totalForce = controlForce + this.disturbanceForce + frictionForce;

        // F = ma => a = F/m
        const acceleration = totalForce / this.mass;

        // Euler integration
        this.velocity += acceleration * dt;
        this.position += this.velocity * dt;

        // Bound position and stop at boundaries
        if (this.position <= this.minPosition) {
            this.position = this.minPosition;
            this.velocity = Math.max(0, this.velocity); // Can only move right
        } else if (this.position >= this.maxPosition) {
            this.position = this.maxPosition;
            this.velocity = Math.min(0, this.velocity); // Can only move left
        }
    }

    /**
     * Add an impulse disturbance
     * @param {number} force - Magnitude of disturbance force
     */
    addDisturbance(force = 30) {
        this.disturbanceForce = force;
    }

    /**
     * Reset simulation state
     */
    reset(position = 50) {
        this.position = position;
        this.velocity = 0;
        this.disturbanceForce = 0;
    }

    /**
     * Get current state
     */
    getState() {
        return {
            position: this.position,
            velocity: this.velocity,
            disturbance: this.disturbanceForce
        };
    }

    /**
     * Set friction coefficient
     */
    setFriction(friction) {
        this.friction = friction;
    }
}
