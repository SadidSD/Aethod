"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./WorkProjectCard.module.css";

export default function WorkProjectCard({ work, playClickSound }) {
  const router = useRouter();

  if (!work) return null;

  const handleCardClick = (e) => {
    // If the click happened on or inside the live website link, don't trigger case study routing
    if (e.target.closest(`.${styles.viewProjectLink}`)) {
      return;
    }
    if (playClickSound) playClickSound();
    router.push(`/works/${work.id}`);
  };

  const handleLiveLinkClick = (e) => {
    e.stopPropagation();
    if (playClickSound) playClickSound();
  };

  // Extract domain or fallback
  const domainText = work.domain || (work.link ? work.link.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : "project.com");
  const yearText = work.year || "2026";
  const tagsList = work.tags || (work.filters ? work.filters.filter(f => f !== "All") : []);
  const liveUrl = work.link || "#";

  return (
    <div 
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick(e);
        }
      }}
      aria-label={`View ${work.name} case study`}
    >
      {/* 1. Minimal Browser-Window Header + Hero Screenshot */}
      <div className={styles.browserFrame}>
        {/* Browser Header Bar */}
        <div className={styles.browserHeader}>
          {/* Three small browser dots */}
          <div className={styles.browserDots} aria-hidden="true">
            <span className={styles.browserDot} />
            <span className={styles.browserDot} />
            <span className={styles.browserDot} />
          </div>

          {/* Small Domain Pill */}
          <div className={styles.browserDomainPill}>
            <span className={styles.browserDomainText}>{domainText}</span>
          </div>
        </div>

        {/* Hero Screenshot */}
        <Link
          href={`/works/${work.id}`}
          className={styles.browserImageLink}
          onClick={(e) => {
            e.stopPropagation();
            if (playClickSound) playClickSound();
          }}
          aria-label={`Open ${work.name} Case Study`}
        >
          {work.image && (
            <img
              src={work.image}
              alt={`${work.name} preview`}
              className={styles.browserImage}
              style={work.objectPosition ? { objectPosition: work.objectPosition } : undefined}
            />
          )}
        </Link>
      </div>

      {/* 2. Card Info Footer */}
      <div className={styles.cardFooter}>
        {/* Left Side: Avatar, Year, Title, Category Tags */}
        <div className={styles.footerLeft}>
          {/* Logo & Year Column */}
          <div className={styles.avatarContainer}>
            {work.avatar && (
              <img
                src={work.avatar}
                alt={`${work.name} logo`}
                className={styles.avatar}
              />
            )}
            <span className={styles.year}>{yearText}</span>
          </div>

          {/* Name & Tags Column */}
          <div className={styles.projectInfo}>
            <span className={styles.projectName}>{work.name}</span>
            <div className={styles.tagsRow}>
              {tagsList.map((tag, idx) => (
                <span key={idx} className={styles.tagChip}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Divider + "View project ↗" */}
        <div className={styles.footerRight}>
          <div className={styles.verticalDivider} aria-hidden="true" />
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewProjectLink}
            onClick={handleLiveLinkClick}
            title={`Open ${work.name} live website in new tab`}
          >
            <span>View project</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.arrowIcon}
              aria-hidden="true"
            >
              <path
                d="M7 17L17 7M17 17V7H7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
