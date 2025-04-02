
import { useState, useEffect } from 'react';
import { MorningRitual, RitualReminder } from '@/context/types';
import { generateId } from '@/components/morning-ritual/utils';

export const useRitualForm = (initialRitual?: Partial<MorningRitual>) => {
  // Default values
  const [title, setTitle] = useState(initialRitual?.title || '');
  const [description, setDescription] = useState(initialRitual?.description || '');
  const [timeOfDay, setTimeOfDay] = useState(initialRitual?.timeOfDay || '07:00');
  const [duration, setDuration] = useState(initialRitual?.duration || 15);
  const [recurrence, setRecurrence] = useState(initialRitual?.recurrence || 'daily');
  const [daysOfWeek, setDaysOfWeek] = useState(initialRitual?.daysOfWeek || []);
  const [priority, setPriority] = useState(initialRitual?.priority || 'medium');
  const [tags, setTags] = useState(initialRitual?.tags || []);
  const [reminders, setReminders] = useState<RitualReminder[]>(
    initialRitual?.reminders || [
      { id: generateId(), enabled: true, type: 'in-app', time: '15' },
    ]
  );

  // Error states
  const [errors, setErrors] = useState({
    title: '',
    timeOfDay: '',
  });

  // Handle form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      timeOfDay: '',
    };

    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    // Validate time of day
    if (!timeOfDay) {
      newErrors.timeOfDay = 'Time is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle reminder changes
  const handleAddReminder = () => {
    setReminders([
      ...reminders,
      { id: generateId(), enabled: true, type: 'in-app', time: '15' },
    ]);
  };

  const handleRemoveReminder = (index: number) => {
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    setReminders(newReminders);
  };

  const handleReminderChange = (index: number, field: keyof RitualReminder, value: any) => {
    const newReminders = [...reminders];
    newReminders[index] = { ...newReminders[index], [field]: value };
    setReminders(newReminders);
  };

  // Get form data
  const getFormData = (): Partial<MorningRitual> => {
    return {
      title,
      description,
      timeOfDay,
      duration,
      recurrence,
      daysOfWeek: recurrence === 'custom' ? daysOfWeek : [],
      priority,
      tags,
      reminders,
    };
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTimeOfDay('07:00');
    setDuration(15);
    setRecurrence('daily');
    setDaysOfWeek([]);
    setPriority('medium');
    setTags([]);
    setReminders([
      { id: generateId(), enabled: true, type: 'in-app', time: '15' },
    ]);
    setErrors({ title: '', timeOfDay: '' });
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    timeOfDay,
    setTimeOfDay,
    duration,
    setDuration,
    recurrence,
    setRecurrence,
    daysOfWeek,
    setDaysOfWeek,
    priority,
    setPriority,
    tags,
    setTags,
    reminders,
    setReminders,
    errors,
    handleAddReminder,
    handleRemoveReminder,
    handleReminderChange,
    validateForm,
    getFormData,
    resetForm,
  };
};
