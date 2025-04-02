
import { useState, useCallback } from 'react';
import { RitualFormData, RecurrenceType, RitualPriority, RitualFormValues } from '@/components/morning-ritual/types';
import { generateId } from '@/components/morning-ritual/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ritualFormSchema } from '@/components/morning-ritual/types';

export const useRitualForm = () => {
  // Form state management
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  // Create form using react-hook-form
  const form = useForm<RitualFormValues>({
    resolver: zodResolver(ritualFormSchema),
    defaultValues: {
      title: '',
      description: '',
      timeOfDay: '08:00',
      duration: 15,
      recurrence: 'daily',
      priority: 'medium',
      tags: [],
    },
  });
  
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
    setSelectedTags([]);
    form.reset();
  };
  
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);
  
  const onSubmit = (values: RitualFormValues) => {
    console.log('Form submitted:', values);
    // Here you would typically save the ritual data to your store/backend
    setSubmitted(true);
    
    // Reset form after a delay
    setTimeout(() => {
      resetForm();
      setSubmitted(false);
    }, 2000);
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
    // New properties expected by RitualForm.tsx
    form,
    selectedTags,
    submitted,
    setSubmitted,
    toggleTag,
    onSubmit,
  };
};
