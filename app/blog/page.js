"use client";

import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function InlineSVG({ src, className, style }) {
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
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default function BlogPage() {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTopic, setActiveTopic] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

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

  const filters = [
    "All",
    "Recently Uploaded",
    "History",
    "By Sadid Bin Hasan",
    "E-Commerce Related",
    "F-Commerce",
  ];

  const topics = [
    { name: "AI Behavior", count: 11 },
    { name: "Complexity Research", count: 9 },
    { name: "Market Structure", count: 15 },
    { name: "Future System", count: 5 },
    { name: "Short Essays", count: 6 },
    { name: "Diagram", count: 8 },
    { name: "Insight", count: 4 },
  ];

  // Filter posts by search, topic, and active filter
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesTopic =
      !activeTopic ||
      post.topic === activeTopic;

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Recently Uploaded" && true) ||
      (activeFilter === "E-Commerce Related" &&
        post.tags &&
        post.tags.some(
          (t) =>
            t.toLowerCase().includes("e-commerce") ||
            t.toLowerCase().includes("ecommerce")
        ));

    return matchesSearch && matchesTopic && matchesFilter;
  });

  const toggleCard = (id) => {
    playClickSound();
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"}>
      <Navbar activePage="blog" />

      <main className={styles.mainContainer}>
        <div className={styles.blogLayout}>
          {/* ===== LEFT SIDEBAR ===== */}
          <aside className={styles.sidebar}>
            <h1 className={styles.pageTitle}>Vlogs</h1>
            <p className={styles.pageSubtitle}>We think before we sell.</p>

            {/* Search Bar */}
            <div className={styles.searchWrapper}>
              <div className={styles.searchInner}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className={styles.searchIconCircle}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="#717171"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="7.33" cy="7.33" r="5.33" />
                    <line x1="12" y1="12" x2="9.1" y2="9.1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Topics */}
            <h3 className={styles.topicsHeading}>Topics</h3>
            <ul className={styles.topicsList}>
              {topics.map((topic) => (
                <li key={topic.name}>
                  <button
                    className={`${styles.topicBtn} ${
                      activeTopic === topic.name ? styles.topicBtnActive : ""
                    }`}
                    onClick={() => {
                      playClickSound();
                      setActiveTopic(
                        topic.name === activeTopic ? null : topic.name
                      );
                    }}
                  >
                    <span className={styles.topicName}>{topic.name}</span>
                    <span className={styles.topicCount}>{topic.count}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button className={styles.moreBtn} onClick={playClickSound}>
              More
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="2 4 6 8 10 4" />
              </svg>
            </button>
          </aside>

          {/* ===== RIGHT CONTENT AREA ===== */}
          <section className={styles.contentArea}>
            {/* Filter Bar */}
            <div className={styles.filterBar}>
              <div className={styles.filterScroll}>
                {filters.map((f) => (
                  <button
                    key={f}
                    className={`${styles.filterBtn} ${
                      activeFilter === f ? styles.filterBtnActive : ""
                    }`}
                    onClick={() => {
                      playClickSound();
                      setActiveFilter(f);
                    }}
                  >
                    <span className={styles.filterBtnText}>{f}</span>
                  </button>
                ))}
              </div>
              <button className={styles.scrollArrow} onClick={playClickSound}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 1 7 5 3 9" />
                </svg>
              </button>
            </div>

            {/* Blog Cards */}
            <div className={styles.cardsList}>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <article key={post.id} className={styles.blogCard}>
                    {/* Left: Recessed Illustration Box */}
                    <div className={styles.cardIllustrationBox}>
                      <InlineSVG
                        src={post.illustration}
                        className={styles.illustrationSvg}
                      />
                    </div>

                    {/* Right: Text Content */}
                    <div className={styles.cardTextArea}>
                      <h2 className={styles.cardTitle}>{post.title}</h2>
                      <p className={styles.cardDesc}>{post.description}</p>
                      <div className={styles.cardTags}>
                        {post.tags &&
                          post.tags.map((tag) => (
                            <span key={tag} className={styles.tagPill}>
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button
                      className={`${styles.expandBtn} ${
                        expandedCards[post.id] ? styles.expandBtnOpen : ""
                      }`}
                      onClick={() => toggleCard(post.id)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 5 7 9 11 5" />
                      </svg>
                    </button>
                  </article>
                ))
              ) : (
                <div className={styles.noPostsCard}>
                  <p>No vlogs found matching your criteria.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
