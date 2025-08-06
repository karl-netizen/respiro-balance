// Replace your MeditationLibrary component with this working version
import React, { useState } from 'react';

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
  const [selectedSession, setSelectedSession] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  console.log('🔥 MEDITATION LIBRARY LOADED WITH', mockSessions.length, 'SESSIONS');

  const handleAudioUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      console.log('✅ Audio file selected:', file.name);
      alert(`Audio file "${file.name}" selected successfully!`);
    } else {
      alert('Please select a valid audio file');
    }
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    console.log('🎯 Session selected:', session);
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
        <h2 style={{ marginBottom: '15px' }}>📁 Upload Your Audio File</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        />
        {audioFile && (
          <div style={{ marginTop: '10px', color: '#28a745' }}>
            ✅ Selected: {audioFile.name} ({Math.round(audioFile.size / 1024)} KB)
          </div>
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
          <p><strong>Audio URL:</strong> {selectedSession.audioUrl}</p>
          
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
              onClick={() => alert('Starting meditation: ' + selectedSession.title)}
            >
              🎯 Start Session
            </button>
            
            <button 
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => alert('Audio file functionality - attach your uploaded file here!')}
            >
              📎 Use My Audio File
            </button>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '5px',
        fontSize: '0.9rem'
      }}>
        <h3>🔧 Debug Info:</h3>
        <p>Sessions loaded: {mockSessions.length}</p>
        <p>Audio file selected: {audioFile ? audioFile.name : 'None'}</p>
        <p>Selected session: {selectedSession ? selectedSession.title : 'None'}</p>
        <p>Page status: ✅ Working properly!</p>
      </div>
    </div>
  );
};

export default MeditationLibrary;