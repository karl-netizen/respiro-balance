// Replace your MeditationLibrary component with this version that includes audio playback
import React, { useState, useRef } from 'react';

// Mock meditation data for testing
const mockSessions = [
  {
    id: '1',
    title: 'Morning Mindfulness',
    duration: 10,
    category: 'mindfulness',
    description: 'Start your day with calm awareness',
    premium: false,
    audioUrl: 'test-audio.mp3'
  },
  {
    id: '2',
    title: 'Quick Stress Relief',
    duration: 5,
    category: 'stress relief', 
    description: 'Quick 5-minute break',
    premium: false,
    audioUrl: 'test-audio2.mp3'
  },
  {
    id: '3',
    title: 'Deep Focus Session',
    duration: 20,
    category: 'body scan',
    description: 'Deep concentration practice',
    premium: true,
    audioUrl: 'test-audio3.mp3'
  }
];

const MeditationLibrary = () => {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  console.log('🔥 MEDITATION LIBRARY WITH AUDIO PLAYER LOADED');

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      // Create a URL for the audio file so we can play it
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      console.log('✅ Audio file selected:', file.name);
      alert(`Audio file "${file.name}" selected successfully! You can now play it.`);
    } else {
      alert('Please select a valid audio file (.mp3, .wav, .m4a, etc.)');
    }
  };

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
    console.log('🎯 Session selected:', session);
  };

  const togglePlayPause = () => {
    if (!audioUrl) {
      alert('Please select an audio file first!');
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log('⏸️ Audio paused');
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        console.log('▶️ Audio playing');
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      console.log('⏹️ Audio stopped');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>🧘‍♀️ Meditation Library</h1>
        <p style={{ color: '#666' }}>Found {mockSessions.length} meditation sessions</p>
      </div>

      {/* Audio File Upload Section */}
      <div style={{ 
        background: '#f0f8ff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '2px dashed #007bff'
      }}>
        <h2 style={{ marginBottom: '15px' }}>📁 Upload & Play Your Audio File</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '15px',
            display: 'block'
          }}
        />
        
        {audioFile && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ color: '#28a745', marginBottom: '10px' }}>
              ✅ Selected: {audioFile.name} ({Math.round(audioFile.size / 1024)} KB)
            </div>
            
            {/* Audio Player Controls */}
            <div style={{ 
              background: '#fff', 
              padding: '15px', 
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>🎵 Audio Player</h3>
              
              {/* HTML5 Audio Element */}
              <audio 
                ref={audioRef}
                src={audioUrl || undefined}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                controls
                style={{ width: '100%', marginBottom: '10px' }}
              />
              
              {/* Custom Controls */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={togglePlayPause}
                  style={{
                    padding: '8px 15px',
                    background: isPlaying ? '#ffc107' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>
                
                <button 
                  onClick={stopAudio}
                  style={{
                    padding: '8px 15px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ⏹️ Stop
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!audioFile && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Select an audio file to see the player controls
          </p>
        )}
      </div>

      {/* Session List */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Available Sessions</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {mockSessions.map(session => (
            <div 
              key={session.id}
              onClick={() => handleSessionClick(session)}
              style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selectedSession?.id === session.id ? '#e6f3ff' : '#fff',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => (e.target as HTMLElement).style.background = '#f5f5f5'}
              onMouseOut={(e) => (e.target as HTMLElement).style.background = selectedSession?.id === session.id ? '#e6f3ff' : '#fff'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{session.title}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>{session.description}</p>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem' }}>
                    <span>⏱️ {session.duration} min</span>
                    <span>🏷️ {session.category}</span>
                    {session.premium && <span style={{ color: '#ff6b35' }}>👑 Premium</span>}
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem' }}>🎧</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Session Details */}
      {selectedSession && (
        <div style={{
          background: '#fff3cd',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <h2>🎯 Selected Session: {selectedSession.title}</h2>
          <p><strong>Duration:</strong> {selectedSession.duration} minutes</p>
          <p><strong>Category:</strong> {selectedSession.category}</p>
          
          <div style={{ marginTop: '15px' }}>
            <button 
              style={{
                padding: '10px 20px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
              onClick={() => {
                if (audioFile) {
                  alert(`Starting "${selectedSession.title}" with your audio file: ${audioFile.name}`);
                  togglePlayPause();
                } else {
                  alert('Please select an audio file first to start the meditation session!');
                }
              }}
            >
              🎯 Start Session with My Audio
            </button>
          </div>
        </div>
      )}

      {/* Debug & Status Info */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '5px',
        fontSize: '0.9rem'
      }}>
        <h3>🔧 Status:</h3>
        <p>✅ Sessions loaded: {mockSessions.length}</p>
        <p>✅ Audio file: {audioFile ? `${audioFile.name} (Ready to play!)` : 'None selected'}</p>
        <p>✅ Selected session: {selectedSession ? selectedSession.title : 'None'}</p>
        <p>✅ Audio status: {isPlaying ? '🔊 Playing' : '🔇 Stopped'}</p>
      </div>
    </div>
  );
};

export default MeditationLibrary;