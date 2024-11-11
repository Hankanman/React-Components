"use client";

import { useEffect, useState, useRef } from "react";

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

const TokenizedText: React.FC<TokenizedTextProps> = ({
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
  const hiddenTextRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const visibleTextRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

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

    updateCursorSize();

    const resizeObserver = new ResizeObserver(updateCursorSize);
    if (measureRef.current) {
      resizeObserver.observe(measureRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (visibleTextRef.current) {
        const newHeight = visibleTextRef.current.offsetHeight;
        setHeight(newHeight + 5);
      } else if (hiddenTextRef.current) {
        const newHeight = hiddenTextRef.current.offsetHeight;
        setHeight(newHeight + 5);
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
    let interval: NodeJS.Timeout | null = null;
    let initialDelay: NodeJS.Timeout | null = null;
    let startDelay: NodeJS.Timeout | null = null;

    initialDelay = setTimeout(() => {
      setShowCursor(true);

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
    <span
      className="relative inline-block w-full"
      ref={containerRef}
      key={text}
    >
      <span
        ref={measureRef}
        aria-hidden="true"
        className={`invisible fixed left-0 top-0 -z-10 ${className}`}
      >
        M
      </span>

      <span
        ref={hiddenTextRef}
        aria-hidden="true"
        className={`invisible fixed left-0 top-0 -z-10 w-full ${className}`}
        style={{
          whiteSpace: "pre-wrap",
          position: "fixed",
          fontSize: "inherit",
          lineHeight: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          letterSpacing: "inherit",
          textTransform: "inherit",
        }}
      >
        {text}
      </span>

      <span
        className={`inline-block overflow-hidden transition-height duration-300 ease-in-out ${className}`}
        style={{
          height: `${height}px`,
          whiteSpace: "pre-wrap",
          width: "100%",
        }}
      >
        <span className="relative inline" ref={visibleTextRef}>
          {tokens.map((token) => (
            <span
              key={token.id}
              className={`${
                token.isSpace
                  ? "break-spaces whitespace-normal"
                  : "break-word whitespace-normal"
              }`}
              style={{
                animation: "fadeIn 0.3s ease-in-out forwards",
                opacity: 0,
                display: "inline",
              }}
            >
              {token.text}
            </span>
          ))}
          {isTyping && showCursor && (
            <span
              className="ml-0.5 inline-block align-middle"
              style={{
                backgroundColor: "currentColor",
                width: `${cursorDimensions.width}px`,
                height: `${cursorDimensions.height}px`,
                animation: "blink 1s step-end infinite",
              }}
            />
          )}
        </span>
      </span>
    </span>
  );
};

export default TokenizedText;
