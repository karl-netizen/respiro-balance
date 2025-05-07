
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export const FocusHistory: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchSessionHistory();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchSessionHistory = async () => {
    try {
      // Using type assertion to fix Supabase typing issue
      const { data, error } = await supabase
        .from('focus_sessions' as any)
        .select('*')
        .eq('user_id', user?.id)
        .order('start_time', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching focus history:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-3">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }
  
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No focus sessions yet</p>
        <p className="text-sm mt-1">Your completed sessions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => (
        <SessionHistoryItem key={session.id} session={session} />
      ))}
    </div>
  );
};

const SessionHistoryItem: React.FC<{ session: any }> = ({ session }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="border rounded-md p-3 hover:bg-muted/30 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{formatDate(session.start_time)}</p>
            {session.completed ? (
              <Badge variant="default" className="bg-green-500">Completed</Badge>
            ) : (
              <Badge variant="outline">Incomplete</Badge>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground mt-1">
            {session.duration} min • {session.work_intervals} work intervals
          </div>
        </div>
        
        {typeof session.focus_score === 'number' && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Focus Score</div>
            <div className={`font-medium ${
              session.focus_score >= 80 ? 'text-green-500' :
              session.focus_score >= 60 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {session.focus_score}/100
            </div>
          </div>
        )}
      </div>
      
      {session.notes && (
        <div className="mt-2 text-sm border-t pt-2">
          <span className="text-muted-foreground">Notes:</span> {session.notes}
        </div>
      )}
    </div>
  );
};
