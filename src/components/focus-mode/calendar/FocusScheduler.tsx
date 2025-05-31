
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock, Plus, Target, AlertTriangle } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

interface ScheduledSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  duration: number;
  type: 'focus' | 'prep' | 'break';
  status: 'scheduled' | 'completed' | 'missed';
  calendarEventId?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  conflictReason?: string;
}

export const FocusScheduler: React.FC = () => {
  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedDuration, setSelectedDuration] = useState('25');

  useEffect(() => {
    loadScheduledSessions();
    loadAvailableSlots();
  }, [selectedDate]);

  const loadScheduledSessions = () => {
    // Mock data for demo
    const mockSessions: ScheduledSession[] = [
      {
        id: '1',
        title: 'Deep Work Session',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        duration: 25,
        type: 'focus',
        status: 'scheduled'
      },
      {
        id: '2',
        title: 'Meeting Preparation',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '14:00',
        duration: 15,
        type: 'prep',
        status: 'completed'
      },
      {
        id: '3',
        title: 'Project Focus',
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        startTime: '10:30',
        duration: 50,
        type: 'focus',
        status: 'scheduled'
      }
    ];
    setScheduledSessions(mockSessions);
  };

  const loadAvailableSlots = () => {
    // Mock available time slots
    const slots: TimeSlot[] = [
      { time: '08:00', available: true },
      { time: '09:00', available: false, conflictReason: 'Scheduled focus session' },
      { time: '10:00', available: true },
      { time: '11:00', available: false, conflictReason: 'Team meeting' },
      { time: '13:00', available: true },
      { time: '14:00', available: false, conflictReason: 'Meeting prep' },
      { time: '15:00', available: true },
      { time: '16:00', available: true }
    ];
    setAvailableSlots(slots);
  };

  const handleScheduleSession = (timeSlot: string) => {
    const newSession: ScheduledSession = {
      id: Date.now().toString(),
      title: `Focus Session`,
      date: selectedDate,
      startTime: timeSlot,
      duration: parseInt(selectedDuration),
      type: 'focus',
      status: 'scheduled'
    };

    setScheduledSessions(prev => [...prev, newSession]);
    setAvailableSlots(prev => prev.map(slot => 
      slot.time === timeSlot 
        ? { ...slot, available: false, conflictReason: 'Scheduled focus session' }
        : slot
    ));
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'focus': return <Target className="h-4 w-4" />;
      case 'prep': return <Clock className="h-4 w-4" />;
      case 'break': return <CalendarDays className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const todaysSessions = scheduledSessions.filter(session => session.date === selectedDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Focus Scheduler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date and Duration Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Duration</label>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="25">25 minutes</SelectItem>
                <SelectItem value="50">50 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Available Time Slots</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map((slot) => (
              <div key={slot.time} className="relative">
                <Button
                  variant={slot.available ? "outline" : "secondary"}
                  disabled={!slot.available}
                  onClick={() => slot.available && handleScheduleSession(slot.time)}
                  className="w-full justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {slot.time}
                  {slot.available && <Plus className="h-4 w-4 ml-auto" />}
                </Button>
                {!slot.available && slot.conflictReason && (
                  <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-gray-800 text-white text-xs rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {slot.conflictReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Sessions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Scheduled Sessions</h3>
          {todaysSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions scheduled for this date.</p>
          ) : (
            <div className="space-y-2">
              {todaysSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getSessionTypeIcon(session.type)}
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.startTime} • {session.duration} min
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Smart Suggestions */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-900">Smart Scheduling Tip</p>
              <p className="text-amber-700">
                Based on your patterns, 9-11 AM is your most productive time. Consider scheduling important focus sessions then.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <CalendarDays className="h-4 w-4 mr-2" />
            View Week
          </Button>
          <Button variant="outline" className="flex-1">
            <Target className="h-4 w-4 mr-2" />
            Auto Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
