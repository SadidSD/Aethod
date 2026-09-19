"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminPage() {
  const { isDark } = useTheme();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Form states
  const [contentType, setContentType] = useState("blog");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tagType, setTagType] = useState("purple");
  const [readTime, setReadTime] = useState("");
  const [filtersInput, setFiltersInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    playClickSound();

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      window.location.href = "/yamal19";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    setSuccessMessage("");
    setErrorMessage("");

    // Prepare payload
    let filters = filtersInput
      ? filtersInput.split(",").map((f) => f.trim()).filter((f) => f !== "")
      : [];

    if (contentType === "works" && !filters.includes("All")) {
      filters.unshift("All");
    }

    const payload = {
      type: contentType,
      data: {
        title,
        subtitle,
        description,
        tag: tag || undefined,
        tagType: tagType || undefined,
        readTime: readTime || undefined,
        date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        filters: filters.length > 0 ? filters : undefined
      }
    };

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage(`Successfully posted new entry to ${contentType}!`);
        // Reset form inputs
        setTitle("");
        setSubtitle("");
        setDescription("");
        setTag("");
        setReadTime("");
        setFiltersInput("");
      } else {
        setErrorMessage(result.error || "Failed to submit post");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error occurred");
    }
  };

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      <Navbar activePage="admin" />

      <main className={styles.mainContainer}>
        <div className={styles.contentAlignContainer}>
          {/* ===== DASHBOARD CARD ===== */}
          <div className={styles.dashboardCard}>
            <div className={styles.adminHeaderRow}>
              <Link href="/yamal19/analytics" className={styles.backLink}>
                ← Studio Analytics
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={styles.logoutBtn}
                aria-label="Log out of Admin"
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>

            <h1 className={styles.cardHeading}>Publish Content</h1>
            <p className={styles.cardSubtext}>Post new work case studies, research essays, or blog thoughts</p>

              <form onSubmit={handleSubmit} className={styles.formContainer}>
                {/* Content Type Select */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className={styles.selectField}
                  >
                    <option value="blog">Blog / Vlog Post</option>
                    <option value="research">Research Essay</option>
                    <option value="works">Works Project</option>
                  </select>
                </div>

                {/* Title */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Title</label>
                  <input
                    type="text"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </div>

                {/* Subtitle / Project Subtitle */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Subtitle</label>
                  <input
                    type="text"
                    placeholder="Enter Subtitle or role"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className={styles.inputField}
                  />
                </div>

                {/* Conditionally show fields based on Type */}
                {contentType !== "works" && (
                  <>
                    <div className={styles.formGroupRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.fieldLabel}>Tag (Label)</label>
                        <input
                          type="text"
                          placeholder="e.g. Research, Insight"
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                          className={styles.inputField}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.fieldLabel}>Tag Style</label>
                        <select
                          value={tagType}
                          onChange={(e) => setTagType(e.target.value)}
                          className={styles.selectField}
                        >
                          <option value="green">Green</option>
                          <option value="blue">Blue</option>
                          <option value="gray">Gray</option>
                          <option value="purple">Purple</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.fieldLabel}>Read Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 10 min read"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        className={styles.inputField}
                      />
                    </div>
                  </>
                )}

                {/* Filters Input (for Works or Research categories) */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    Categories / Filters (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Systems, AI + Automation, Recently Uploaded"
                    value={filtersInput}
                    onChange={(e) => setFiltersInput(e.target.value)}
                    className={styles.inputField}
                  />
                </div>

                {/* Description */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Description / Body Summary</label>
                  <textarea
                    placeholder="Enter main text description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textareaField}
                    rows={4}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Publish Live
                </button>
              </form>

              {successMessage && <p className={styles.successText}>{successMessage}</p>}
              {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
