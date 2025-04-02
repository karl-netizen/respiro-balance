
import { useState } from 'react';
import { RitualFormData, RecurrenceType, RitualPriority } from '@/components/morning-ritual/types';
import { generateId } from '@/components/morning-ritual/utils';

export const useRitualForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>('08:00');
  const [duration, setDuration] = useState<number>(15);
  const [priority, setPriority] = useState<RitualPriority>('medium');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('daily');
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<number>(15);
  const [tags, setTags] = useState<string[]>([]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate(new Date());
    setStartTime('08:00');
    setDuration(15);
    setPriority('medium');
    setRecurrence('daily');
    setReminderEnabled(true);
    setReminderTime(15);
    setTags([]);
  };
  
  const formValues: RitualFormData = {
    id: generateId(), // Use the imported generateId function
    title,
    description,
    date,
    startTime,
    duration,
    priority,
    recurrence,
    reminderEnabled,
    reminderTime,
    tags,
    complete: false,
    createdAt: new Date(),
  };
  
  return {
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    startTime,
    setStartTime,
    duration,
    setDuration,
    priority,
    setPriority,
    recurrence,
    setRecurrence,
    reminderEnabled,
    setReminderEnabled,
    reminderTime,
    setReminderTime,
    tags,
    setTags,
    formValues,
    resetForm,
  };
};
