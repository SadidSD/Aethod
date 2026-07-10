"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import styles from "./blog-detail.module.css";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

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
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setBlog(found);
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
            <span className={styles.dateText}>{blog.date}</span>
            <span className={styles.readTime}>• {blog.readTime}</span>
          </div>
          
          <h1 className={styles.blogTitle}>{blog.title}</h1>
        </article>
        
        <div className={styles.divider} />

        {/* Render Neomorphic Illustration Container */}
        {blog.illustration && (
          <div className={styles.blogIllustrationContainer} suppressHydrationWarning={true}>
            {blog.illustration.includes("mass.svg") ? (
              <div className={styles.massGraphicWrapper} suppressHydrationWarning={true}>
                <InlineSVG src={blog.illustration} className={styles.massSvg} />
                <div className={`${styles.agentLabel} ${styles.agentLabelLeft}`}>Agents 1</div>
                <div className={`${styles.agentLabel} ${styles.agentLabelTop}`}>Agents 2</div>
                <div className={`${styles.agentLabel} ${styles.agentLabelRight}`}>Agents 3</div>
                <div className={`${styles.agentLabel} ${styles.agentLabelBottom}`}>Agents 4</div>
              </div>
            ) : (
              <InlineSVG src={blog.illustration} className={styles.illustrationSvg} />
            )}
          </div>
        )}
        
        <div 
          className={styles.blogBody}
          dangerouslySetInnerHTML={{ __html: blog.content || `<p>${blog.description}</p>` }}
          suppressHydrationWarning={true}
        />
      </main>
      
      <Footer />
    </div>
  );
}
