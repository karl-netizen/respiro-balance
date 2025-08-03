import { useState, useEffect, useCallback } from 'react';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  
  interface DeviceOrientationEvent {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  }
}

interface VoiceCommand {
  command: string;
  action: () => void;
  phrases: string[];
}

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export const useMobileFeatures = () => {
  const { isMobile, touchCapable } = useDeviceDetection();
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [deviceMotion, setDeviceMotion] = useState({ x: 0, y: 0, z: 0 });
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    // Check feature support
    setVoiceSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    setWakeLockSupported('wakeLock' in navigator);

    // Setup device motion listener for gesture controls
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        setDeviceMotion({
          x: event.accelerationIncludingGravity.x || 0,
          y: event.accelerationIncludingGravity.y || 0,
          z: event.accelerationIncludingGravity.z || 0
        });
      }
    };

    if (isMobile && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      }
    };
  }, [isMobile]);

  // Voice Commands
  const startVoiceListening = useCallback((commands: VoiceCommand[]) => {
    if (!voiceSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log('Voice command:', transcript);

      // Find matching command
      const matchedCommand = commands.find(cmd => 
        cmd.phrases.some(phrase => transcript.includes(phrase.toLowerCase()))
      );

      if (matchedCommand) {
        matchedCommand.action();
        console.log('Executed command:', matchedCommand.command);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    return recognition;
  }, [voiceSupported]);

  // Location Services
  const getCurrentLocation = useCallback((): Promise<GeolocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(locationData);
          resolve(locationData);
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        }
      );
    });
  }, []);

  // Wake Lock for meditation sessions
  const requestWakeLock = useCallback(async () => {
    if (!wakeLockSupported) return null;

    try {
      const wakeLockObj = await navigator.wakeLock.request('screen');
      setWakeLock(wakeLockObj);
      console.log('Wake lock acquired');
      return wakeLockObj;
    } catch (error) {
      console.error('Wake lock failed:', error);
      return null;
    }
  }, [wakeLockSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
      console.log('Wake lock released');
    }
  }, [wakeLock]);

  // Haptic Feedback
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate(pattern);
    }
  }, [isMobile]);

  // Camera Access
  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }
      });
      return stream;
    } catch (error) {
      console.error('Camera access failed:', error);
      throw error;
    }
  }, []);

  // Device Orientation
  const requestOrientationPermission = useCallback(async () => {
    if ('DeviceOrientationEvent' in window && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Orientation permission failed:', error);
        return false;
      }
    }
    return true; // Assume granted on non-iOS devices
  }, []);

  // Share API
  const shareContent = useCallback(async (data: { title: string; text: string; url?: string }) => {
    if ('share' in navigator && isMobile) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Share failed:', error);
        return false;
      }
    }
    return false;
  }, [isMobile]);

  return {
    // Feature detection
    isMobile,
    touchCapable,
    voiceSupported,
    wakeLockSupported,
    
    // Voice commands
    isListening,
    startVoiceListening,
    
    // Location
    location,
    getCurrentLocation,
    
    // Motion data
    deviceMotion,
    
    // Wake lock
    wakeLock,
    requestWakeLock,
    releaseWakeLock,
    
    // Other features
    vibrate,
    requestCamera,
    requestOrientationPermission,
    shareContent
  };
};
