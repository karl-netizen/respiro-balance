import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor as rtlWaitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { act } from 'react';
import userEvent from '@testing-library/user-event';

const waitFor = rtlWaitFor;

import { FocusProvider, useFocus } from '@/context/FocusProvider';
import { useFocusModeStore } from '@/store/focusModeStore';

// Test component to access Focus context
const TestFocusComponent = () => {
  const {
    timerState,
    timeRemaining,
    stats,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    skipInterval,
    logDistraction,
    progress,
    isActive
  } = useFocus();

  return (
    <div>
      <div data-testid="timer-state">{timerState}</div>
      <div data-testid="time-remaining">{timeRemaining}</div>
      <div data-testid="total-sessions">{stats.totalSessions}</div>
      <div data-testid="progress">{progress}</div>
      <div data-testid="is-active">{isActive ? 'active' : 'inactive'}</div>
      <button onClick={startSession}>Start</button>
      <button onClick={pauseSession}>Pause</button>
      <button onClick={resumeSession}>Resume</button>
      <button onClick={completeSession}>Complete</button>
      <button onClick={skipInterval}>Skip</button>
      <button onClick={logDistraction}>Log Distraction</button>
    </div>
  );
};

describe('Focus Mode Context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should render with idle state', () => {
      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      expect(screen.getByTestId('timer-state')).toHaveTextContent('idle');
      expect(screen.getByTestId('is-active')).toHaveTextContent('inactive');
    });

    it('should have default time remaining', () => {
      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      expect(screen.getByTestId('time-remaining')).toHaveTextContent('1500'); // 25 minutes
    });

    it('should initialize with zero sessions', () => {
      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      expect(screen.getByTestId('total-sessions')).toHaveTextContent('0');
    });
  });

  describe('Session Management', () => {
    it('should start a focus session', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });

      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Start'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId('timer-state')).toHaveTextContent('work');
      expect(screen.getByTestId('is-active')).toHaveTextContent('active');
    });

    it('should pause an active session', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });

      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Start'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId('timer-state')).toHaveTextContent('work');

      await act(async () => {
        await user.click(screen.getByText('Pause'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId('timer-state')).toHaveTextContent('paused');
      expect(screen.getByTestId('is-active')).toHaveTextContent('inactive');
    });

    it('should resume a paused session', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });

      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Start'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      await act(async () => {
        await user.click(screen.getByText('Pause'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId('timer-state')).toHaveTextContent('paused');

      await act(async () => {
        await user.click(screen.getByText('Resume'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId('timer-state')).toHaveTextContent('work');
      expect(screen.getByTestId('is-active')).toHaveTextContent('active');
    });

    it('should complete a session', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });

      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Start'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      await act(async () => {
        await user.click(screen.getByText('Complete'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId('timer-state')).toHaveTextContent('completed');
      expect(screen.getByTestId('is-active')).toHaveTextContent('inactive');
    });
  });

  describe('Timer Countdown', () => {
    it('should decrement time remaining every second', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });

      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Start'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId('timer-state')).toHaveTextContent('work');

      const initialTime = parseInt(screen.getByTestId('time-remaining').textContent || '0');

      act(() => {
        vi.advanceTimersByTime(3000); // Advance 3 seconds
      });

      const currentTime = parseInt(screen.getByTestId('time-remaining').textContent || '0');
      expect(currentTime).toBe(initialTime - 3);
    });

    it('should update progress as timer counts down', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });

      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Start'));
      });

      act(() => {
        vi.advanceTimersByTime(5000); // Advance 5 seconds
      });

      const progress = parseFloat(screen.getByTestId('progress').textContent || '0');
      expect(progress).toBeGreaterThan(0);
    });
  });

  describe('Interval Transitions', () => {
    it('should skip to break interval', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });

      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Start'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId('timer-state')).toHaveTextContent('work');

      await act(async () => {
        await user.click(screen.getByText('Skip'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByTestId('timer-state')).toHaveTextContent('break');
    });
  });

  describe('Distraction Tracking', () => {
    it('should log distractions during work session', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });

      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Start'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      await act(async () => {
        await user.click(screen.getByText('Log Distraction'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Verify no errors occurred
      expect(screen.getByTestId('timer-state')).toHaveTextContent('work');
    });
  });

  describe('Stats Tracking', () => {
    it('should increment total sessions on completion', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });

      render(
        <FocusProvider>
          <TestFocusComponent />
        </FocusProvider>
      );

      const initialSessions = parseInt(screen.getByTestId('total-sessions').textContent || '0');

      await act(async () => {
        await user.click(screen.getByText('Start'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      await act(async () => {
        await user.click(screen.getByText('Complete'));
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      const finalSessions = parseInt(screen.getByTestId('total-sessions').textContent || '0');
      expect(finalSessions).toBe(initialSessions + 1);
    });
  });
});

describe('Focus Mode Store', () => {
  beforeEach(() => {
    // Reset store state completely
    useFocusModeStore.setState({
      isActive: false,
      currentSession: null,
      timeRemaining: 0,
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
      sessions: [],
      completedCycles: 0
    });
  });

  describe('Session State', () => {
    it('should start a work session', () => {
      const { startSession, isActive, currentSession } = useFocusModeStore.getState();
      
      startSession('work');
      
      const state = useFocusModeStore.getState();
      expect(state.isActive).toBe(true);
      expect(state.currentSession).not.toBeNull();
      expect(state.currentSession?.type).toBe('work');
    });

    it('should start a break session', () => {
      const { startSession } = useFocusModeStore.getState();
      
      startSession('short_break');
      
      const state = useFocusModeStore.getState();
      expect(state.isActive).toBe(true);
      expect(state.currentSession?.type).toBe('short_break');
    });

    it('should pause a session', () => {
      const { startSession, pauseSession } = useFocusModeStore.getState();
      
      startSession('work');
      pauseSession();
      
      const state = useFocusModeStore.getState();
      expect(state.isActive).toBe(false);
      expect(state.currentSession).not.toBeNull();
    });

    it('should resume a paused session', () => {
      const { startSession, pauseSession, resumeSession } = useFocusModeStore.getState();
      
      startSession('work');
      pauseSession();
      resumeSession();
      
      const state = useFocusModeStore.getState();
      expect(state.isActive).toBe(true);
    });
  });

  describe('Session Completion', () => {
    it('should complete a session and save to history', () => {
      const { startSession, completeSession } = useFocusModeStore.getState();
      
      startSession('work');
      const sessionId = useFocusModeStore.getState().currentSession?.id;
      
      completeSession();
      
      const state = useFocusModeStore.getState();
      expect(state.isActive).toBe(false);
      expect(state.currentSession).toBeNull();
      expect(state.sessions.length).toBeGreaterThan(0);
      expect(state.sessions[0].id).toBe(sessionId);
      expect(state.sessions[0].completed).toBe(true);
    });

    it('should increment completed cycles for work sessions', () => {
      const { startSession, completeSession } = useFocusModeStore.getState();
      
      const initialCycles = useFocusModeStore.getState().completedCycles;
      
      startSession('work');
      completeSession();
      
      const state = useFocusModeStore.getState();
      expect(state.completedCycles).toBe(initialCycles + 1);
    });

    it('should not increment cycles for break sessions', () => {
      const { startSession, completeSession } = useFocusModeStore.getState();
      
      const initialCycles = useFocusModeStore.getState().completedCycles;
      
      startSession('short_break');
      completeSession();
      
      const state = useFocusModeStore.getState();
      expect(state.completedCycles).toBe(initialCycles);
    });
  });

  describe('Settings Management', () => {
    it('should update work duration', () => {
      const { updateSettings } = useFocusModeStore.getState();
      
      updateSettings({ workDuration: 30 });
      
      const state = useFocusModeStore.getState();
      expect(state.workDuration).toBe(30);
    });

    it('should update break durations', () => {
      const { updateSettings } = useFocusModeStore.getState();
      
      updateSettings({ 
        shortBreakDuration: 10,
        longBreakDuration: 20
      });
      
      const state = useFocusModeStore.getState();
      expect(state.shortBreakDuration).toBe(10);
      expect(state.longBreakDuration).toBe(20);
    });
  });

  describe('Stats Calculation', () => {
    it('should calculate today stats correctly', () => {
      const { startSession, completeSession, getTodayStats } = useFocusModeStore.getState();
      
      // Complete 2 work sessions
      startSession('work');
      completeSession();
      
      startSession('work');
      completeSession();
      
      const stats = getTodayStats();
      
      expect(stats.sessionsCompleted).toBe(2);
      expect(stats.totalMinutes).toBeGreaterThan(0);
    });

    it('should only count completed sessions in stats', () => {
      const { startSession, skipSession, completeSession, getTodayStats } = useFocusModeStore.getState();
      
      startSession('work');
      completeSession();
      
      startSession('work');
      skipSession(); // Not completed
      
      const stats = getTodayStats();
      
      expect(stats.sessionsCompleted).toBe(1);
    });
  });

  describe('Session Skip', () => {
    it('should clear current session without saving', () => {
      const { startSession, skipSession } = useFocusModeStore.getState();
      
      startSession('work');
      const initialSessionCount = useFocusModeStore.getState().sessions.length;
      
      skipSession();
      
      const state = useFocusModeStore.getState();
      expect(state.isActive).toBe(false);
      expect(state.currentSession).toBeNull();
      expect(state.sessions.length).toBe(initialSessionCount); // No new session added
    });
  });
});
