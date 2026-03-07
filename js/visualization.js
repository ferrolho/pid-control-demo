/**
 * Canvas Visualization for Cart Simulation
 *
 * Renders:
 * - Rail and cart
 * - Target position marker
 * - Motion trail
 * - Disturbance indicator
 */

export class Visualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Logical (CSS) dimensions
        this.width = 800;
        this.height = 200;

        // Scale canvas for high-DPI displays
        this.dpr = window.devicePixelRatio || 1;
        this.resizeCanvas();

        // Trail for showing motion history
        this.trail = [];
        this.maxTrailLength = 60; // 1 second at 60fps

        // Physics (for visual tilt)
        this.gravity = 0;

        // Colors
        this.railColor = '#d1d9e6';
        this.cartColor = '#3b82f6';
        this.targetColor = '#f59e0b';
        this.trailColor = 'rgba(59, 130, 246, 0.3)';
        this.disturbanceColor = '#ef4444';
    }

    /**
     * Set gravity for visual rail tilt
     */
    setGravity(gravity) {
        this.gravity = gravity;
    }

    /**
     * Scale canvas buffer for high-DPI displays
     */
    resizeCanvas() {
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    /**
     * Draw the simulation state
     * @param {number} position - Cart position (0-100)
     * @param {number} target - Target position (0-100)
     * @param {number} disturbance - Disturbance force magnitude
     */
    draw(position, target, disturbance = 0) {
        const width = this.width;
        const height = this.height;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Convert 0-100 scale to canvas coordinates
        const railY = height / 2;
        const railPadding = 40;
        const railStart = railPadding;
        const railEnd = width - railPadding;
        const railLength = railEnd - railStart;

        // Tilt: negative gravity pulls cart left, so left side is lower
        const tiltOffset = -(this.gravity || 0) * 3;

        // Helper functions
        const posToX = (pos) => railStart + (pos / 100) * railLength;
        const posToY = (pos) => railY + tiltOffset * (0.5 - pos / 100);

        // Draw rail
        this.ctx.strokeStyle = this.railColor;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(railStart, posToY(0));
        this.ctx.lineTo(railEnd, posToY(100));
        this.ctx.stroke();

        // Draw rail end markers
        this.ctx.fillStyle = this.railColor;
        this.ctx.save();
        this.ctx.translate(railStart, posToY(0));
        this.ctx.rotate(Math.atan2(posToY(100) - posToY(0), railLength));
        this.ctx.fillRect(-3, -10, 6, 20);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(railEnd, posToY(100));
        this.ctx.rotate(Math.atan2(posToY(100) - posToY(0), railLength));
        this.ctx.fillRect(-3, -10, 6, 20);
        this.ctx.restore();

        // Draw position labels
        this.ctx.fillStyle = '#718096';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('0', railStart, posToY(0) + 25);
        this.ctx.fillText('50', railStart + railLength / 2, posToY(50) + 25);
        this.ctx.fillText('100', railEnd, posToY(100) + 25);

        // Draw motion trail
        if (this.trail.length > 1) {
            this.ctx.strokeStyle = this.trailColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(posToX(this.trail[0]), posToY(this.trail[0]));
            for (let i = 1; i < this.trail.length; i++) {
                this.ctx.lineTo(posToX(this.trail[i]), posToY(this.trail[i]));
            }
            this.ctx.stroke();
        }

        // Update trail
        this.trail.push(position);
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Draw target position
        const targetX = posToX(target);
        const targetY = posToY(target);
        this.ctx.fillStyle = this.targetColor;
        this.ctx.strokeStyle = this.targetColor;
        this.ctx.lineWidth = 2;

        // Target vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(targetX, targetY - 40);
        this.ctx.lineTo(targetX, targetY + 40);
        this.ctx.stroke();

        // Target arrow
        this.ctx.beginPath();
        this.ctx.moveTo(targetX, targetY - 40);
        this.ctx.lineTo(targetX - 6, targetY - 30);
        this.ctx.lineTo(targetX + 6, targetY - 30);
        this.ctx.closePath();
        this.ctx.fill();

        // Target label
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Target', targetX, targetY - 50);

        // Draw cart
        const cartX = posToX(position);
        const cartY = posToY(position);
        const cartSize = 24;
        const railAngle = Math.atan2(posToY(100) - posToY(0), railLength);

        // Draw cart rotated to match rail angle
        this.ctx.save();
        this.ctx.translate(cartX, cartY);
        this.ctx.rotate(railAngle);

        // Cart body (square)
        this.ctx.fillStyle = this.cartColor;
        this.ctx.fillRect(-cartSize / 2, -cartSize / 2, cartSize, cartSize);

        // Cart outline
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-cartSize / 2, -cartSize / 2, cartSize, cartSize);

        // Cart wheels
        this.ctx.fillStyle = '#1e40af';
        this.ctx.beginPath();
        this.ctx.arc(-8, cartSize / 2 + 4, 4, 0, Math.PI * 2);
        this.ctx.arc(8, cartSize / 2 + 4, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();

        // Draw disturbance indicator
        if (Math.abs(disturbance) > 0.5) {
            this.ctx.fillStyle = this.disturbanceColor;
            this.ctx.font = '20px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('⚡ Disturbance', 20, 30);

            // Disturbance force arrow
            const arrowLength = Math.abs(disturbance) * 2;
            const arrowDir = Math.sign(disturbance);
            this.ctx.strokeStyle = this.disturbanceColor;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(cartX, cartY - 35);
            this.ctx.lineTo(cartX + arrowDir * arrowLength, cartY - 35);
            this.ctx.stroke();

            // Arrow head
            this.ctx.beginPath();
            this.ctx.moveTo(cartX + arrowDir * arrowLength, cartY - 35);
            this.ctx.lineTo(cartX + arrowDir * (arrowLength - 8), cartY - 40);
            this.ctx.lineTo(cartX + arrowDir * (arrowLength - 8), cartY - 30);
            this.ctx.closePath();
            this.ctx.fill();
        }

        // Draw position value
        this.ctx.fillStyle = this.cartColor;
        this.ctx.font = 'bold 14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(position.toFixed(1), cartX, cartY - cartSize);
    }

    /**
     * Clear the motion trail
     */
    clearTrail() {
        this.trail = [];
    }

    /**
     * Handle canvas click to set target position
     * @param {number} clickX - Click x coordinate
     * @returns {number|null} - Target position (0-100) or null if outside rail
     */
    clickToPosition(clickX) {
        const width = this.width;
        const railPadding = 40;
        const railStart = railPadding;
        const railEnd = width - railPadding;
        const railLength = railEnd - railStart;

        if (clickX < railStart || clickX > railEnd) {
            return null;
        }

        const position = ((clickX - railStart) / railLength) * 100;
        return Math.max(0, Math.min(100, position));
    }
}
