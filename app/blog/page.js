"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function BlogPage() {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Fetch blog posts on mount
  useEffect(() => {
    fetch("/api/content?type=blog")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to load blog posts:", err));
  }, []);

  // Filter categories
  const categories = ["All", "Insight", "Engineering", "Design"];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesFilter = activeFilter === "All" || post.tag === activeFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      {/* ===== NAVIGATION ===== */}
      <Navbar activePage="blog" />

      {/* ===== MAIN CONTAINER ===== */}
      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          
          {/* Title Area */}
          <header className={styles.blogHeader}>
            <h1 className={styles.blogTitle}>
              Bl<span className={styles.purpleText}>og</span>
            </h1>
            <p className={styles.blogSubtitle}>we think, before we sell</p>
          </header>

          <div className={styles.blogBody}>
            {/* Left Column: Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarLabel}>Search Thoughts</h3>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                <h3 className={styles.sidebarLabel}>Categories</h3>
                <div className={styles.filterGroup}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        playClickSound();
                        setActiveFilter(cat);
                      }}
                      className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterBtnActive : ""}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Column: Blog Grid */}
            <section className={styles.blogGrid}>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <article key={post.id} className={styles.postCard}>
                    <div className={styles.cardHeader}>
                      <span className={`${styles.tagPill} ${styles[`tagPill_${post.tagType || "purple"}`]}`}>
                        {post.tag}
                      </span>
                      <span className={styles.dateText}>{post.date}</span>
                    </div>

                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <h3 className={styles.postSubtitle}>{post.subtitle}</h3>
                    <p className={styles.postDesc}>{post.description}</p>

                    <div className={styles.cardFooter}>
                      <span className={styles.readTime}>{post.readTime || "5 min read"}</span>
                      <a href="#" className={styles.readLink} onClick={playClickSound}>
                        Read Article
                        <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <div className={styles.noPostsCard}>
                  <p>No thoughts found matching your query.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
