"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function InlineSVG({ src, className }) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load SVG: ${src}`);
        return res.text();
      })
      .then((text) => {
        const cleanText = text.replace(/<\?xml[^>]*\?>/i, "");
        setSvgContent(cleanText);
      })
      .catch((err) => console.error(err));
  }, [src]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default function ThemeToggle({ className }) {
  const { isDark, setTheme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const startXRef = useRef(0);
  const startDragXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const slideClickBufferRef = useRef(null);
  const slideFoleyBufferRef = useRef(null);
  const audioContextRef = useRef(null);

  // Pre-load and decode audio files for zero-latency
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    const loadSound = (url, bufferRef) => {
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.arrayBuffer();
        })
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then((buffer) => {
          bufferRef.current = buffer;
        })
        .catch((err) => console.warn(`Error preloading sound ${url}:`, err));
    };

    loadSound("/immersive-click.mp3", slideClickBufferRef);
    loadSound("/finger-slide.mp3", slideFoleyBufferRef);

    return () => {
      if (ctx && ctx.state !== "closed") {
        ctx.close().catch(() => {});
      }
    };
  }, []);

  const playSlideSound = useCallback(() => {
    try {
      const ctx = audioContextRef.current;
      const clickBuffer = slideClickBufferRef.current;
      const foleyBuffer = slideFoleyBufferRef.current;

      if (ctx) {
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        if (clickBuffer) {
          const clickSource = ctx.createBufferSource();
          clickSource.buffer = clickBuffer;
          const clickGain = ctx.createGain();
          clickGain.gain.value = 0.45;
          clickSource.connect(clickGain);
          clickGain.connect(ctx.destination);
          clickSource.start(0);
        } else {
          const clickAudio = new Audio("/immersive-click.mp3");
          clickAudio.volume = 0.45;
          clickAudio.play().catch(() => {});
        }

        if (foleyBuffer) {
          const foleySource = ctx.createBufferSource();
          foleySource.buffer = foleyBuffer;
          const foleyGain = ctx.createGain();
          foleyGain.gain.value = 0.6;
          foleySource.connect(foleyGain);
          foleyGain.connect(ctx.destination);
          foleySource.start(0);
        } else {
          const slideAudio = new Audio("/finger-slide.mp3");
          slideAudio.volume = 0.6;
          slideAudio.play().catch(() => {});
        }
      } else {
        const clickAudio = new Audio("/immersive-click.mp3");
        clickAudio.volume = 0.45;
        clickAudio.play().catch(() => {});

        const slideAudio = new Audio("/finger-slide.mp3");
        slideAudio.volume = 0.6;
        slideAudio.play().catch(() => {});
      }
    } catch (e) {
      // ignore errors
    }
  }, []);

  // Calculate knob travel distance
  const getMaxTravel = useCallback(() => {
    if (!trackRef.current || !knobRef.current) return 30;
    return trackRef.current.offsetWidth - knobRef.current.offsetWidth + 1;
  }, []);

  // Pointer down — start drag
  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);
      hasDraggedRef.current = false;
      startXRef.current = e.clientX;
      startDragXRef.current = isDark ? getMaxTravel() : 0;
      knobRef.current?.setPointerCapture(e.pointerId);
    },
    [isDark, getMaxTravel]
  );

  // Pointer move — drag the knob
  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const delta = e.clientX - startXRef.current;
      if (Math.abs(delta) > 3) hasDraggedRef.current = true;
      const maxTravel = getMaxTravel();
      const newX = Math.max(0, Math.min(maxTravel, startDragXRef.current + delta));
      setDragX(newX);
    },
    [isDragging, getMaxTravel]
  );

  // Pointer up — finish drag, determine toggle
  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const maxTravel = getMaxTravel();
    const threshold = maxTravel / 2;

    if (hasDraggedRef.current) {
      const shouldBeDark = dragX > threshold;
      if (shouldBeDark !== isDark) {
        playSlideSound();
        setTheme(shouldBeDark ? "dark" : "light");
      }
      setDragX(shouldBeDark ? maxTravel : 0);
    } else {
      playSlideSound();
      const next = !isDark;
      setTheme(next ? "dark" : "light");
      setDragX(next ? maxTravel : 0);
    }
  }, [isDragging, dragX, isDark, getMaxTravel, playSlideSound, setTheme]);

  // Keep dragX in sync when isDark changes
  useEffect(() => {
    if (!isDragging) {
      setDragX(isDark ? getMaxTravel() : 0);
    }
  }, [isDark, isDragging, getMaxTravel]);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      if (!isDragging) setDragX(isDark ? getMaxTravel() : 0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDark, isDragging, getMaxTravel]);

  const knobStyle = isDragging
    ? { transform: `translateX(${dragX}px)`, transition: "none" }
    : {
        transform: `translateX(${isDark ? getMaxTravel() : 0}px)`,
        transition: "transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35)",
      };

  return (
    <div className={`${className || ""} slideButton`} id="theme-toggle">
      <div className="slideTrack" ref={trackRef}>
        <InlineSVG src={isDark ? "/down_area_dark.svg" : "/down_area.svg"} className="slideTrackSvg" />
        <div
          className="slideKnob"
          ref={knobRef}
          style={knobStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="switch"
          aria-checked={isDark}
          aria-label="Toggle dark mode"
          tabIndex={0}
        >
          <InlineSVG src={isDark ? "/button_up_dark.svg" : "/button_up.svg"} className="slideKnobSvg" />
        </div>
      </div>
    </div>
  );
}
