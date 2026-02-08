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

        // Trail for showing motion history
        this.trail = [];
        this.maxTrailLength = 60; // 1 second at 60fps

        // Colors
        this.railColor = '#d1d9e6';
        this.cartColor = '#3b82f6';
        this.targetColor = '#f59e0b';
        this.trailColor = 'rgba(59, 130, 246, 0.3)';
        this.disturbanceColor = '#ef4444';
    }

    /**
     * Draw the simulation state
     * @param {number} position - Cart position (0-100)
     * @param {number} target - Target position (0-100)
     * @param {number} disturbance - Disturbance force magnitude
     */
    draw(position, target, disturbance = 0) {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // Convert 0-100 scale to canvas coordinates
        const railY = height / 2;
        const railPadding = 40;
        const railStart = railPadding;
        const railEnd = width - railPadding;
        const railLength = railEnd - railStart;

        // Helper function to convert position to x coordinate
        const posToX = (pos) => railStart + (pos / 100) * railLength;

        // Draw rail
        this.ctx.strokeStyle = this.railColor;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(railStart, railY);
        this.ctx.lineTo(railEnd, railY);
        this.ctx.stroke();

        // Draw rail end markers
        this.ctx.fillStyle = this.railColor;
        this.ctx.fillRect(railStart - 3, railY - 10, 6, 20);
        this.ctx.fillRect(railEnd - 3, railY - 10, 6, 20);

        // Draw position labels
        this.ctx.fillStyle = '#718096';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('0', railStart, railY + 25);
        this.ctx.fillText('50', railStart + railLength / 2, railY + 25);
        this.ctx.fillText('100', railEnd, railY + 25);

        // Draw motion trail
        if (this.trail.length > 1) {
            this.ctx.strokeStyle = this.trailColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(posToX(this.trail[0]), railY);
            for (let i = 1; i < this.trail.length; i++) {
                this.ctx.lineTo(posToX(this.trail[i]), railY);
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
        this.ctx.fillStyle = this.targetColor;
        this.ctx.strokeStyle = this.targetColor;
        this.ctx.lineWidth = 2;

        // Target vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(targetX, railY - 40);
        this.ctx.lineTo(targetX, railY + 40);
        this.ctx.stroke();

        // Target arrow
        this.ctx.beginPath();
        this.ctx.moveTo(targetX, railY - 40);
        this.ctx.lineTo(targetX - 6, railY - 30);
        this.ctx.lineTo(targetX + 6, railY - 30);
        this.ctx.closePath();
        this.ctx.fill();

        // Target label
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Target', targetX, railY - 50);

        // Draw cart
        const cartX = posToX(position);
        const cartSize = 24;

        // Cart body (square)
        this.ctx.fillStyle = this.cartColor;
        this.ctx.fillRect(cartX - cartSize / 2, railY - cartSize / 2, cartSize, cartSize);

        // Cart outline
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(cartX - cartSize / 2, railY - cartSize / 2, cartSize, cartSize);

        // Cart wheels
        this.ctx.fillStyle = '#1e40af';
        this.ctx.beginPath();
        this.ctx.arc(cartX - 8, railY + cartSize / 2 + 4, 4, 0, Math.PI * 2);
        this.ctx.arc(cartX + 8, railY + cartSize / 2 + 4, 4, 0, Math.PI * 2);
        this.ctx.fill();

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
            this.ctx.moveTo(cartX, railY - 35);
            this.ctx.lineTo(cartX + arrowDir * arrowLength, railY - 35);
            this.ctx.stroke();

            // Arrow head
            this.ctx.beginPath();
            this.ctx.moveTo(cartX + arrowDir * arrowLength, railY - 35);
            this.ctx.lineTo(cartX + arrowDir * (arrowLength - 8), railY - 40);
            this.ctx.lineTo(cartX + arrowDir * (arrowLength - 8), railY - 30);
            this.ctx.closePath();
            this.ctx.fill();
        }

        // Draw position value
        this.ctx.fillStyle = this.cartColor;
        this.ctx.font = 'bold 14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(position.toFixed(1), cartX, railY - cartSize);
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
        const width = this.canvas.width;
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
