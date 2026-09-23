'use client';

import HomeButton from './HomeButton';
import styles from './ConversationCtaSection.module.css';

export default function ConversationCtaSection() {
  const handleStartConversation = () => {
    try {
      const audio = new Audio('/touchpad sd.mp3');
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore audio error */
    }
    window.location.href = '/contact';
  };

  return (
    <section className={styles.section} id="conversation" aria-label="Start a conversation with Aeethod">
      <div className={styles.container}>
        {/* Subtle Eyebrow Tag */}
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          <span className={styles.eyebrowText}>NEXT STAGE ARCHITECTURE</span>
        </div>

        {/* Main Headline */}
        <h2 className={styles.heading}>
          Have you outgrown your{' '}
          <span className={styles.highlight}>platform?</span>
        </h2>

        {/* Narrative Sublines */}
        <div className={styles.sublineWrapper}>
          <p className={styles.subline}>Tell us what&apos;s no longer working.</p>
          <p className={styles.subline}>We&apos;ll help you figure out what should come next.</p>
        </div>

        {/* Hero-style Action Button */}
        <div className={styles.ctaWrapper}>
          <HomeButton
            variant="purple"
            text="Start a conversation"
            className={styles.conversationBtn}
            onClick={handleStartConversation}
          />
        </div>
      </div>
    </section>
  );
}
