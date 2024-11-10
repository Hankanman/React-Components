import React, { useEffect, useState, useRef } from "react";
import styles from "./TokenizedText.module.css";

interface TokenizedTextProps {
  text: string;
  typingSpeed?: number;
  delay?: number;
  initialCursorDelay?: number;
  className?: string;
  onComplete?: () => void;
}

interface Token {
  text: string;
  id: number;
  isSpace: boolean;
}

export const TokenizedText: React.FC<TokenizedTextProps> = ({
  text,
  typingSpeed = 100,
  delay = 0,
  initialCursorDelay = 1000,
  className = "",
  onComplete,
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(false);
  const [height, setHeight] = useState<number>(0);
  const [cursorDimensions, setCursorDimensions] = useState({
    width: 0,
    height: 0,
  });
  const hiddenTextRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleTextRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Set up resize observer to handle font loading and dynamic changes
  useEffect(() => {
    const updateCursorSize = () => {
      if (measureRef.current) {
        const computedStyle = window.getComputedStyle(measureRef.current);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const fontSize = parseFloat(computedStyle.fontSize);

        setCursorDimensions({
          width: Math.max(fontSize * 0.4, 2),
          height: !isNaN(lineHeight) ? lineHeight : fontSize * 1.2,
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateCursorSize);
    if (measureRef.current) {
      resizeObserver.observe(measureRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Set up resize observer for the container to handle width changes
  useEffect(() => {
    const updateHeight = () => {
      if (visibleTextRef.current) {
        const newHeight = visibleTextRef.current.offsetHeight;
        setHeight(newHeight);
      } else if (hiddenTextRef.current) {
        const newHeight = hiddenTextRef.current.offsetHeight;
        setHeight(newHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    if (hiddenTextRef.current) {
      resizeObserver.observe(hiddenTextRef.current);
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    if (visibleTextRef.current) {
      const newHeight = visibleTextRef.current.offsetHeight;
      setHeight(newHeight);
    }
  }, [text, tokens]);

  useEffect(() => {
    // Reset states
    setTokens([]);
    setIsTyping(true);
    setShowCursor(false);

    const words = text.trim().split(/\s+/);
    const processedTokens = words.reduce<Token[]>((acc, word, index) => {
      acc.push({
        text: word,
        id: index * 2,
        isSpace: false,
      });

      if (index < words.length - 1) {
        acc.push({
          text: " ",
          id: index * 2 + 1,
          isSpace: true,
        });
      }

      return acc;
    }, []);

    let currentIndex = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    let initialDelay: ReturnType<typeof setTimeout> | null = null;
    let startDelay: ReturnType<typeof setTimeout> | null = null;

    // Show cursor immediately after the initial delay
    initialDelay = setTimeout(() => {
      setShowCursor(true);

      // Then wait for cursor delay before starting text
      startDelay = setTimeout(() => {
        interval = setInterval(() => {
          if (currentIndex < processedTokens.length) {
            const newToken = processedTokens[currentIndex];
            if (newToken !== undefined) {
              setTokens((prev) => [...prev, newToken]);
            }
            currentIndex++;
          } else {
            if (interval) clearInterval(interval);
            setIsTyping(false);
            if (onComplete) onComplete();
          }
        }, typingSpeed);
      }, initialCursorDelay);
    }, delay);

    return () => {
      if (initialDelay) clearTimeout(initialDelay);
      if (startDelay) clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [text, typingSpeed, delay, initialCursorDelay, onComplete]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Hidden element to measure text metrics */}
      <span ref={measureRef} aria-hidden="true" className={styles.measure}>
        M
      </span>

      {/* Hidden element to measure initial height */}
      <div
        ref={hiddenTextRef}
        aria-hidden="true"
        className={`${styles.hidden} ${className}`}
        style={{
          fontSize: "inherit",
          lineHeight: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          letterSpacing: "inherit",
          textTransform: "inherit",
        }}
      >
        {text}
      </div>

      {/* Actual content container with smooth height transition */}
      <div
        className={`${styles.content} ${className}`}
        style={{
          height: `${height}px`,
        }}
      >
        <span className={styles.textContainer} ref={visibleTextRef}>
          {tokens.map((token) => (
            <span
              key={token.id}
              className={`${styles.token} ${
                token.isSpace ? styles.space : styles.word
              }`}
            >
              {token.text}
            </span>
          ))}
          {isTyping && showCursor && (
            <span
              className={styles.cursor}
              style={{
                width: `${cursorDimensions.width}px`,
                height: `${cursorDimensions.height}px`,
              }}
            />
          )}
        </span>
      </div>
    </div>
  );
};
