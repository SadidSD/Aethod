"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import styles from "./blog-detail.module.css";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import initialBlogs from "../../../content/blog.json";

function InlineSVG({ src, className, style }) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    if (!src) return;
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
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      suppressHydrationWarning={true}
    />
  );
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const { isDark } = useTheme();
  
  const initialPost = Array.isArray(initialBlogs) ? initialBlogs.find((post) => post.id === id) : null;
  const [blog, setBlog] = useState(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch("/api/content?type=blog")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((post) => post.id === id);
        if (found) setBlog(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blog posts:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.notFoundContainer} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
        <h1 className={styles.notFoundTitle}>Loading...</h1>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.notFoundContainer} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
        <h1 className={styles.notFoundTitle}>Blog Not Found</h1>
        <p className={styles.notFoundDesc}>The requested article could not be located.</p>
        <Link href="/blog" className={styles.backBtnWrapper} onClick={playClickSound}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backBtnArrow}>
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Blog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      <Navbar activePage="blog" />
      
      <main className={styles.mainContainer}>
        <Link href="/blog" className={styles.backBtnWrapper} onClick={playClickSound}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.backBtnArrow}>
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Blog</span>
        </Link>
        
        <article className={styles.blogHeader} suppressHydrationWarning={true}>
          <div className={styles.headerMeta} suppressHydrationWarning={true}>
            <span className={styles.tagPill}>
              {blog.topic}
            </span>
            <span className={styles.authorMeta}>By {blog.author || "Sadid Bin Hasan"}</span>
            <span className={styles.metaDot}>•</span>
            <span className={styles.dateText}>{blog.date}</span>
            <span className={styles.readTime}>• {blog.readTime}</span>
          </div>
          
          <h1 className={styles.blogTitle}>{blog.title}</h1>
        </article>
        
        <div className={styles.divider} />

        {/* Render Neomorphic Illustration Container */}
        {blog.illustration && (
          <div className={styles.blogIllustrationContainer} suppressHydrationWarning={true}>
            {blog.illustration.endsWith(".svg") ? (
              blog.illustration.includes("mass.svg") ? (
                <div className={styles.massGraphicWrapper} suppressHydrationWarning={true}>
                  <InlineSVG src={blog.illustration} className={styles.massSvg} />
                  <div className={`${styles.agentLabel} ${styles.agentLabelLeft}`}>Agents 1</div>
                  <div className={`${styles.agentLabel} ${styles.agentLabelTop}`}>Agents 2</div>
                  <div className={`${styles.agentLabel} ${styles.agentLabelRight}`}>Agents 3</div>
                  <div className={`${styles.agentLabel} ${styles.agentLabelBottom}`}>Agents 4</div>
                </div>
              ) : (
                <InlineSVG src={blog.illustration} className={styles.illustrationSvg} />
              )
            ) : (
              <img
                src={blog.illustration}
                alt={blog.title}
                className={styles.illustrationImg}
              />
            )}
          </div>
        )}
        
        <div 
          className={styles.blogBody}
          dangerouslySetInnerHTML={{ __html: blog.content || `<p>${blog.description}</p>` }}
          suppressHydrationWarning={true}
        />

        {/* Author Bio Box */}
        <section className={styles.authorBioBox} aria-label="Author Information">
          <div className={styles.authorBioHeader}>
            <div className={styles.authorBioAvatar}>
              <img
                src="/team/sadid.jpg"
                alt={blog.author || "Sadid Bin Hasan"}
                className={styles.authorBioImg}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className={styles.authorBioFallback}>SB</div>
            </div>
            <div className={styles.authorBioMeta}>
              <span className={styles.authorBioRoleBadge}>Author & Lead Architect</span>
              <h3 className={styles.authorBioName}>{blog.author || "Sadid Bin Hasan"}</h3>
              <span className={styles.authorBioTitle}>{blog.authorRole || "Founder & Principal Systems Architect at Aeethod"}</span>
            </div>
          </div>
          <p className={styles.authorBioText}>
            Sadid is the founder of Aeethod, architecting sovereign digital commerce platforms, real-time multi-channel inventory meshes, and high-concurrency automations for high-growth TCG retailers. Having collected Pokémon cards as a hobby alongside building web architectures and automations, he turned systems engineering into custom digital infrastructure for card shops.
          </p>
          <div className={styles.authorBioFooter}>
            <Link href="/contact" className={styles.authorBioCta} onClick={playClickSound}>
              <span>Discuss Your Store Architecture</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <div className={styles.authorBioLinks}>
              <a href="https://www.linkedin.com/in/sadidbinhasan" target="_blank" rel="noopener noreferrer" className={styles.authorSocialLink} aria-label="Sadid Bin Hasan on LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 0 0-1.63 1.62c0 .9.73 1.62 1.63 1.62.9 0 1.63-.72 1.63-1.62 0-.9-.73-1.62-1.63-1.62z"/></svg>
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/SadidSD" target="_blank" rel="noopener noreferrer" className={styles.authorSocialLink} aria-label="Sadid Bin Hasan on GitHub">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
