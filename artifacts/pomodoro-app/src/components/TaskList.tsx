import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../hooks/use-tasks';
import { Check, Plus, Trash2, Minus, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  setActiveTaskId: (id: string) => void;
  addTask: (title: string, est: number) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  clearCompleted: () => void;
}

export function TaskList({
  tasks,
  activeTaskId,
  setActiveTaskId,
  addTask,
  toggleTask,
  deleteTask,
  updateTask,
  clearCompleted,
}: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskEst, setNewTaskEst] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), newTaskEst);
    setNewTaskTitle('');
    setNewTaskEst(1);
    setIsAdding(false);
  };

  const hasCompleted = tasks.some((t) => t.completed);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/50">
        <h2 className="text-xl font-serif text-foreground">Tasks</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsAdding(!isAdding)} className="rounded-full">
          <Plus className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="mb-6 bg-card p-4 rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <Input
              autoFocus
              placeholder="What are you working on?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="mb-4 bg-background/50 border-border"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-muted-foreground font-medium">Est. Pomodoros</span>
                <div className="flex items-center space-x-2 bg-background rounded-md border p-1">
                  <button
                    type="button"
                    onClick={() => setNewTaskEst(Math.max(1, newTaskEst - 1))}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-4 text-center font-medium">{newTaskEst}</span>
                  <button
                    type="button"
                    onClick={() => setNewTaskEst(newTaskEst + 1)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Save
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 && !isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 px-4 text-muted-foreground"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="font-medium text-foreground">No tasks yet</p>
              <p className="text-sm mt-1">Add a task to start focusing.</p>
            </motion.div>
          )}

          {tasks.map((task) => {
            const isActive = activeTaskId === task.id;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={task.id}
                className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-primary/5 border-primary shadow-sm'
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-sm'
                } ${task.completed ? 'opacity-60 grayscale-[0.5]' : ''}`}
                onClick={() => !task.completed && setActiveTaskId(task.id)}
              >
                {isActive && !task.completed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
                
                <div className="flex items-center space-x-4 flex-1 overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground/30 hover:border-primary text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  
                  <span className={`flex-1 truncate font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center space-x-4 pl-4 shrink-0">
                  <div className="text-sm font-mono tracking-tighter text-muted-foreground">
                    <span className={task.completedPomodoros >= task.estimatedPomodoros ? 'text-primary' : ''}>
                      {task.completedPomodoros}
                    </span>
                    <span className="opacity-50">/{task.estimatedPomodoros}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {hasCompleted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
          <Button variant="ghost" onClick={clearCompleted} className="text-sm text-muted-foreground">
            Clear completed tasks
          </Button>
        </motion.div>
      )}
    </div>
  );
}
