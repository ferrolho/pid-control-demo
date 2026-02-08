/**
 * Educational Content for Side Panel
 *
 * Structured content covering:
 * - Concepts (fundamental control theory ideas)
 * - PID Terms (detailed explanation of P, I, D)
 * - Advanced Topics (integral windup, derivative kick, etc.)
 */

export const EDUCATIONAL_CONTENT = {
    concepts: {
        'feedback-control': {
            title: 'Feedback Control',
            category: 'Concepts',
            shortDesc: 'Measuring results and adjusting accordingly',
            content: `
                <p>Feedback control (closed-loop control) continuously measures the system output and compares it to the desired setpoint. The difference (error) is used to adjust the control signal.</p>

                <h3>Why Feedback Matters</h3>
                <p>Without feedback (open-loop control), the system has no way to know if it's achieving the desired result. External disturbances, friction, or modeling errors will cause the system to miss the target.</p>

                <p>With feedback, the controller automatically compensates for these issues by measuring the actual output and adjusting accordingly.</p>

                <h3>Example in This Demo</h3>
                <p>The cart's position is continuously measured and compared to the target. The PID controller uses this error to generate the control force that pushes the cart toward the target.</p>
            `,
            relatedTerms: ['error-signal', 'control-signal']
        },
        'error-signal': {
            title: 'Error Signal',
            category: 'Concepts',
            shortDesc: 'The difference between target and actual',
            content: `
                <p>The error signal is the foundation of feedback control. It's defined as:</p>

                <div class="formula">e(t) = setpoint - measurement</div>

                <p>In this demo, the error is the difference between the target position and the cart's actual position.</p>

                <h3>Why Error Matters</h3>
                <ul>
                    <li><strong>Positive error:</strong> Cart is behind target → push forward</li>
                    <li><strong>Negative error:</strong> Cart is ahead of target → push backward</li>
                    <li><strong>Zero error:</strong> Cart is at target → no correction needed</li>
                </ul>

                <p>All three PID terms use the error signal in different ways:</p>
                <ul>
                    <li><strong>P term:</strong> Reacts to current error</li>
                    <li><strong>I term:</strong> Accumulates past error</li>
                    <li><strong>D term:</strong> Reacts to rate of change of error</li>
                </ul>
            `,
            relatedTerms: ['proportional', 'integral', 'derivative']
        },
        'control-signal': {
            title: 'Control Signal',
            category: 'Concepts',
            shortDesc: 'The output that drives the system',
            content: `
                <p>The control signal u(t) is the output of the PID controller. It represents the force, voltage, or other actuation that drives the system toward the target.</p>

                <div class="formula">u(t) = K<sub>p</sub>·e(t) + K<sub>i</sub>·∫e(t)dt + K<sub>d</sub>·de(t)/dt</div>

                <h3>In This Demo</h3>
                <p>The control signal represents the <strong>force</strong> applied to the cart (measured in arbitrary units). Positive values push the cart to the right, negative values push left.</p>

                <h3>Real-World Examples</h3>
                <ul>
                    <li><strong>Motor speed control:</strong> Voltage applied to motor</li>
                    <li><strong>Temperature control:</strong> Heater power level</li>
                    <li><strong>Robot arm:</strong> Torque applied to joint</li>
                </ul>

                <p>The control signal is the sum of the P, I, and D terms. Watch the "PID Terms Breakdown" graph to see how each term contributes.</p>
            `,
            relatedTerms: ['proportional', 'integral', 'derivative']
        },
        'overshoot': {
            title: 'Overshoot',
            category: 'Concepts',
            shortDesc: 'When the system exceeds the target',
            content: `
                <p>Overshoot occurs when the system moves past the target before settling. It's measured as the percentage by which the peak value exceeds the setpoint.</p>

                <h3>What Causes Overshoot?</h3>
                <ul>
                    <li><strong>Too much P gain:</strong> Strong proportional action builds momentum that carries past the target</li>
                    <li><strong>Not enough D gain:</strong> Insufficient damping can't slow down approach</li>
                    <li><strong>System inertia:</strong> Mass and momentum naturally cause overshoot</li>
                </ul>

                <h3>Try It</h3>
                <p>Use the "Too much P" preset to see significant overshoot. Notice how the cart overshoots multiple times before settling.</p>

                <h3>How to Reduce Overshoot</h3>
                <ul>
                    <li>Decrease K<sub>p</sub> (slower response, but less overshoot)</li>
                    <li>Increase K<sub>d</sub> (adds damping to slow approach)</li>
                </ul>
            `,
            relatedTerms: ['proportional', 'derivative', 'settling-time']
        },
        'oscillation': {
            title: 'Oscillation',
            category: 'Concepts',
            shortDesc: 'Repeated overshooting around the target',
            content: `
                <p>Oscillation occurs when the system repeatedly overshoots the target in both directions, creating a wave-like motion.</p>

                <h3>Causes of Oscillation</h3>
                <ul>
                    <li><strong>Excessive P gain:</strong> Too aggressive proportional action</li>
                    <li><strong>Insufficient damping:</strong> Not enough D term to slow down</li>
                    <li><strong>High I gain:</strong> Can cause oscillation if too aggressive</li>
                </ul>

                <h3>Try It</h3>
                <p>Use the "No damping" preset (K<sub>d</sub>=0) to see sustained oscillation. The cart will bounce back and forth around the target.</p>

                <h3>How to Fix Oscillation</h3>
                <ul>
                    <li>Reduce K<sub>p</sub> to decrease aggressiveness</li>
                    <li>Increase K<sub>d</sub> to add damping</li>
                    <li>If oscillation is slow and sluggish, reduce K<sub>i</sub></li>
                </ul>
            `,
            relatedTerms: ['proportional', 'derivative', 'overshoot']
        },
        'settling-time': {
            title: 'Settling Time',
            category: 'Concepts',
            shortDesc: 'Time to reach and stay within target band',
            content: `
                <p>Settling time is the time it takes for the system to reach the target and stay within a small tolerance band (typically ±2% of the setpoint).</p>

                <h3>What Affects Settling Time?</h3>
                <ul>
                    <li><strong>P gain:</strong> Higher K<sub>p</sub> = faster initial response, but may oscillate longer</li>
                    <li><strong>D gain:</strong> Higher K<sub>d</sub> = faster settling by damping oscillations</li>
                    <li><strong>I gain:</strong> Too high can slow settling by causing overshoot</li>
                </ul>

                <h3>Trade-offs</h3>
                <p>There's often a trade-off between rise time (how quickly you first reach the target) and settling time (how quickly oscillations die out). The "Well-tuned" preset balances these factors.</p>
            `,
            relatedTerms: ['rise-time', 'overshoot', 'derivative']
        },
        'steady-state-error': {
            title: 'Steady-State Error',
            category: 'Concepts',
            shortDesc: 'Persistent offset from target',
            content: `
                <p>Steady-state error is the difference between the target and actual position after the system has "settled" (stopped moving significantly).</p>

                <h3>What Causes It?</h3>
                <p>Constant disturbances like friction, gravity, or wind can prevent the system from reaching the exact target. The P and D terms can't eliminate this error because:</p>
                <ul>
                    <li><strong>P term:</strong> As error approaches zero, P term approaches zero → not enough force to overcome friction</li>
                    <li><strong>D term:</strong> When velocity is zero, D term is zero → provides no help</li>
                </ul>

                <h3>The Solution: Integral Term</h3>
                <p>The I term accumulates error over time. Even a small steady-state error will eventually build up enough integral to generate sufficient force to overcome friction and reach the target.</p>

                <h3>Try It</h3>
                <p>Use the "P-only with friction" preset to see steady-state error. Notice the cart stops short of the target. Then add K<sub>i</sub> and watch the error disappear.</p>
            `,
            relatedTerms: ['integral', 'proportional']
        },
        'rise-time': {
            title: 'Rise Time',
            category: 'Concepts',
            shortDesc: 'Time to first reach target region',
            content: `
                <p>Rise time measures how quickly the system initially responds when given a new target. It's typically measured as the time to go from 10% to 90% of the setpoint change.</p>

                <h3>What Controls Rise Time?</h3>
                <p>Primarily the <strong>proportional gain</strong> (K<sub>p</sub>). Higher K<sub>p</sub> means stronger force when error is large, leading to faster initial movement.</p>

                <h3>The Trade-off</h3>
                <p>Faster rise time (high K<sub>p</sub>) often comes with:</p>
                <ul>
                    <li>More overshoot</li>
                    <li>Longer settling time (oscillations)</li>
                    <li>Less stability margin</li>
                </ul>

                <p>The art of PID tuning is finding the right balance between speed and stability.</p>
            `,
            relatedTerms: ['proportional', 'settling-time', 'overshoot']
        },
        'disturbance-rejection': {
            title: 'Disturbance Rejection',
            category: 'Concepts',
            shortDesc: 'How the controller handles external forces',
            content: `
                <p>Disturbance rejection is the controller's ability to maintain the target when external forces try to push the system away.</p>

                <h3>Try It</h3>
                <p>Click the "Add Disturbance" button to apply a sudden force to the cart. Watch how the PID controller automatically corrects and brings the cart back to the target.</p>

                <h3>Which Terms Help?</h3>
                <ul>
                    <li><strong>P term:</strong> Reacts immediately when disturbance creates error</li>
                    <li><strong>I term:</strong> Eliminates any steady-state offset caused by constant disturbances</li>
                    <li><strong>D term:</strong> Reacts quickly to the sudden velocity change</li>
                </ul>

                <p>All three terms work together to reject disturbances effectively.</p>
            `,
            relatedTerms: ['proportional', 'integral', 'derivative']
        }
    },

    terms: {
        'proportional': {
            title: 'Proportional Term (P)',
            category: 'PID Terms',
            termType: 'p',
            shortDesc: 'Reacts to current error like a spring',
            content: `
                <div class="formula">P = K<sub>p</sub> × e(t)</div>

                <p>The proportional term is the simplest component. It produces a control signal that's directly proportional to the current error.</p>

                <h3>Physical Intuition: Spring</h3>
                <p>Think of the P term as a <strong>spring</strong> connecting the cart to the target. The farther away from target, the stronger the pull. As the cart approaches the target, the force decreases.</p>

                <h3>Effect of K<sub>p</sub></h3>
                <ul>
                    <li><strong>Higher K<sub>p</sub>:</strong> Stronger spring → faster response, but more overshoot and oscillation</li>
                    <li><strong>Lower K<sub>p</sub>:</strong> Weaker spring → slower response, but more stable</li>
                    <li><strong>K<sub>p</sub> = 0:</strong> No proportional action (rarely useful)</li>
                </ul>

                <h3>Limitations</h3>
                <p>P-only control has two main problems:</p>
                <ul>
                    <li><strong>Steady-state error:</strong> With friction present, the spring force might not be enough to reach the target exactly</li>
                    <li><strong>Overshoot:</strong> Momentum can carry past the target before the reduced spring force can stop it</li>
                </ul>

                <p>This is why we need the I and D terms.</p>
            `,
            relatedTerms: ['error-signal', 'overshoot', 'steady-state-error']
        },

        'integral': {
            title: 'Integral Term (I)',
            category: 'PID Terms',
            termType: 'i',
            shortDesc: 'Accumulates past error to eliminate offset',
            content: `
                <div class="formula">I = K<sub>i</sub> × ∫e(t)dt</div>

                <p>The integral term accumulates (sums up) the error over time. Even small errors, if persistent, will build up a large integral.</p>

                <h3>Physical Intuition: Bucket Filling</h3>
                <p>Imagine a <strong>bucket slowly filling with water</strong>. Each moment of error adds more water. When the bucket is full enough, it tips over and provides extra force to overcome friction or other constant disturbances.</p>

                <h3>Why It's Needed</h3>
                <p>The I term is the <strong>only way to eliminate steady-state error</strong>. When friction or other constant forces prevent the system from reaching the target, the integral term keeps building until it generates enough force to overcome the resistance.</p>

                <h3>Effect of K<sub>i</sub></h3>
                <ul>
                    <li><strong>Higher K<sub>i</sub>:</strong> Faster elimination of steady-state error, but can cause overshoot and sluggish response</li>
                    <li><strong>Lower K<sub>i</sub>:</strong> Slower error elimination, but more stable</li>
                    <li><strong>K<sub>i</sub> = 0:</strong> Steady-state error will persist if friction is present</li>
                </ul>

                <h3>Potential Problems</h3>
                <p>Too much integral action can cause:</p>
                <ul>
                    <li><strong>Integral windup:</strong> Accumulation during saturation leads to overshoot</li>
                    <li><strong>Sluggish response:</strong> Large integral takes time to "unwind"</li>
                </ul>

                <h3>Try It</h3>
                <p>Use the "P-only with friction" preset to see steady-state error, then slowly increase K<sub>i</sub> and watch the error disappear.</p>
            `,
            relatedTerms: ['steady-state-error', 'integral-windup', 'proportional']
        },

        'derivative': {
            title: 'Derivative Term (D)',
            category: 'PID Terms',
            termType: 'd',
            shortDesc: 'Reacts to rate of change, provides damping',
            content: `
                <div class="formula">D = K<sub>d</sub> × de(t)/dt</div>

                <p>The derivative term reacts to how fast the error is changing. It provides a force proportional to the velocity of approach.</p>

                <h3>Physical Intuition: Shock Absorber</h3>
                <p>Think of the D term as a <strong>shock absorber or damper</strong>. When the cart is moving quickly toward the target, the D term applies a braking force to slow it down and prevent overshoot.</p>

                <h3>Why It's Needed</h3>
                <p>The D term:</p>
                <ul>
                    <li>Reduces overshoot by slowing approach</li>
                    <li>Dampens oscillations</li>
                    <li>Improves stability</li>
                    <li>Allows higher P gain without instability</li>
                </ul>

                <h3>Effect of K<sub>d</sub></h3>
                <ul>
                    <li><strong>Higher K<sub>d</sub>:</strong> More damping → less overshoot, but can make response sluggish</li>
                    <li><strong>Lower K<sub>d</sub>:</strong> Less damping → faster but more oscillation</li>
                    <li><strong>K<sub>d</sub> = 0:</strong> No damping, likely to oscillate</li>
                </ul>

                <h3>How It Works</h3>
                <p>When the cart is:</p>
                <ul>
                    <li><strong>Approaching target quickly:</strong> D term generates opposing force to slow down</li>
                    <li><strong>Moving away from target:</strong> D term generates force to stop the movement</li>
                    <li><strong>Stationary:</strong> D term is zero</li>
                </ul>

                <h3>Implementation Note</h3>
                <p>This demo uses "derivative on measurement" rather than "derivative on error" to avoid "derivative kick" when the setpoint changes suddenly.</p>

                <h3>Try It</h3>
                <p>Use the "No damping" preset (K<sub>d</sub>=0) to see oscillation, then slowly increase K<sub>d</sub> and watch the oscillations dampen.</p>
            `,
            relatedTerms: ['overshoot', 'oscillation', 'derivative-kick']
        }
    },

    advanced: {
        'integral-windup': {
            title: 'Integral Windup',
            category: 'Advanced',
            shortDesc: 'Integral accumulation during saturation',
            content: `
                <p>Integral windup occurs when the integral term accumulates to a large value while the control output is saturated (at its limits).</p>

                <h3>The Problem</h3>
                <p>Imagine the target is far away. The error is large and persistent, so the integral term keeps accumulating. Eventually, the control output hits its maximum limit, but the integral keeps growing.</p>

                <p>When the system finally reaches the target, there's a huge integral term that takes a long time to "unwind," causing significant overshoot.</p>

                <h3>Solution: Anti-Windup</h3>
                <p>This demo implements anti-windup by <strong>clamping the integral term</strong> to a maximum value. Once the integral reaches this limit, it stops accumulating until the error decreases.</p>

                <h3>Real-World Impact</h3>
                <p>Windup is especially problematic in systems with:</p>
                <ul>
                    <li>Actuator limits (motors have max speed/torque)</li>
                    <li>Large setpoint changes</li>
                    <li>Long periods of sustained error</li>
                </ul>
            `,
            relatedTerms: ['integral', 'control-saturation']
        },

        'derivative-kick': {
            title: 'Derivative Kick',
            category: 'Advanced',
            shortDesc: 'Sudden D term spike on setpoint change',
            content: `
                <p>Derivative kick is a sudden spike in the derivative term that occurs when the setpoint changes abruptly.</p>

                <h3>Why It Happens</h3>
                <p>If we calculate the derivative as d(error)/dt, and the setpoint suddenly jumps, the error also jumps suddenly. This creates a large derivative spike even though the system hasn't moved yet.</p>

                <div class="formula">d(error)/dt = d(setpoint - measurement)/dt</div>

                <p>When setpoint jumps, d(setpoint)/dt is very large → derivative kick.</p>

                <h3>Solution: Derivative on Measurement</h3>
                <p>This demo uses "derivative on measurement" instead:</p>

                <div class="formula">D = -K<sub>d</sub> × d(measurement)/dt</div>

                <p>Now the derivative term only reacts to changes in the actual system state, not setpoint changes. The negative sign is because we want to oppose motion.</p>

                <h3>Trade-off</h3>
                <p>This approach eliminates derivative kick but also means the D term doesn't help with the initial response to a setpoint change (only with slowing down the approach).</p>
            `,
            relatedTerms: ['derivative', 'control-signal']
        },

        'tuning-methods': {
            title: 'PID Tuning Methods',
            category: 'Advanced',
            shortDesc: 'Systematic approaches to finding gains',
            content: `
                <p>Finding good PID gains is more art than science, but several systematic methods exist.</p>

                <h3>Manual Tuning (What You're Doing Now!)</h3>
                <p>A good starting approach:</p>
                <ol>
                    <li>Set K<sub>i</sub> = 0 and K<sub>d</sub> = 0</li>
                    <li>Increase K<sub>p</sub> until system oscillates</li>
                    <li>Reduce K<sub>p</sub> to about half that value</li>
                    <li>Increase K<sub>d</sub> to reduce overshoot</li>
                    <li>Increase K<sub>i</sub> to eliminate steady-state error</li>
                </ol>

                <h3>Ziegler-Nichols Method</h3>
                <p>A classical tuning method:</p>
                <ol>
                    <li>Find "ultimate gain" K<sub>u</sub>: K<sub>p</sub> value that causes sustained oscillation</li>
                    <li>Measure oscillation period T<sub>u</sub></li>
                    <li>Use formulas: K<sub>p</sub>=0.6×K<sub>u</sub>, K<sub>i</sub>=2K<sub>p</sub>/T<sub>u</sub>, K<sub>d</sub>=K<sub>p</sub>×T<sub>u</sub>/8</li>
                </ol>

                <p>This often gives aggressive tuning that needs adjustment.</p>

                <h3>Software Auto-Tuning</h3>
                <p>Modern controllers often include auto-tuning algorithms that automatically find good gains by exciting the system and analyzing its response.</p>

                <h3>The Trade-offs</h3>
                <p>There's no single "perfect" tuning. You must balance:</p>
                <ul>
                    <li><strong>Speed:</strong> How fast to reach target (rise time)</li>
                    <li><strong>Stability:</strong> Overshoot and oscillation</li>
                    <li><strong>Accuracy:</strong> Steady-state error</li>
                </ul>

                <p>Different applications prioritize these differently.</p>
            `,
            relatedTerms: ['proportional', 'integral', 'derivative']
        },

        'control-saturation': {
            title: 'Control Saturation',
            category: 'Advanced',
            shortDesc: 'Actuator limits affect behavior',
            content: `
                <p>Real actuators have physical limits. Motors have maximum speed and torque. Heaters have maximum power. When the PID controller demands more than the actuator can provide, we have saturation.</p>

                <h3>Effects of Saturation</h3>
                <ul>
                    <li><strong>Slower response:</strong> Can't apply full desired force</li>
                    <li><strong>Integral windup:</strong> I term keeps accumulating during saturation</li>
                    <li><strong>Nonlinear behavior:</strong> System behaves differently when saturated</li>
                </ul>

                <h3>In This Demo</h3>
                <p>The control output is clamped to ±100 units. When the error is very large, the controller "wants" to apply more force but is limited by this saturation.</p>

                <h3>Design Considerations</h3>
                <p>When designing a control system:</p>
                <ul>
                    <li>Size actuators appropriately for expected loads</li>
                    <li>Implement anti-windup to handle saturation gracefully</li>
                    <li>Consider saturation in performance expectations</li>
                </ul>
            `,
            relatedTerms: ['integral-windup', 'control-signal']
        },

        'sample-time': {
            title: 'Sample Time (Discrete Control)',
            category: 'Advanced',
            shortDesc: 'Why dt matters in digital controllers',
            content: `
                <p>Real-world controllers are digital: they read sensors and compute control outputs at discrete time intervals (the sample time, dt).</p>

                <h3>In This Demo</h3>
                <p>The simulation runs at 60 Hz, meaning dt = 0.0167 seconds. The PID controller updates 60 times per second.</p>

                <h3>Why Sample Time Matters</h3>
                <ul>
                    <li><strong>Integral term:</strong> Accumulates as ∫e(t)dt ≈ Σe×dt (sum depends on dt)</li>
                    <li><strong>Derivative term:</strong> Calculated as Δe/dt (difference depends on dt)</li>
                    <li><strong>Stability:</strong> Too slow sampling can miss fast dynamics</li>
                </ul>

                <h3>Rule of Thumb</h3>
                <p>Sample at least 10× faster than the system's natural response time. For this cart demo, the system settles in a few seconds, so 60 Hz is more than adequate.</p>

                <h3>Practical Considerations</h3>
                <ul>
                    <li>Faster sampling → more CPU load</li>
                    <li>Sensor noise can be problematic with very fast sampling (especially for D term)</li>
                    <li>Gains tuned for one sample time won't work exactly at a different rate</li>
                </ul>
            `,
            relatedTerms: ['integral', 'derivative']
        }
    }
};

/**
 * Get all content items for a category
 * @param {string} category - 'concepts', 'terms', or 'advanced'
 * @returns {object} - Object with content items
 */
export function getCategoryContent(category) {
    return EDUCATIONAL_CONTENT[category] || {};
}

/**
 * Get a specific content item by term ID
 * @param {string} termId - ID of the term
 * @returns {object|null} - Content object or null if not found
 */
export function getContent(termId) {
    for (const category of Object.values(EDUCATIONAL_CONTENT)) {
        if (category[termId]) {
            return category[termId];
        }
    }
    return null;
}
