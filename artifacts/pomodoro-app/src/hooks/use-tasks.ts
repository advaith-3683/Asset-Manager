import { useLocalStorage } from './use-local-storage';

export type Task = {
  id: string;
  title: string;
  completedPomodoros: number;
  estimatedPomodoros: number;
  completed: boolean;
  createdAt: number;
};

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('pomodoro-tasks', []);
  const [activeTaskId, setActiveTaskId] = useLocalStorage<string | null>('pomodoro-active-task', null);

  const addTask = (title: string, estimatedPomodoros: number = 1) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completedPomodoros: 0,
      estimatedPomodoros,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    if (!activeTaskId) {
      setActiveTaskId(newTask.id);
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const incrementPomodoro = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
          : task
      )
    );
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  return {
    tasks,
    activeTaskId,
    setActiveTaskId,
    activeTask,
    addTask,
    updateTask,
    incrementPomodoro,
    toggleTask,
    deleteTask,
    clearCompleted,
  };
}
