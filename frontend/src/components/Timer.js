import React, { useState, useEffect, useRef } from 'react';
import '../styles/Timer.css';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeIn, scaleIn } from '../utils/animations';

const Timer = () => {
    // Constants
    const FOCUS_TIME = 30 * 60; // 30 minutes in seconds
    const BREAK_TIME = 5 * 60;  // 5 minutes in seconds

    // State
    const [mode, setMode] = useState('focus'); // 'focus' or 'break'
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [autoBreak, setAutoBreak] = useState(true);

    const intervalRef = useRef(null);

    // Circle Progress Calculation
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / (mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    const dashOffset = circumference - (progress * circumference);

    // Timer Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        setIsActive(false);
        if (autoBreak && mode === 'focus') {
            switchMode('break');
            setIsActive(true); // Auto-start break
            new Audio('/notification.mp3').play().catch(() => { }); // Optional sound
        } else {
            setIsActive(false);
            new Audio('/notification.mp3').play().catch(() => { });
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-wrapper">
            <motion.div
                className="timer-container glass-panel"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                <div className="timer-header">
                    <h2>{mode === 'focus' ? 'Focus Time' : 'Break Time'}</h2>
                    <p>{mode === 'focus' ? 'Stay productive and focused.' : 'Take a short break and recharge.'}</p>
                </div>

                <div className="timer-circle">
                    <svg className="timer-svg" viewBox="0 0 300 300">
                        <circle
                            className="timer-circle-bg"
                            cx="150" cy="150" r={radius}
                        />
                        <motion.circle
                            className="timer-circle-progress"
                            cx="150" cy="150" r={radius}
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: dashOffset,
                                stroke: mode === 'focus' ? 'var(--primary-color)' : 'var(--secondary-color)'
                            }}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 1, ease: "linear" }}
                        />
                    </svg>
                    <div className="timer-display">
                        <motion.div
                            key={timeLeft}
                            initial={{ scale: 0.9, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="time-text"
                            style={{ color: mode === 'focus' ? 'var(--primary-color)' : 'var(--secondary-color)' }}
                        >
                            {formatTime(timeLeft)}
                        </motion.div>
                        <div className="status-text">{isActive ? 'Running' : 'Paused'}</div>
                    </div>
                </div>

                <div className="timer-controls">
                    <motion.button
                        className="control-btn"
                        onClick={() => switchMode(mode === 'focus' ? 'break' : 'focus')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Switch Mode"
                    >
                        {mode === 'focus' ? <Coffee size={24} /> : <Brain size={24} />}
                    </motion.button>

                    <motion.button
                        className="control-btn main-control"
                        onClick={toggleTimer}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ padding: '1.5rem', background: isActive ? 'var(--secondary-color)' : 'var(--primary-color)' }}
                    >
                        {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                    </motion.button>

                    <motion.button
                        className="control-btn"
                        onClick={resetTimer}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Reset"
                    >
                        <RotateCcw size={24} />
                    </motion.button>
                </div>

                <div className="timer-settings">
                    <span>Auto-start Break</span>
                    <div
                        className={`toggle-switch ${autoBreak ? 'on' : ''}`}
                        onClick={() => setAutoBreak(!autoBreak)}
                    >
                        <div className="toggle-thumb" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Timer;
