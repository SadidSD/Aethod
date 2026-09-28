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
              <span className={styles.authorBioTitle}>{blog.authorRole || "Co-Founder & Principal Systems Architect at Aeethod"}</span>
            </div>
          </div>
          <p className={styles.authorBioText}>
            Sadid is a co-founder of Aeethod, architecting sovereign digital commerce platforms, real-time multi-channel inventory meshes, and high-concurrency automations for high-growth TCG retailers. Having collected Pokémon cards as a hobby alongside building web architectures and automations, he turned systems engineering into custom digital infrastructure for card shops.
          </p>
          <div className={styles.authorBioFooter}>
            <Link href="/contact" className={styles.authorBioCta} onClick={playClickSound}>
              <span>Discuss Your Store Architecture</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
