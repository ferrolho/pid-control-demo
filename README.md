# Interactive PID Control Demo

An educational web application for learning PID (Proportional-Integral-Derivative) control through interactive visualization and hands-on experimentation.

**[Live Demo](https://[your-username].github.io/pid-control-demo/)** (after GitHub Pages deployment)

## Overview

PID control is fundamental to robotics, automation, and control systems. This demo helps you build intuitive understanding through interactive visualization rather than just equations and theory.

### Learning Objectives

- Understand what each PID term (P, I, D) does and when it's needed
- Develop intuition for tuning trade-offs (speed vs stability vs accuracy)
- Recognize common control behaviors: overshoot, oscillation, steady-state error
- Experiment with different scenarios to build mental models

## Features

### Interactive Visualization
- Real-time 1D cart simulation with physics (mass, friction, disturbances)
- Live graphs showing position, error, and PID term contributions
- Motion trails to visualize behavior

### Educational Content
- Clickable equation terms with detailed explanations
- Side panel with comprehensive learning materials covering:
  - Core concepts (feedback control, error signals, overshoot, etc.)
  - Detailed PID term explanations with physical intuitions
  - Advanced topics (integral windup, derivative kick, tuning methods)

### Preset Scenarios
Demonstrate key control concepts:
- **Well-tuned**: Fast response, minimal overshoot, settles to target
- **Too much P**: Demonstrates overshoot and oscillation
- **No damping**: Shows oscillation without D term
- **P-only with friction**: Reveals steady-state error (needs I term)
- **Aggressive D**: Sluggish, overly cautious response

### Interactive Controls
- Adjust PID gains (Kp, Ki, Kd) with live updates
- Manual target positioning via slider or canvas click
- Auto-step mode: automatic alternating setpoints for systematic observation
- Add disturbances to test controller robustness

### Performance Metrics
Real-time display of:
- Rise time
- Settling time
- Overshoot percentage
- Steady-state error

## The PID Algorithm

The PID controller generates a control signal based on three terms:

```
u(t) = Kp·e(t) + Ki·∫e(t)dt + Kd·de(t)/dt
```

Where:
- **u(t)** = control signal (force applied to cart)
- **e(t)** = error signal (target - actual position)
- **Kp** = proportional gain
- **Ki** = integral gain
- **Kd** = derivative gain

### Physical Intuitions

- **P term (Kp·e)**: Acts like a **spring** pulling toward the target. Larger error = stronger pull.
- **I term (Ki·∫e·dt)**: Acts like a **bucket filling with water**. Accumulates past errors to eliminate steady-state offset.
- **D term (Kd·de/dt)**: Acts like a **shock absorber**. Provides damping to prevent overshoot.

## How to Use

### Basic Exploration
1. Watch the cart track the target position
2. Drag the target slider or click on the canvas to set a new target
3. Observe how the cart responds

### Experimenting with Gains
1. Try the preset scenarios to see different behaviors
2. Adjust individual gains (Kp, Ki, Kd) to see their effects:
   - **Increase Kp**: Faster response, but more overshoot/oscillation
   - **Increase Ki**: Eliminates steady-state error, but can cause sluggishness
   - **Increase Kd**: Reduces overshoot, dampens oscillations, but can slow response

### Learning with Side Panel
1. Click on terms in the equation (Kp, Ki, Kd, e(t), etc.)
2. Explore three content categories:
   - **Concepts**: Fundamental control theory ideas
   - **PID Terms**: Detailed P, I, D explanations
   - **Advanced**: Integral windup, derivative kick, tuning methods

### Testing Disturbance Rejection
1. Click "Add Disturbance" to apply an impulse force
2. Watch how the controller compensates
3. Try with different gain settings to see effect on disturbance rejection

### Auto-Step Mode
1. Enable "Auto-step mode" checkbox
2. System automatically alternates between positions every 5 seconds
3. Useful for comparing different tuning configurations

## Technical Implementation

### System Model: 1D Cart on Rail
- Simple physics: F = ma with friction
- State: position (0-100 scale), velocity
- Control input: force from PID controller
- Disturbances: impulse forces that decay over time

### Controller Features
- **Integral anti-windup**: Clamps accumulated integral to prevent windup
- **Derivative on measurement**: Avoids "derivative kick" on setpoint changes
- **Output saturation**: Limits control signal to realistic actuator constraints

### Performance
- Runs at 60 FPS with Euler integration (dt = 0.0167s)
- Graphs show last 10 seconds of data (600 points)
- Responsive design works on desktop, tablet, and mobile

## File Structure

```
pid-control-demo/
├── index.html                  # Main page
├── styles/
│   ├── main.css               # Layout & responsive design
│   ├── components.css         # UI component styling
│   └── side-panel.css         # Educational panel styling
├── js/
│   ├── app.js                 # Main application orchestration
│   ├── pid-controller.js      # PID algorithm implementation
│   ├── simulation.js          # Cart physics simulation
│   ├── visualization.js       # Canvas rendering
│   ├── graphs.js              # Chart.js wrapper
│   ├── presets.js             # Preset configurations
│   ├── side-panel.js          # Side panel UI component
│   └── educational-content.js # Learning content
└── README.md
```

## Technologies Used

- **Vanilla JavaScript** (ES6 modules) - no build tools required
- **Chart.js 4.x** - time-series graphs
- **HTML5 Canvas** - cart animation
- **CSS Grid/Flexbox** - responsive layout

## Browser Requirements

Modern browsers with ES6 module support:
- Chrome/Edge 61+
- Firefox 60+
- Safari 11+

No transpilation needed.

## Local Development

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd pid-control-demo
   ```

2. Serve with any static file server:
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Node.js (http-server)
   npx http-server

   # VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

3. Open in browser: `http://localhost:8000`

## GitHub Pages Deployment

1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from main branch" and root directory
4. Site will be available at `https://[username].github.io/pid-control-demo/`

## Future Enhancements

**Version 1.1:**
- Mass and friction adjustment sliders
- Guided tutorial mode with step-by-step overlay
- Export data as CSV
- URL parameter sharing for specific configurations

**Version 2.0:**
- Multiple system models (temperature, motor speed)
- Auto-tuning algorithms (Ziegler-Nichols)
- Frequency domain visualization (Bode plots)
- Comparison mode (side-by-side controllers)

## Educational Context

This demo was created as part of robotics tutoring materials. It emphasizes:
- **Learning by doing**: Interactive exploration over passive reading
- **Physical intuition**: Connecting math to real-world behavior
- **Progressive disclosure**: Start simple, add complexity as understanding grows

Perfect for:
- Control systems students
- Robotics engineers
- Anyone curious about how feedback control works

## References

- Franklin, G.F., Powell, J.D., & Emami-Naeini, A. (2019). *Feedback Control of Dynamic Systems* (8th ed.)
- Åström, K.J., & Murray, R.M. (2021). *Feedback Systems: An Introduction for Scientists and Engineers* (2nd ed.)
- [Wikipedia: PID Controller](https://en.wikipedia.org/wiki/PID_controller)

## License

This project is open source and available for educational use.

## Contact

Created for robotics tutoring - feel free to use and adapt for educational purposes.

---

**Tip**: Start with the "Well-tuned" preset, then try "Too much P" to see what happens when gains are poorly chosen. Use the side panel to understand *why* each behavior occurs!
