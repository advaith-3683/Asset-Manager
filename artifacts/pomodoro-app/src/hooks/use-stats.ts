import { useLocalStorage } from './use-local-storage';

export type DailyStats = {
  date: string; // YYYY-MM-DD
  sessionsCompleted: number;
  focusTimeMinutes: number;
};

export function useStats() {
  const [stats, setStats] = useLocalStorage<Record<string, DailyStats>>('pomodoro-stats', {});

  const getTodayStr = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const addSession = (durationMinutes: number) => {
    const today = getTodayStr();
    setStats((prev) => {
      const todayStats = prev[today] || { date: today, sessionsCompleted: 0, focusTimeMinutes: 0 };
      return {
        ...prev,
        [today]: {
          ...todayStats,
          sessionsCompleted: todayStats.sessionsCompleted + 1,
          focusTimeMinutes: todayStats.focusTimeMinutes + durationMinutes,
        },
      };
    });
  };

  const getTodayStats = () => {
    const today = getTodayStr();
    return stats[today] || { date: today, sessionsCompleted: 0, focusTimeMinutes: 0 };
  };

  return { stats, addSession, getTodayStats };
}
