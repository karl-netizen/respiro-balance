
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserPreferences } from '@/context';
import { MorningRitual } from '@/context/types';
import { ritualFormSchema, RitualFormValues, RitualReminder } from '../types';
import { toast } from 'sonner';

export const useRitualForm = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RitualFormValues>({
    resolver: zodResolver(ritualFormSchema),
    defaultValues: {
      title: '',
      description: '',
      timeOfDay: '08:00',
      duration: 15,
      priority: 'medium',
      recurrence: 'daily',
      tags: [],
      daysOfWeek: [],
      reminders: []
    }
  });

  const onSubmit = async (data: RitualFormValues) => {
    try {
      const reminders: RitualReminder[] = data.reminders.map(r => ({
        enabled: r.enabled ?? true,
        time: r.time ?? 15,
        message: r.message
      }));

      const newRitual: MorningRitual = {
        id: `ritual_${Date.now()}`,
        user_id: '',
        title: data.title,
        description: data.description || '',
        timeOfDay: data.timeOfDay,
        start_time: data.timeOfDay,
        duration: data.duration,
        priority: data.priority,
        recurrence: data.recurrence,
        days_of_week: data.daysOfWeek,
        daysOfWeek: data.daysOfWeek,
        reminder_enabled: reminders.length > 0,
        reminder_time: reminders[0]?.time || 10,
        reminders: reminders,
        tags: data.tags,
        status: 'planned',
        complete: false,
        streak: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date()
      };

      const updatedRituals = [...(preferences.morningRituals || []), newRitual];
      await updatePreferences({ morningRituals: updatedRituals });

      setSubmitted(true);
      form.reset();
      
      toast.success('Ritual created successfully!');
    } catch (error) {
      toast.error('Failed to create ritual');
    }
  };

  return {
    form,
    submitted,
    setSubmitted,
    onSubmit
  };
};
