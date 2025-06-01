
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';
import { useCalendarIntegration } from '@/hooks/focus/useCalendarIntegration';

export const FocusScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [duration, setDuration] = useState('25');
  const [title, setTitle] = useState('Focus Session');
  
  const { scheduleFocusSession, findAvailableSlots } = useCalendarIntegration();

  const handleSchedule = async () => {
    if (!selectedDate) return;

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const sessionDateTime = new Date(selectedDate);
    sessionDateTime.setHours(hours, minutes, 0, 0);

    const sessionId = await scheduleFocusSession(title, sessionDateTime, parseInt(duration));
    
    if (sessionId) {
      console.log('Focus session scheduled successfully');
      // Reset form
      setTitle('Focus Session');
      setSelectedTime('09:00');
      setDuration('25');
    }
  };

  const availableSlots = selectedDate ? findAvailableSlots(selectedDate, parseInt(duration)) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Schedule Focus Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Session Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Focus Session"
          />
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return (
                    <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                      {hour}:00
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (min)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="25">25 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Available Slots */}
        {selectedDate && availableSlots.length > 0 && (
          <div className="space-y-2">
            <Label>Suggested Times</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.slice(0, 6).map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const timeStr = `${slot.getHours().toString().padStart(2, '0')}:${slot.getMinutes().toString().padStart(2, '0')}`;
                    setSelectedTime(timeStr);
                  }}
                  className="text-xs"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {slot.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Button */}
        <Button 
          onClick={handleSchedule} 
          className="w-full"
          disabled={!selectedDate}
        >
          Schedule Focus Session
        </Button>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Label>Quick Schedule</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const now = new Date();
                now.setMinutes(now.getMinutes() + 5);
                setSelectedDate(now);
                setSelectedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
              }}
            >
              In 5 minutes
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(9, 0, 0, 0);
                setSelectedDate(tomorrow);
                setSelectedTime('09:00');
              }}
            >
              Tomorrow 9 AM
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
