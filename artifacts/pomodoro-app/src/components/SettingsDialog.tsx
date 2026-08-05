import React, { useState } from 'react';
import { Settings } from '../hooks/use-settings';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Settings as SettingsIcon } from 'lucide-react';

interface SettingsDialogProps {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

export function SettingsDialog({ settings, updateSettings }: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="work" className="col-span-3 text-sm font-medium">Focus duration (min)</label>
            <Input
              id="work"
              type="number"
              min={1}
              value={localSettings.workDuration}
              onChange={(e) => setLocalSettings({ ...localSettings, workDuration: Number(e.target.value) })}
              className="col-span-1 text-center"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="shortBreak" className="col-span-3 text-sm font-medium">Short break (min)</label>
            <Input
              id="shortBreak"
              type="number"
              min={1}
              value={localSettings.shortBreakDuration}
              onChange={(e) => setLocalSettings({ ...localSettings, shortBreakDuration: Number(e.target.value) })}
              className="col-span-1 text-center"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="longBreak" className="col-span-3 text-sm font-medium">Long break (min)</label>
            <Input
              id="longBreak"
              type="number"
              min={1}
              value={localSettings.longBreakDuration}
              onChange={(e) => setLocalSettings({ ...localSettings, longBreakDuration: Number(e.target.value) })}
              className="col-span-1 text-center"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="longBreakInterval" className="col-span-3 text-sm font-medium">Pomodoros until long break</label>
            <Input
              id="longBreakInterval"
              type="number"
              min={1}
              value={localSettings.pomodorosUntilLongBreak}
              onChange={(e) => setLocalSettings({ ...localSettings, pomodorosUntilLongBreak: Number(e.target.value) })}
              className="col-span-1 text-center"
            />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
