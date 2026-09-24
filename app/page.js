"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "./context/ThemeContext";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomeButton from "./components/HomeButton";
import IntegrationHub from "./components/IntegrationHub";
import ConversationCtaSection from "./components/ConversationCtaSection";


const CURVE_PATH = "M10.502 301.037C10.502 301.037 278.19 379.737 387.502 346.037C465.301 322.052 519.222 255.036 594.502 224.037C717.17 173.524 741.006 227.347 853.502 157.037C933.502 107.037 953.502 83.0367 953.502 83.0367C953.502 83.0367 999.582 34.0816 1081.5 16.9464C1123.96 8.06441 1155.5 10.9464 1155.5 10.9464";

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
      suppressHydrationWarning={true}
    />
  );
}

function HeroEcosystemVisual() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId;
    let isRunning = true;
    let hasEndedTriggered = false;
    let finalFrameUploaded = false;

    const triggerEnd = () => {
      if (hasEndedTriggered) return;
      hasEndedTriggered = true;
      video.pause();
      setIsEnded(true);
    };

    video.addEventListener("ended", triggerEnd);

    // Responsive DPR Canvas Sizing (prevents browser compositor skip-pixel aliasing)
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = rect.width > 0 ? rect.width : (wrapperRef.current?.getBoundingClientRect().width || 760);
      const targetWidth = Math.max(320, Math.round(displayWidth * dpr));
      const targetHeight = Math.round(targetWidth * (1080 / 1920));
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        if (gl) gl.viewport(0, 0, targetWidth, targetHeight);
      }
    };

    let gl = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      gl = null;
    }

    let onResize;

    if (gl) {
      resizeCanvas();

      const vsSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
        }
      `;

      // 4-tap rotated-grid bilinear supersampling for anti-aliasing during minification
      const fsSource = `
        precision highp float;
        uniform sampler2D u_image;
        uniform vec2 u_texelSize;
        varying vec2 v_texCoord;

        vec4 sampleColor(vec2 uv) {
          vec2 rgbCoord = vec2(uv.x, uv.y * 0.5);
          vec2 alphaCoord = vec2(uv.x, 0.5 + uv.y * 0.5);
          vec4 rgb = texture2D(u_image, rgbCoord);
          float a = texture2D(u_image, alphaCoord).r;
          return vec4(rgb.rgb * a, a);
        }

        void main() {
          vec2 d = u_texelSize * 0.65;
          vec4 c0 = sampleColor(v_texCoord + vec2(-d.x,  d.y * 0.5));
          vec4 c1 = sampleColor(v_texCoord + vec2( d.x, -d.y * 0.5));
          vec4 c2 = sampleColor(v_texCoord + vec2(-d.x * 0.5, -d.y));
          vec4 c3 = sampleColor(v_texCoord + vec2( d.x * 0.5,  d.y));
          gl_FragColor = (c0 + c1 + c2 + c3) * 0.25;
        }
      `;

      const createShader = (glCtx, type, source) => {
        const shader = glCtx.createShader(type);
        glCtx.shaderSource(shader, source);
        glCtx.compileShader(shader);
        return shader;
      };

      const program = gl.createProgram();
      const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      const texelLoc = gl.getUniformLocation(program, "u_texelSize");
      gl.uniform2f(texelLoc, 1.0 / 1920.0, 1.0 / 2160.0);

      const posBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1, -1,
           1,  1,
        ]),
        gl.STATIC_DRAW
      );

      const posLoc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const texBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          0, 1,
          1, 1,
          0, 0,
          0, 0,
          1, 1,
          1, 0,
        ]),
        gl.STATIC_DRAW
      );

      const texLoc = gl.getAttribLocation(program, "a_texCoord");
      gl.enableVertexAttribArray(texLoc);
      gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const render = () => {
        if (!isRunning) return;
        if (video.readyState >= 2) {
          resizeCanvas();
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.bindTexture(gl.TEXTURE_2D, texture);
          if (!video.ended) {
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              video
            );
          } else if (!finalFrameUploaded) {
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              video
            );
            finalFrameUploaded = true;
            triggerEnd();
          }
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        animId = requestAnimationFrame(render);
      };

      onResize = () => {
        resizeCanvas();
        if (finalFrameUploaded && gl) {
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      };
      window.addEventListener("resize", onResize);

      video.play().catch(() => {});
      animId = requestAnimationFrame(render);
    } else {
      // 2D Canvas fallback
      resizeCanvas();
      const ctx = canvas.getContext("2d");
      const render2d = () => {
        if (!isRunning) return;
        if (video.readyState >= 2) {
          resizeCanvas();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (video.ended) {
            triggerEnd();
          }
        }
        animId = requestAnimationFrame(render2d);
      };
      onResize = () => resizeCanvas();
      window.addEventListener("resize", onResize);

      video.play().catch(() => {});
      animId = requestAnimationFrame(render2d);
    }

    return () => {
      isRunning = false;
      video.removeEventListener("ended", triggerEnd);
      if (onResize) window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className={styles.heroVisual}>
      <div
        ref={wrapperRef}
        className={styles.heroVideoWrapper}
      >
        <video
          ref={videoRef}
          src="/hero-animation-alpha.mp4?v=20260925_03"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{ display: "none" }}
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.pause();
            }
            setIsEnded(true);
          }}
        />
        <canvas
          ref={canvasRef}
          width={1520}
          height={855}
          aria-label="AEETHOD Platform Ecosystem Animation"
          className={styles.heroAnimationVideo}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const { isDark } = useTheme();
              
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Journey flow animation refs and state
  const journeyRef = useRef(null);
  const bluePathRef = useRef(null);
  const glowPathRef = useRef(null);
  const bluePathTabletRef = useRef(null);
  const glowPathTabletRef = useRef(null);
  const journeyStartedRef = useRef(false);

        
  
  // Scroll to the end of the hero page (services section)
  const handleScrollToServices = useCallback(() => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll to the top of the page smoothly
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  
    const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  
  
  
  
  
  
  
  // Journey path flow animation — triggered when section enters viewport
  useEffect(() => {
    const el = journeyRef.current;
    if (!el) return;

    const paths = [];
    if (bluePathRef.current) {
      paths.push({
        blue: bluePathRef.current,
        glow: glowPathRef.current,
        totalLength: bluePathRef.current.getTotalLength ? bluePathRef.current.getTotalLength() : 2000
      });
    }
    if (bluePathTabletRef.current) {
      paths.push({
        blue: bluePathTabletRef.current,
        glow: glowPathTabletRef.current,
        totalLength: bluePathTabletRef.current.getTotalLength ? bluePathTabletRef.current.getTotalLength() : 2000
      });
    }

    if (paths.length === 0) return;

    let animId;

    // Initialize: fully hidden
    paths.forEach(p => {
      p.blue.style.strokeDasharray = p.totalLength;
      p.blue.style.strokeDashoffset = p.totalLength;
      if (p.glow) {
        p.glow.style.strokeDasharray = p.totalLength;
        p.glow.style.strokeDashoffset = p.totalLength;
      }
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !journeyStartedRef.current) {
          // Safeguard: ignore false-positive initial intersections on page load if element is below fold
          if (window.scrollY < 100 && el.getBoundingClientRect().top > window.innerHeight) {
            return;
          }
          journeyStartedRef.current = true;
          observer.disconnect();

          const duration = 2500;
          const startTime = performance.now();
          let c1 = false, c2 = false, c3 = false;

          const tick = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - t, 3);

            paths.forEach(p => {
              const offset = p.totalLength * (1 - eased);
              p.blue.style.strokeDashoffset = offset;
              if (p.glow) p.glow.style.strokeDashoffset = offset;
            });

            // Reveal cards as the flow reaches their position on the curve
            if (eased >= 0.13 && !c1) {
              c1 = true;
              const card = document.getElementById("service-card-1");
              if (card) {
                card.classList.remove(styles.serviceCardHidden);
                card.classList.add(styles.serviceCardVisible);
              }
            }
            if (eased >= 0.48 && !c2) {
              c2 = true;
              const card = document.getElementById("service-card-2");
              if (card) {
                card.classList.remove(styles.serviceCardHidden);
                card.classList.add(styles.serviceCardVisible);
              }
            }
            if (eased >= 0.80 && !c3) {
              c3 = true;
              const card = document.getElementById("service-card-3");
              if (card) {
                card.classList.remove(styles.serviceCardHidden);
                card.classList.add(styles.serviceCardVisible);
              }
            }

            if (t < 1) animId = requestAnimationFrame(tick);
          };

          animId = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  
  // Scroll Indicator Drag & Tracking
  const [scrollTopProgress, setScrollTopProgress] = useState(0);
  const [isDraggingScroll, setIsDraggingScroll] = useState(false);
  const [maxScrollTravel, setMaxScrollTravel] = useState(0);

  const isDraggingScrollRef = useRef(false);
  const startScrollButtonYRef = useRef(0);
  const startScrollTranslateYRef = useRef(0);
  const scrollButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isDraggingScrollRef.current) return;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollTopProgress(progress);

      const buttonHeight = 70;
      const padding = 24;
      const maxTravel = window.innerHeight - buttonHeight - padding * 2;
      setMaxScrollTravel(maxTravel);

      if (scrollButtonRef.current) {
        scrollButtonRef.current.style.transform = `translateY(${progress * maxTravel}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleScrollPointerDown = useCallback((e) => {
    e.preventDefault();

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const buttonHeight = 70;
    const padding = 24;
    const maxTravel = window.innerHeight - buttonHeight - padding * 2;

    if (docHeight <= 0 || maxTravel <= 0) return;

    // Temporarily set scroll-behavior to auto so dragging is instant
    document.documentElement.style.scrollBehavior = 'auto';
    isDraggingScrollRef.current = true;
    setIsDraggingScroll(true);

    startScrollButtonYRef.current = e.clientY;

    const currentProgress = window.scrollY / docHeight;
    startScrollTranslateYRef.current = currentProgress * maxTravel;

    scrollButtonRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const handleScrollPointerMove = useCallback((e) => {
    if (!isDraggingScrollRef.current) return;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const buttonHeight = 70;
    const padding = 24;
    const maxTravel = window.innerHeight - buttonHeight - padding * 2;

    if (docHeight <= 0 || maxTravel <= 0) return;

    const deltaY = e.clientY - startScrollButtonYRef.current;
    const newTranslateY = Math.max(0, Math.min(maxTravel, startScrollTranslateYRef.current + deltaY));

    // Direct DOM manipulation for buttery smooth transform updates
    if (scrollButtonRef.current) {
      scrollButtonRef.current.style.transform = `translateY(${newTranslateY}px)`;
    }

    // Scroll the page synchronously
    const scrollPercent = newTranslateY / maxTravel;
    const newScrollTop = scrollPercent * docHeight;
    window.scrollTo({ top: newScrollTop, behavior: 'auto' });
  }, []);

  const handleScrollPointerUp = useCallback((e) => {
    if (!isDraggingScrollRef.current) return;

    try {
      scrollButtonRef.current?.releasePointerCapture(e.pointerId);
    } catch (err) { }

    isDraggingScrollRef.current = false;
    setIsDraggingScroll(false);

    // Restore default CSS smooth scroll behavior
    document.documentElement.style.scrollBehavior = '';

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const buttonHeight = 70;
    const padding = 24;
    const maxTravel = window.innerHeight - buttonHeight - padding * 2;

    if (docHeight > 0 && maxTravel > 0) {
      const currentProgress = window.scrollY / docHeight;
      setScrollTopProgress(currentProgress);
    }

    // Smooth scroll to services if it was a quick click rather than a dragging gesture
    const deltaY = Math.abs(e.clientY - startScrollButtonYRef.current);
    if (deltaY < 5) {
      handleScrollToServices();
    }
  }, [handleScrollToServices]);

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? 'dark' : 'light'} suppressHydrationWarning={true}>
      {/* ===== NAVIGATION ===== */}
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className={styles.heroSection} id="hero">
        <div className={styles.alignContainer}>
          <div className={styles.heroContent}>
            {/* Left — Copy */}
            <div className={styles.heroText}>
              <div className={styles.heroEyebrow}>
                <span className={styles.eyebrowDot} />
                <span>TCG & Digital Platform Architecture</span>
              </div>
              <h1 className={styles.heroHeading}>
                You have outgrown the marketplaces,
                <br className={styles.heroLineBreak} />
                Build the{" "}
                <span className={styles.heroHighlight}>platform</span>{" "}
                <span className={styles.heroHighlight}>your</span>{" "}
                <span className={styles.heroHighlight}>brand</span>{" "}
                <span className={styles.heroHighlight}>deserves.</span>
              </h1>
              <p className={styles.heroSubtext}>
                Aeethod builds custom digital platforms, ecommerce systems, and automation for growing TCG businesses—so your technology can evolve with the way your business actually works.
              </p>
              {/* Action Button Bar */}
              <div className={styles.btnBar}>
                <HomeButton
                  variant="purple"
                  text="Works"
                  onClick={() => {
                    playClickSound();
                    window.location.href = "/works";
                  }}
                />
                <HomeButton
                  variant="blue"
                  text="Contact"
                  onClick={() => {
                    playClickSound();
                    window.location.href = "/contact";
                  }}
                />
              </div>
            </div>

            {/* Right — AEETHOD Animated Ecosystem Visual */}
            <HeroEcosystemVisual />
          </div>


        </div>
      </section>

      {/* ===== Decorative Path + Gear Orb ===== */}
      <div className={styles.heroPathSection}>
        <div className={styles.heroPathWrapper}>
          <svg
            className={styles.heroPathSvg}
            viewBox="0 0 320 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pathGrad1" x1="0" y1="12" x2="320" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(196,181,253,0)" />
                <stop offset="30%" stopColor="rgba(196,181,253,0.4)" />
                <stop offset="70%" stopColor="rgba(196,181,253,0.4)" />
                <stop offset="100%" stopColor="rgba(196,181,253,0)" />
              </linearGradient>
              <filter id="pathGlow1">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M0 12 Q80 4, 160 12 T320 12"
              stroke="url(#pathGrad1)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              filter="url(#pathGlow1)"
            />
            {/* Small dots along path */}
            <circle cx="60" cy="9" r="2" fill="rgba(196,181,253,0.5)" />
            <circle cx="160" cy="12" r="2" fill="rgba(196,181,253,0.6)" />
            <circle cx="260" cy="9" r="2" fill="rgba(196,181,253,0.5)" />
          </svg>

          {/* Gear / Settings Orb */}
          <div className={styles.settingsOrb}>
            <div className={styles.settingsOrbInner}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ===== WHAT WE ACTUALLY BUILD ===== */}
      <section className={styles.servicesSection} id="services">
        <div className={styles.alignContainer}>
          <div className={styles.servicesContent}>
            <div className={styles.servicesHeader}>
              <h2 className={styles.servicesHeading}>
                What We{" "}
                <span className={styles.servicesHighlight}>Actually</span>{" "}
                <span className={styles.servicesHighlight}>Build</span>
              </h2>
              <p className={styles.servicesSubtext}>
                No fragmented plugins or fragile templates. We engineer unified digital architectures that connect your inventory across platforms, automate your daily operations, and give you real sales intelligence.
              </p>
            </div>

            {/* Journey Path with Services */}
            <div className={styles.servicesJourneyWrapper}>
              <div className={styles.servicesJourney} ref={journeyRef}>
              {/* Animated SVG Journey Path (Desktop) */}
              <div className={`${styles.journeyPathSvg} ${styles.journeyPathSvgDesktop}`}>
                <svg width="1166" height="365" viewBox="0 0 1166 365" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="jBorderF" x="-5%" y="-15%" width="110%" height="140%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="-3" dy="3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.2 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="e1" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="3" dy="-3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.2 0" />
                      <feBlend mode="normal" in2="e1" result="e2" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="-3" dy="-3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0" />
                      <feBlend mode="normal" in2="e2" result="e3" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="3" dy="3" />
                      <feGaussianBlur stdDeviation="4" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.9 0" />
                      <feBlend mode="normal" in2="e3" result="e4" />
                      <feBlend mode="normal" in="SourceGraphic" in2="e4" result="shape" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="1" dy="1" />
                      <feGaussianBlur stdDeviation="1" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0" />
                      <feBlend mode="normal" in2="shape" result="e5" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="-1" dy="-1" />
                      <feGaussianBlur stdDeviation="1" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.5 0" />
                      <feBlend mode="normal" in2="e5" result="e6" />
                    </filter>
                    <filter id="jInnerF" x="-5%" y="-15%" width="110%" height="140%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="3" dy="3" />
                      <feGaussianBlur stdDeviation="4" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.9 0" />
                      <feBlend mode="normal" in2="shape" result="e1" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="-3" dy="-3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0" />
                      <feBlend mode="normal" in2="e1" result="e2" />
                    </filter>
                    <filter id="jGlowF" x="-10%" y="-50%" width="120%" height="200%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Outer border — static neumorphic track */}
                  <g filter="url(#jBorderF)">
                    <path d={CURVE_PATH} stroke="#E5E5E3" strokeWidth="30" strokeLinecap="round" fill="none" />
                  </g>
                  {/* Inner blue path — animated flow fill */}
                  <g filter="url(#jInnerF)">
                    <path ref={bluePathRef} d={CURVE_PATH} stroke="#B2CEFE" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="2000" strokeDashoffset="2000" />
                  </g>
                  {/* Ambient glow — follows the flow for 3D depth */}
                  <path ref={glowPathRef} d={CURVE_PATH} stroke="#B2CEFE" strokeWidth="24" strokeLinecap="round" fill="none" opacity="0.3" filter="url(#jGlowF)" strokeDasharray="2000" strokeDashoffset="2000" />
                </svg>
              </div>

              {/* Animated SVG Journey Path (Tablet) */}
              <div className={`${styles.journeyPathSvg} ${styles.journeyPathSvgTablet}`}>
                <svg width="768" height="320" viewBox="0 0 768 320" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="jBorderFTablet" x="-5%" y="-15%" width="110%" height="140%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="-3" dy="3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.2 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="e1" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="3" dy="-3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.2 0" />
                      <feBlend mode="normal" in2="e1" result="e2" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="-3" dy="-3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0" />
                      <feBlend mode="normal" in2="e2" result="e3" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="3" dy="3" />
                      <feGaussianBlur stdDeviation="4" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.9 0" />
                      <feBlend mode="normal" in2="e3" result="e4" />
                      <feBlend mode="normal" in="SourceGraphic" in2="e4" result="shape" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="1" dy="1" />
                      <feGaussianBlur stdDeviation="1" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0" />
                      <feBlend mode="normal" in2="shape" result="e5" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="-1" dy="-1" />
                      <feGaussianBlur stdDeviation="1" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.76078 0 0 0 0 0.75686 0 0 0 0 0.74902 0 0 0 0.5 0" />
                      <feBlend mode="normal" in2="e5" result="e6" />
                    </filter>
                    <filter id="jInnerFTablet" x="-5%" y="-15%" width="110%" height="140%" filterUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="3" dy="3" />
                      <feGaussianBlur stdDeviation="4" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0.713726 0 0 0 0 0.709804 0 0 0 0 0.701961 0 0 0 0.9 0" />
                      <feBlend mode="normal" in2="shape" result="e1" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="-3" dy="-3" />
                      <feGaussianBlur stdDeviation="3" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0" />
                      <feBlend mode="normal" in2="e1" result="e2" />
                    </filter>
                    <filter id="jGlowFTablet" x="-10%" y="-50%" width="120%" height="200%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Outer border — static neumorphic track */}
                  <g filter="url(#jBorderFTablet)">
                    <path d="M 115,240 Q 250,260 384,165 T 653,90" stroke="#E5E5E3" strokeWidth="30" strokeLinecap="round" fill="none" />
                  </g>
                  {/* Inner blue path — animated flow fill */}
                  <g filter="url(#jInnerFTablet)">
                    <path ref={bluePathTabletRef} d="M 115,240 Q 250,260 384,165 T 653,90" stroke="#B2CEFE" strokeWidth="15" strokeLinecap="round" fill="none" strokeDasharray="2000" strokeDashoffset="2000" />
                  </g>
                  {/* Ambient glow — follows the flow for 3D depth */}
                  <path ref={glowPathTabletRef} d="M 115,240 Q 250,260 384,165 T 653,90" stroke="#B2CEFE" strokeWidth="24" strokeLinecap="round" fill="none" opacity="0.3" filter="url(#jGlowFTablet)" strokeDasharray="2000" strokeDashoffset="2000" />
                </svg>
              </div>

              {/* SVG Journey Path (Mobile) */}
              <div className={`${styles.journeyPathSvg} ${styles.journeyPathSvgMobile}`}>
                <svg width="100" height="1000" viewBox="0 0 100 1000" preserveAspectRatio="none" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="jGlowFMobile" x="-200%" y="-50%" width="500%" height="200%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Ambient glow line */}
                  <path d="M 50,0 Q 15,250 50,500 T 50,1000" stroke="#B8A0E8" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.10" filter="url(#jGlowFMobile)" />
                  {/* Main thin line */}
                  <path d="M 50,0 Q 15,250 50,500 T 50,1000" stroke="#B2CEFE" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.15" />
                </svg>
              </div>

              {/* Service Card 1: Connected Inventory */}
              <div id="service-card-1" className={`${styles.serviceCard} ${styles.serviceCard1} ${styles.serviceCardHidden}`} role="region" aria-label="Connected Inventory">
                <div className={styles.serviceIcon}>
                  <div className={styles.serviceIconImg} role="img" aria-label="Connected Inventory Icon" style={{ WebkitMaskImage: "url('/temp_icon1.png')", maskImage: "url('/temp_icon1.png')" }} />
                </div>
                <div className={styles.serviceCardHtmlContent}>
                  <h3 className={styles.serviceCardTitle}>
                    Connected <span className={styles.serviceCardTitleHighlight}>Inventory</span>
                  </h3>
                  <p className={styles.serviceCardDesc}>
                    One central source of truth. Real-time stock synchronization across your web store, marketplaces (TCGplayer, eBay), and physical POS—preventing overselling for good.
                  </p>
                </div>
              </div>
 
              {/* Service Card 2: Operations Automation */}
              <div id="service-card-2" className={`${styles.serviceCard} ${styles.serviceCard2} ${styles.serviceCardHidden}`} role="region" aria-label="Operations Automation">
                <div className={styles.serviceIcon}>
                  <div className={styles.serviceIconImg} role="img" aria-label="Operations Automation Icon" style={{ WebkitMaskImage: "url('/temp_icon2.png')", maskImage: "url('/temp_icon2.png')" }} />
                </div>
                <div className={styles.serviceCardHtmlContent}>
                  <h3 className={styles.serviceCardTitle}>
                    Operations <span className={styles.serviceCardTitleHighlight}>Automation</span>
                  </h3>
                  <p className={styles.serviceCardDesc}>
                    Put repetitive daily tasks on autopilot. Automated market-based repricing, instant order processing, condition grading intake, and automated shipping workflows.
                  </p>
                </div>
              </div>
 
              {/* Service Card 3: Sales & Profit Analytics */}
              <div id="service-card-3" className={`${styles.serviceCard} ${styles.serviceCard3} ${styles.serviceCardHidden}`} role="region" aria-label="Sales and Revenue Analytics">
                <div className={styles.serviceIcon}>
                  <div className={styles.serviceIconImg} role="img" aria-label="Sales and Revenue Analytics Icon" style={{ WebkitMaskImage: "url('/temp_icon3.png')", maskImage: "url('/temp_icon3.png')" }} />
                </div>
                <div className={styles.serviceCardHtmlContent}>
                  <h3 className={styles.serviceCardTitle}>
                    Sales & Profit <span className={styles.serviceCardTitleHighlight}>Analytics</span>
                  </h3>
                  <p className={styles.serviceCardDesc}>
                    Actionable intelligence without the clutter. Real-time dashboards tracking net margins, inventory velocity, top-selling categories, and revenue trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* ===== INTEGRATION ECOSYSTEM HUB ===== */}
      <IntegrationHub />

      {/* ===== CONVERSATION CTA SECTION ===== */}
      <ConversationCtaSection />

      {/* ===== FOOTER SECTION ===== */}
      <Footer />

      {/* ===== Floating Scroll Button ===== */}
      {/* <button
        className={`${styles.floatingScrollBtn} ${isDraggingScroll ? styles.isDragging : ""}`}
        id="scroll-indicator"
        aria-label="Scroll Down"
        ref={scrollButtonRef}
        onPointerDown={handleScrollPointerDown}
        onPointerMove={handleScrollPointerMove}
        onPointerUp={handleScrollPointerUp}
        onPointerCancel={handleScrollPointerUp}
        onLostPointerCapture={handleScrollPointerUp}
        style={{
          transform: `translateY(${scrollTopProgress * maxScrollTravel}px)`,
          transition: "none"
        }}
      >
        <div className={styles.scrollKnob} />
      </button> */}
    </div>
  );
}
