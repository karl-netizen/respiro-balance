
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MorningRitual, WorkDay } from '@/context/types';
import { ritualFormSchema, RitualFormValues } from '../types';

export const useRitualEditForm = (ritual: MorningRitual) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RitualFormValues>({
    resolver: zodResolver(ritualFormSchema),
    defaultValues: {
      title: ritual.title,
      description: ritual.description || '',
      timeOfDay: ritual.timeOfDay,
      duration: ritual.duration,
      priority: ritual.priority,
      recurrence: ritual.recurrence,
      tags: ritual.tags || [],
      daysOfWeek: ritual.daysOfWeek.map(day => day.toLowerCase()) as WorkDay[],
      reminders: ritual.reminders || []
    }
  });

  const handleSubmit = async (data: RitualFormValues) => {
    setIsSubmitting(true);
    try {
      // Handle form submission
      console.log('Updating ritual:', data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit
  };
};
