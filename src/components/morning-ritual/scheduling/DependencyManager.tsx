
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MorningRitual } from '@/context/types';
import { ArrowRight, Plus, X, Link, AlertCircle } from 'lucide-react';

interface RitualDependency {
  id: string;
  parentId: string;
  childId: string;
  type: 'sequential' | 'conditional' | 'trigger';
  delay?: number; // minutes
  condition?: string;
}

interface DependencyManagerProps {
  rituals: MorningRitual[];
  dependencies: RitualDependency[];
  onDependencyAdd: (dependency: RitualDependency) => void;
  onDependencyRemove: (dependencyId: string) => void;
}

const DependencyManager: React.FC<DependencyManagerProps> = ({
  rituals,
  dependencies,
  onDependencyAdd,
  onDependencyRemove
}) => {
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [dependencyType, setDependencyType] = useState<'sequential' | 'conditional' | 'trigger'>('sequential');
  const [delay, setDelay] = useState<number>(0);

  const handleAddDependency = () => {
    if (!selectedParent || !selectedChild) return;
    
    const newDependency: RitualDependency = {
      id: `dep_${Date.now()}`,
      parentId: selectedParent,
      childId: selectedChild,
      type: dependencyType,
      delay: dependencyType === 'sequential' ? delay : undefined
    };
    
    onDependencyAdd(newDependency);
    
    // Reset form
    setSelectedParent('');
    setSelectedChild('');
    setDelay(0);
  };

  const getRitualName = (ritualId: string) => {
    return rituals.find(r => r.id === ritualId)?.title || 'Unknown Ritual';
  };

  const getAvailableChildren = () => {
    if (!selectedParent) return rituals;
    
    // Exclude the selected parent and any rituals that would create circular dependencies
    return rituals.filter(r => {
      if (r.id === selectedParent) return false;
      
      // Check for circular dependencies
      const wouldCreateCircle = checkCircularDependency(r.id, selectedParent, dependencies);
      return !wouldCreateCircle;
    });
  };

  const checkCircularDependency = (startId: string, targetId: string, deps: RitualDependency[]): boolean => {
    const visited = new Set<string>();
    const stack = [startId];
    
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      
      if (currentId === targetId) return true;
      if (visited.has(currentId)) continue;
      
      visited.add(currentId);
      
      const childDeps = deps.filter(d => d.parentId === currentId);
      childDeps.forEach(dep => stack.push(dep.childId));
    }
    
    return false;
  };

  const getDependencyChains = () => {
    const chains: string[][] = [];
    const visited = new Set<string>();
    
    rituals.forEach(ritual => {
      if (visited.has(ritual.id)) return;
      
      const chain = buildChain(ritual.id, dependencies, visited);
      if (chain.length > 1) {
        chains.push(chain);
      }
    });
    
    return chains;
  };

  const buildChain = (startId: string, deps: RitualDependency[], visited: Set<string>): string[] => {
    const chain = [startId];
    visited.add(startId);
    
    const childDep = deps.find(d => d.parentId === startId);
    if (childDep && !visited.has(childDep.childId)) {
      chain.push(...buildChain(childDep.childId, deps, visited));
    }
    
    return chain;
  };

  const dependencyChains = getDependencyChains();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Ritual Dependencies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Parent Ritual</label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ritual that triggers..." />
                </SelectTrigger>
                <SelectContent>
                  {rituals.map(ritual => (
                    <SelectItem key={ritual.id} value={ritual.id}>
                      {ritual.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Child Ritual</label>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ritual to be triggered..." />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableChildren().map(ritual => (
                    <SelectItem key={ritual.id} value={ritual.id}>
                      {ritual.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dependency Type</label>
              <Select value={dependencyType} onValueChange={(value: any) => setDependencyType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential (one after another)</SelectItem>
                  <SelectItem value="conditional">Conditional (only if completed)</SelectItem>
                  <SelectItem value="trigger">Trigger (starts automatically)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {dependencyType === 'sequential' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Delay (minutes)</label>
                <Select value={delay.toString()} onValueChange={(value) => setDelay(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Immediate</SelectItem>
                    <SelectItem value="2">2 minutes</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleAddDependency}
            disabled={!selectedParent || !selectedChild}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Dependency
          </Button>
        </CardContent>
      </Card>
      
      {dependencies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dependencies.map(dep => (
                <div key={dep.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{getRitualName(dep.parentId)}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{getRitualName(dep.childId)}</span>
                    <Badge variant="outline">{dep.type}</Badge>
                    {dep.delay && dep.delay > 0 && (
                      <Badge variant="secondary">{dep.delay}min delay</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDependencyRemove(dep.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {dependencyChains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ritual Chains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dependencyChains.map((chain, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  {chain.map((ritualId, chainIndex) => (
                    <React.Fragment key={ritualId}>
                      <span className="px-3 py-1 bg-white rounded-md text-sm font-medium">
                        {getRitualName(ritualId)}
                      </span>
                      {chainIndex < chain.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {dependencies.length > 3 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Having many dependencies can make your morning routine complex. Consider keeping it simple with 2-3 key ritual chains.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DependencyManager;
