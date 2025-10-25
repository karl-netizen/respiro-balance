import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Heart, HeartOff, CheckSquare, Square } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BatchFavoritesManagerProps {
  favoriteSessions: MeditationSession[];
  onRemoveFavorites: (sessionIds: string[]) => void;
  onToggleFavorite: (session: MeditationSession) => void;
  onSelectSession: (session: MeditationSession) => void;
}

const BatchFavoritesManager: React.FC<BatchFavoritesManagerProps> = ({
  favoriteSessions,
  onRemoveFavorites,
  onToggleFavorite,
  onSelectSession
}) => {
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedSessions(new Set());
  };

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const selectAllSessions = () => {
    if (selectedSessions.size === favoriteSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(favoriteSessions.map(s => s.id)));
    }
  };

  const handleBatchRemove = () => {
    if (selectedSessions.size > 0) {
      setShowDeleteDialog(true);
    }
  };

  const confirmBatchRemove = () => {
    onRemoveFavorites(Array.from(selectedSessions));
    setSelectedSessions(new Set());
    setIsSelectionMode(false);
    setShowDeleteDialog(false);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  if (favoriteSessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium mb-2">No Favorites Yet</h3>
          <p className="text-muted-foreground">
            Heart sessions you love to quickly find them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Batch Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={isSelectionMode ? "default" : "outline"}
            size="sm"
            onClick={toggleSelectionMode}
          >
            {isSelectionMode ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            {isSelectionMode ? "Exit Selection" : "Select Multiple"}
          </Button>

          {isSelectionMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllSessions}
              >
                {selectedSessions.size === favoriteSessions.length ? "Deselect All" : "Select All"}
              </Button>

              <AnimatePresence>
                {selectedSessions.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchRemove}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove ({selectedSessions.size})
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <Badge variant="secondary">
          {favoriteSessions.length} favorite{favoriteSessions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteSessions.map(session => (
          <motion.div
            key={session.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative ${isSelectionMode ? 'cursor-pointer' : ''}`}
          >
            <Card 
              className={`h-full transition-all duration-200 ${
                selectedSessions.has(session.id) 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:shadow-md'
              }`}
              onClick={isSelectionMode ? () => toggleSessionSelection(session.id) : undefined}
            >
              {/* Selection Checkbox */}
              {isSelectionMode && (
                <div className="absolute top-3 left-3 z-10">
                  <Checkbox
                    checked={selectedSessions.has(session.id)}
                    onCheckedChange={() => toggleSessionSelection(session.id)}
                    className="bg-background border-2"
                  />
                </div>
              )}

              {/* Favorite Heart */}
              {!isSelectionMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(session);
                  }}
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </Button>
              )}

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium line-clamp-2">{session.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session.instructor}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {session.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {session.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {formatDuration(session.duration)}
                      </Badge>
                    </div>

                    {session.level && (
                      <Badge variant="secondary" className="text-xs">
                        {session.level}
                      </Badge>
                    )}
                  </div>

                  {session.tags && session.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {session.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {session.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{session.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {!isSelectionMode && (
                    <Button
                      className="w-full mt-3"
                      onClick={() => onSelectSession(session)}
                    >
                      Start Session
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Favorites</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedSessions.size} session{selectedSessions.size !== 1 ? 's' : ''} from your favorites? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBatchRemove} className="bg-destructive text-destructive-foreground">
              Remove {selectedSessions.size} Session{selectedSessions.size !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BatchFavoritesManager;
