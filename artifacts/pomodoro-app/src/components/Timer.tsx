import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings } from '../hooks/use-settings';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { playBeep, showNotification } from '../lib/audio';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerProps {
  settings: Settings;
  onSessionComplete: (mode: TimerMode, durationMinutes: number) => void;
}

export function Timer({ settings, onSessionComplete }: TimerProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const getDurationSecs = (m: TimerMode) => {
    if (m === 'work') return settings.workDuration * 60;
    if (m === 'shortBreak') return settings.shortBreakDuration * 60;
    return settings.longBreakDuration * 60;
  };

  // Sync timer when settings change, if not running and full time
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getDurationSecs(mode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playBeep();
      
      const durationCompleted = getDurationSecs(mode) / 60;
      onSessionComplete(mode, durationCompleted);

      if (mode === 'work') {
        const newCount = sessionCount + 1;
        setSessionCount(newCount);
        const nextMode = newCount % settings.pomodorosUntilLongBreak === 0 ? 'longBreak' : 'shortBreak';
        showNotification('Focus session complete!', 'Time for a break.');
        switchMode(nextMode);
      } else {
        showNotification('Break is over!', 'Ready to focus?');
        switchMode('work');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, sessionCount, settings, onSessionComplete]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(getDurationSecs(newMode));
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = getDurationSecs(mode);
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 bg-muted/50 p-1.5 rounded-full mb-10 border shadow-sm">
        {(['work', 'shortBreak', 'longBreak'] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === m
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center mb-10">
        <svg className="w-[320px] h-[320px] transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r={radius}
            className="stroke-muted/30 fill-none"
            strokeWidth="12"
          />
          <motion.circle
            cx="160"
            cy="160"
            r={radius}
            className="stroke-primary fill-none drop-shadow-md"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'linear' }}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="font-serif text-7xl font-light tracking-tight text-foreground"
            animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            {formatTime(timeLeft)}
          </motion.div>
          <div className="mt-2 text-sm text-muted-foreground font-medium uppercase tracking-widest">
            {mode === 'work' ? 'Stay Focused' : 'Relax'}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full shadow-sm text-muted-foreground hover:text-foreground"
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(getDurationSecs(mode));
          }}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={`w-20 h-20 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center ${
            isRunning ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-border' : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isRunning ? <Pause className="w-8 h-8 ml-0.5" /> : <Play className="w-8 h-8 ml-1.5" />}
        </Button>

        <div className="w-12 h-12" /> {/* Spacer to balance the layout */}
      </div>
    </div>
  );
}
