
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Star, CheckCircle } from 'lucide-react';
import { Expert } from '@/types/experts';
import { toast } from 'sonner';

interface SessionBookingProps {
  expert: Expert;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (bookingDetails: any) => void;
}

const SessionBooking: React.FC<SessionBookingProps> = ({
  expert,
  isOpen,
  onClose,
  onBookingComplete
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('60');
  const [sessionType, setSessionType] = useState<string>('general');
  const [notes, setNotes] = useState<string>('');
  const [step, setStep] = useState<'datetime' | 'details' | 'confirmation'>('datetime');
  const [isBooking, setIsBooking] = useState(false);

  // Mock available time slots
  const availableSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const sessionTypes = [
    { value: 'general', label: 'General Consultation' },
    { value: 'stress', label: 'Stress Management' },
    { value: 'anxiety', label: 'Anxiety Relief' },
    { value: 'sleep', label: 'Sleep Optimization' },
    { value: 'performance', label: 'Performance Enhancement' }
  ];

  const handleDateTimeNext = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }
    setStep('details');
  };

  const handleBooking = async () => {
    setIsBooking(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingDetails = {
        expert,
        date: selectedDate,
        time: selectedTime,
        duration: parseInt(duration),
        sessionType,
        notes,
        meetingUrl: 'https://meet.respirobalance.com/session-123',
        sessionId: 'session-123'
      };
      
      setStep('confirmation');
      onBookingComplete(bookingDetails);
      
      toast.success('Session booked successfully!', {
        description: 'You will receive a confirmation email shortly.'
      });
    } catch (error) {
      toast.error('Booking failed', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsBooking(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime('');
    setDuration('60');
    setSessionType('general');
    setNotes('');
    setStep('datetime');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={expert.avatar_url} alt={expert.name} />
              <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <span>Book Session with {expert.name}</span>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground font-normal">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{expert.rating}</span>
                <span>•</span>
                <span>${expert.hourly_rate}/hour</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'datetime' ? 'text-blue-600' : step === 'details' || step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'datetime' ? 'bg-blue-100' : step === 'details' || step === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {step === 'details' || step === 'confirmation' ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-sm font-medium">Date & Time</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'details' ? 'text-blue-600' : step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'details' ? 'bg-blue-100' : step === 'confirmation' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {step === 'confirmation' ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-sm font-medium">Details</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'confirmation' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>

          {/* Step Content */}
          {step === 'datetime' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date(Date.now() - 86400000)}
                  className="rounded-md border"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">Available Times</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(slot)}
                        className="justify-center"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-medium mb-2 block">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block">Session Type</Label>
                <Select value={sessionType} onValueChange={setSessionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-2 block">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any specific goals, concerns, or questions you'd like to discuss..."
                  rows={4}
                />
              </div>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Video className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Video Session Details</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your session will be conducted via secure video call. You'll receive a meeting link 
                        15 minutes before your scheduled time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Session Booked Successfully!</h3>
              <p className="text-muted-foreground">
                Your session with {expert.name} has been confirmed for{' '}
                {selectedDate?.toLocaleDateString()} at {selectedTime}.
              </p>
              
              <Card className="text-left">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Expert:</span>
                    <span className="text-sm font-medium">{expert.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date & Time:</span>
                    <span className="text-sm font-medium">
                      {selectedDate?.toLocaleDateString()} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="text-sm font-medium">{duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Session Type:</span>
                    <span className="text-sm font-medium">
                      {sessionTypes.find(t => t.value === sessionType)?.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <p className="text-sm text-muted-foreground">
                You will receive confirmation and reminder emails. The meeting link will be sent 15 minutes before your session.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            {step === 'datetime' && (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleDateTimeNext}>
                  Next
                </Button>
              </>
            )}
            
            {step === 'details' && (
              <>
                <Button variant="outline" onClick={() => setStep('datetime')}>
                  Back
                </Button>
                <Button onClick={handleBooking} disabled={isBooking}>
                  {isBooking ? 'Booking...' : `Book Session - $${(expert.hourly_rate * parseInt(duration) / 60).toFixed(0)}`}
                </Button>
              </>
            )}
            
            {step === 'confirmation' && (
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionBooking;
