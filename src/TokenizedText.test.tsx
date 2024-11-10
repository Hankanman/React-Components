import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TokenizedText } from './TokenizedText';

describe('TokenizedText Component', () => {
  it('renders the component with initial text', () => {
    const { container } = render(<TokenizedText text="Hello, World!" />);
    const textContainer = container.querySelector('.textContainer');
    expect(textContainer).toBeInTheDocument();
  });

  it('renders with custom typing speed', async () => {
    jest.useFakeTimers();

    const { container } = render(
      <TokenizedText
        text="Slow typing test"
        typingSpeed={500}
      />
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const textContainer = container.querySelector('.textContainer');
    expect(textContainer).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('calls onComplete callback when text is fully typed', async () => {
    jest.useFakeTimers();

    const mockOnComplete = jest.fn();
    render(
      <TokenizedText
        text="Completion test"
        typingSpeed={10}
        onComplete={mockOnComplete}
      />
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(mockOnComplete).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('renders with initial delay', async () => {
    jest.useFakeTimers();

    const { container } = render(
      <TokenizedText
        text="Delayed typing"
        delay={1000}
      />
    );

    // Verify initial state
    let textContainer = container.querySelector('.textContainer');
    expect(textContainer?.children.length).toBe(0); // No children initially

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    textContainer = container.querySelector('.textContainer');
    expect(textContainer).toBeInTheDocument();

    jest.useRealTimers();
  });
});
