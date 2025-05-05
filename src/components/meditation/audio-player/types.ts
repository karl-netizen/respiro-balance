
export interface MeditationAudioPlayerProps {
  audioUrl: string;
  onComplete?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  autoPlay?: boolean;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}
