"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./WorkProjectCard.module.css";

/**
 * Standalone Card Skeleton with exact same dimensions, layout, and paddings
 * to ensure zero layout shift during initial fetch.
 */
export function WorkCardSkeleton() {
  return (
    <div className={styles.card} aria-busy="true" aria-label="Loading project card">
      {/* 1. Minimal Browser-Window Header */}
      <div className={styles.browserFrame}>
        <div className={styles.browserHeader}>
          {/* Three subtle pulsing browser dots */}
          <div className={styles.browserDots} aria-hidden="true">
            <span className={`${styles.browserDot} ${styles.dotPulsing}`} />
            <span className={`${styles.browserDot} ${styles.dotPulsing}`} />
            <span className={`${styles.browserDot} ${styles.dotPulsing}`} />
          </div>

          {/* Domain Placeholder */}
          <div className={styles.browserDomainPill}>
            <div className={styles.skeletonDomainBar} />
          </div>
        </div>

        {/* Hero Screenshot Placeholder */}
        <div className={styles.browserImageLink}>
          <div className={styles.skeletonHero}>
            <div className={styles.skeletonShimmer} />
          </div>
        </div>
      </div>

      {/* 2. Card Info Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.footerLeft}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarSkeleton}>
                <div className={styles.skeletonShimmer} />
              </div>
            </div>
            <div className={styles.skeletonYearBar} />
          </div>

          <div className={styles.projectInfo}>
            <div className={styles.skeletonTitleBar} />
            <div className={styles.tagsRow}>
              <div className={styles.skeletonTagBar} style={{ width: 44 }} />
              <div className={styles.skeletonTagBar} style={{ width: 74 }} />
              <div className={styles.skeletonTagBar} style={{ width: 62 }} />
            </div>
          </div>
        </div>

        <div className={styles.footerRight}>
          <div className={styles.verticalDivider} aria-hidden="true" />
          <div className={styles.skeletonLinkBar} />
        </div>
      </div>
    </div>
  );
}

export default function WorkProjectCard({ work, priority = false, playClickSound }) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const imgRef = useRef(null);
  const avatarRef = useRef(null);

  // If image is already in browser cache on mount, show immediately with zero delay
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
    if (avatarRef.current?.complete && avatarRef.current.naturalWidth > 0) {
      setAvatarLoaded(true);
    }
  }, []);

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
    if (liveUrl === "#") {
      e.preventDefault();
    }
    if (playClickSound) playClickSound();
  };

  const handleImageLinkClick = (e) => {
    e.stopPropagation();
    if (playClickSound) playClickSound();
  };

  // Extract domain or fallback
  const domainText = work.domain || (work.link ? work.link.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : "project.com");
  const yearText = work.year || "2026";
  const tagsList = work.tags || (work.filters ? work.filters.filter(f => f !== "All") : []);
  const liveUrl = work.link || "#";

  // Modern WebP asset with PNG fallback
  const webpImage = work.image ? work.image.replace(/\.(png|jpe?g)$/i, ".webp") : null;
  const fallbackImage = work.image ? work.image.replace(/\.webp$/i, ".png") : null;

  const webpAvatar = work.avatar ? work.avatar.replace(/\.(png|jpe?g)$/i, ".webp") : null;
  const fallbackAvatar = work.avatar ? work.avatar.replace(/\.webp$/i, ".png") : null;

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
          {/* Three small browser dots with subtle pulse during loading */}
          <div className={styles.browserDots} aria-hidden="true">
            <span className={`${styles.browserDot} ${!imageLoaded ? styles.dotPulsing : ""}`} />
            <span className={`${styles.browserDot} ${!imageLoaded ? styles.dotPulsing : ""}`} />
            <span className={`${styles.browserDot} ${!imageLoaded ? styles.dotPulsing : ""}`} />
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
          onClick={handleImageLinkClick}
          aria-label={`Open ${work.name} Case Study`}
        >
          {/* Skeleton Hero Placeholder - smooth 280ms crossfade out when image is loaded */}
          <div 
            className={`${styles.skeletonHero} ${imageLoaded ? styles.skeletonHeroFaded : ""}`} 
            aria-hidden="true"
          >
            <div className={styles.skeletonShimmer} />
          </div>

          {work.image && (
            <picture className={styles.pictureWrapper}>
              {webpImage && <source srcSet={webpImage} type="image/webp" />}
              <img
                ref={imgRef}
                src={fallbackImage || work.image}
                alt={`${work.name} preview`}
                className={`${styles.browserImage} ${imageLoaded ? styles.imageLoaded : ""}`}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                style={work.objectPosition ? { objectPosition: work.objectPosition } : undefined}
              />
            </picture>
          )}
        </Link>
      </div>

      {/* 2. Card Info Footer */}
      <div className={styles.cardFooter}>
        {/* Left Side: Avatar, Year, Title, Category Tags */}
        <div className={styles.footerLeft}>
          {/* Logo & Year Column */}
          <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper}>
              <div 
                className={`${styles.avatarSkeleton} ${avatarLoaded ? styles.avatarSkeletonFaded : ""}`} 
                aria-hidden="true"
              >
                <div className={styles.skeletonShimmer} />
              </div>
              {work.avatar && (
                <picture className={styles.pictureWrapper}>
                  {webpAvatar && <source srcSet={webpAvatar} type="image/webp" />}
                  <img
                    ref={avatarRef}
                    src={fallbackAvatar || work.avatar}
                    alt={`${work.name} logo`}
                    className={`${styles.avatar} ${avatarLoaded ? styles.avatarLoaded : ""}`}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    onLoad={() => setAvatarLoaded(true)}
                  />
                </picture>
              )}
            </div>
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
            target={liveUrl === "#" ? undefined : "_blank"}
            rel={liveUrl === "#" ? undefined : "noopener noreferrer"}
            className={styles.viewProjectLink}
            onClick={handleLiveLinkClick}
            title={liveUrl === "#" ? "Project in development" : `Open ${work.name} live website in new tab`}
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
