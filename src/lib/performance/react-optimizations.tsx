import React, { memo, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ExpensiveComponentProps {
  data: any[];
  onAction: (id: string | number) => void;
}

export const ExpensiveComponent = memo<ExpensiveComponentProps>(({ data, onAction }) => {
  const computedValues = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: item.value * Math.PI,
      category: item.value > 500 ? 'high' : 'low'
    }));
  }, [data]);

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {computedValues.slice(0, 10).map((item) => (
        <Card key={item.id} className="p-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Item {item.id}</div>
              <div className="text-sm text-muted-foreground">
                Value: {item.value.toFixed(2)} | Category: {item.category}
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => onAction(item.id)}>
              Action
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
});

ExpensiveComponent.displayName = 'ExpensiveComponent';

interface VirtualizedUserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

export const VirtualizedUserList = memo<VirtualizedUserListProps>(({ users, onUserSelect }) => {
  return (
    <div className="h-80 border rounded-lg overflow-y-auto">
      {users.slice(0, 50).map((user) => (
        <div key={user.id} className="p-2">
          <Card>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => onUserSelect(user)}>
                Select
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
});

VirtualizedUserList.displayName = 'VirtualizedUserList';

export const LazyChart: React.FC = () => (
  <div className="h-32 bg-muted rounded flex items-center justify-center">
    <p className="text-sm text-muted-foreground">Chart component loaded</p>
  </div>
);

export const LazyAnalytics: React.FC = () => (
  <div className="h-32 bg-muted rounded flex items-center justify-center">
    <p className="text-sm text-muted-foreground">Analytics component loaded</p>
  </div>
);