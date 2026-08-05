import React from 'react';
import { Timer, TimerMode } from '../components/Timer';
import { TaskList } from '../components/TaskList';
import { SettingsDialog } from '../components/SettingsDialog';
import { useSettings } from '../hooks/use-settings';
import { useTasks } from '../hooks/use-tasks';
import { useStats } from '../hooks/use-stats';
import { useTheme } from '../components/theme-provider';
import { Moon, Sun, Flame } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export default function Home() {
  const { settings, updateSettings } = useSettings();
  const {
    tasks,
    activeTaskId,
    setActiveTaskId,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    incrementPomodoro,
    clearCompleted,
    activeTask
  } = useTasks();
  const { stats, addSession, getTodayStats } = useStats();
  const { theme, setTheme } = useTheme();

  const handleSessionComplete = (mode: TimerMode, durationMinutes: number) => {
    addSession(durationMinutes);
    if (mode === 'work' && activeTaskId) {
      incrementPomodoro(activeTaskId);
    }
  };

  const todayStats = getTodayStats();

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background text-foreground selection:bg-primary/20">
      <header className="w-full max-w-5xl mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-primary">
          <Flame className="w-6 h-6" />
          <span className="font-serif text-xl font-medium tracking-wide">Focus</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <SettingsDialog settings={settings} updateSettings={updateSettings} />
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row p-6 gap-12 lg:gap-24 items-center lg:items-start justify-center mt-4 lg:mt-12">
        {/* Left Column: Timer */}
        <section className="flex flex-col items-center w-full lg:w-1/2 max-w-md">
          {activeTask ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Working on
              </div>
              <div className="text-xl font-serif text-foreground truncate max-w-[300px]">
                {activeTask.title}
              </div>
            </motion.div>
          ) : (
            <div className="mb-8 h-[60px]" /> // Placeholder to prevent jump
          )}

          <Timer settings={settings} onSessionComplete={handleSessionComplete} />

          {/* Stats area */}
          <div className="mt-12 flex space-x-8 text-center text-sm border-t border-border/50 pt-8 w-full justify-center">
            <div>
              <div className="text-2xl font-serif text-foreground mb-1">
                {todayStats.sessionsCompleted}
              </div>
              <div className="text-muted-foreground uppercase tracking-wider text-xs font-medium">
                Sessions
              </div>
            </div>
            <div className="w-px h-12 bg-border/50" />
            <div>
              <div className="text-2xl font-serif text-foreground mb-1">
                {Math.round(todayStats.focusTimeMinutes / 60 * 10) / 10}
                <span className="text-base text-muted-foreground ml-1 font-sans">h</span>
              </div>
              <div className="text-muted-foreground uppercase tracking-wider text-xs font-medium">
                Focus Time
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Tasks */}
        <section className="w-full lg:w-1/2 max-w-md lg:pt-16">
          <TaskList
            tasks={tasks}
            activeTaskId={activeTaskId}
            setActiveTaskId={setActiveTaskId}
            addTask={addTask}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
            clearCompleted={clearCompleted}
          />
        </section>
      </main>
    </div>
  );
}
