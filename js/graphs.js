/**
 * Chart.js Wrapper for Time-Series Graphs
 *
 * Creates and manages three synchronized graphs:
 * 1. Position vs time (target vs actual)
 * 2. Error signal vs time
 * 3. Control terms breakdown (P, I, D)
 */

export class Graphs {
    constructor() {
        this.charts = {};
        this.maxDataPoints = 600; // 10 seconds at 60fps
    }

    /**
     * Initialize all charts
     */
    init() {
        this.createPositionChart();
        this.createErrorChart();
        this.createControlTermsChart();
    }

    /**
     * Create position tracking chart
     */
    createPositionChart() {
        const ctx = document.getElementById('position-chart').getContext('2d');

        this.charts.position = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Target',
                        data: [],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        borderDash: [5, 5]
                    },
                    {
                        label: 'Actual Position',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Position vs Time'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time (s)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Position'
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }

    /**
     * Create error signal chart
     */
    createErrorChart() {
        const ctx = document.getElementById('error-chart').getContext('2d');

        this.charts.error = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Error',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Error Signal vs Time'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time (s)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Error'
                        }
                    }
                }
            }
        });
    }

    /**
     * Create control terms breakdown chart
     */
    createControlTermsChart() {
        const ctx = document.getElementById('control-terms-chart').getContext('2d');

        this.charts.terms = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'P Term',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: true
                    },
                    {
                        label: 'I Term',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.5)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: true
                    },
                    {
                        label: 'D Term',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.5)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'PID Terms Breakdown'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time (s)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Control Signal'
                        }
                    }
                }
            }
        });
    }

    /**
     * Update all charts with new data
     * @param {number} time - Current time in seconds
     * @param {number} target - Target position
     * @param {number} position - Actual position
     * @param {number} error - Error signal
     * @param {object} terms - {pTerm, iTerm, dTerm}
     */
    update(time, target, position, error, terms) {
        const timeLabel = time.toFixed(2);

        // Update position chart
        this.charts.position.data.labels.push(timeLabel);
        this.charts.position.data.datasets[0].data.push(target);
        this.charts.position.data.datasets[1].data.push(position);

        // Update error chart
        this.charts.error.data.labels.push(timeLabel);
        this.charts.error.data.datasets[0].data.push(error);

        // Update control terms chart
        this.charts.terms.data.labels.push(timeLabel);
        this.charts.terms.data.datasets[0].data.push(terms.pTerm);
        this.charts.terms.data.datasets[1].data.push(terms.iTerm);
        this.charts.terms.data.datasets[2].data.push(terms.dTerm);

        // Trim data to keep only last N points
        this.trimData(this.charts.position, this.maxDataPoints);
        this.trimData(this.charts.error, this.maxDataPoints);
        this.trimData(this.charts.terms, this.maxDataPoints);

        // Update charts
        this.charts.position.update('none');
        this.charts.error.update('none');
        this.charts.terms.update('none');
    }

    /**
     * Trim chart data to maximum number of points
     */
    trimData(chart, maxPoints) {
        if (chart.data.labels.length > maxPoints) {
            const excess = chart.data.labels.length - maxPoints;
            chart.data.labels.splice(0, excess);
            chart.data.datasets.forEach(dataset => {
                dataset.data.splice(0, excess);
            });
        }
    }

    /**
     * Clear all chart data
     */
    clear() {
        Object.values(this.charts).forEach(chart => {
            chart.data.labels = [];
            chart.data.datasets.forEach(dataset => {
                dataset.data = [];
            });
            chart.update('none');
        });
    }

    /**
     * Destroy all charts
     */
    destroy() {
        Object.values(this.charts).forEach(chart => {
            chart.destroy();
        });
        this.charts = {};
    }
}
