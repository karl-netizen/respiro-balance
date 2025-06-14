
import { useState, useCallback } from 'react';
import { RitualFormValues } from '@/components/morning-ritual/types';
import { generateId } from '@/components/morning-ritual/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ritualFormSchema } from '@/components/morning-ritual/types';

export const useRitualForm = () => {
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
      daysOfWeek: [],
      reminders: [],
    },
  });
  
  const resetForm = () => {
    setSelectedTags([]);
    form.reset();
  };
  
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      
      // Also update form tags
      form.setValue('tags', newTags);
      return newTags;
    });
  }, [form]);
  
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
  
  return {
    form,
    selectedTags,
    submitted,
    setSubmitted,
    toggleTag,
    onSubmit,
    resetForm,
  };
};
