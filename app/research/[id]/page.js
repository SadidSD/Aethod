"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import styles from "./essay.module.css";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const essaysContent = {
  "clarity-gap": {
    title: "The Clarity Gap",
    subtitle: "Why more data produces less understanding",
    date: "April 2026",
    readTime: "18 min read",
    tag: "Research",
    tagType: "green",
    content: `
      <h2>1. The Paradox of Abundance</h2>
      <p>Modern enterprises are drowning in telemetry. We measure page load times, mouse movement heatmaps, SQL query execution plans, and API response micro-intervals. Yet, as the volume of dashboard metrics grows exponentially, the strategic clarity required to make critical decisions decreases. We call this the Clarity Gap.</p>
      <p>When every team has their own telemetry dashboard, the organization lacks a single source of truth. Minor fluctuations in arbitrary metrics are treated as critical incidents, while systemic design flaws go unnoticed. The solution is not more data, but better structured data representation.</p>

      <h2>2. Noise-to-Signal Ratios in Dashboards</h2>
      <p>Data without architecture is simply noise. A systems-first approach to reporting prioritizes outcomes over activities. Instead of displaying CPU utilization percentages in isolation, we map telemetry directly to user journey friction points. For instance, how does database CPU throttling correlate with user drop-off in the checkout funnel?</p>
      <blockquote>"Stable systems are designed with high-signal gates that filter out operational noise before it reaches decision makers."</blockquote>

      <h2>3. Designing High-Signal Dashboards</h2>
      <p>To bridge the clarity gap, design dashboards with clear, hierarchical telemetry:
      <ul>
        <li><strong>Primary Outcomes:</strong> Top-level metrics indicating system health (e.g., complete checkout completion rate).</li>
        <li><strong>Secondary Indicators:</strong> Critical dependencies (e.g., API latency, payment processor success rate).</li>
        <li><strong>Diagnostic telemetry:</strong> Detailed system level logs reserved only for debugging phases.</li>
      </ul>
      By locking focus onto these core signals, engineering and business teams maintain alignment and move forward with absolute clarity.</p>
    `
  },
  "designing-uncertainty": {
    title: "Designing for Uncertainty",
    subtitle: "A framework for adaptive business systems",
    date: "December 2025",
    readTime: "10 min read",
    tag: "System",
    tagType: "blue",
    content: `
      <h2>1. The Myth of the Static System</h2>
      <p>Software architectures are often built on the assumption that requirements will remain stable once specified. This is a fundamental mistake. In commerce and systems engineering, market realities, user behaviors, and API dependencies are in a constant state of flux. Designing a system means designing for change.</p>
      <p>Stable systems are not rigid fortresses; they are flexible frameworks that adapt to uncertainty. We achieve this resilience through strict modularity and clean interface separation.</p>

      <h2>2. Modular Design Patterns</h2>
      <p>By decoupling core systems logic from third-party integrations, we ensure that an update to an external dependency does not bring down the entire application. The adapter pattern allows us to wrap payment processors, inventory management systems, and shipping APIs in a uniform interface:
      <ul>
        <li><strong>Decoupled Core:</strong> Business rules exist independently of delivery mechanisms.</li>
        <li><strong>Adapter Layer:</strong> Standardizes inputs and outputs across all vendors.</li>
        <li><strong>Interchangeable Modules:</strong> Swapping a service provider requires zero modifications to the core application logic.</li>
      </ul>
      This pattern prevents vendor lock-in and isolates failure points, ensuring continuous system uptime.</p>

      <h2>3. Resilience Under Pressure</h2>
      <p>When things break (and they will), the system should degrade gracefully rather than crash. Implementing circuit breakers, fallbacks, and offline-first queue syncing allows business operations to continue even when external APIs go dark. This is the cornerstone of systems resilience.</p>
    `
  },
  "inside-tcg-pricing": {
    title: "Inside TCG Pricing",
    subtitle: "How market fragmentation creates operational chaos",
    date: "February 2026",
    readTime: "7 min read",
    tag: "Case Study",
    tagType: "gray",
    content: `
      <h2>1. The Trading Card Game Market Challenge</h2>
      <p>The collectibles market, particularly Trading Card Games (TCG), suffers from extreme pricing fragmentation. Value is driven by player demand, card condition, tournament results, and regional scarcity. With dozens of marketplaces reporting distinct price points, manual price management is impossible.</p>
      <p>Retailers who cannot synchronize pricing in real-time face massive arbitrage losses from automated buying bots during high-velocity price spikes.</p>

      <h2>2. Real-Time Index Aggregation</h2>
      <p>Our solution implements a real-time price indexing engine that aggregates pricing feeds from major platforms (eBay, TCGPlayer, Cardmarket) and filters out statistical outliers. This index forms a dynamic baseline price that updates every few seconds.</p>
      <p>By utilizing WebSockets and high-throughput queues, retailers can sync their inventories across multiple channels concurrently, matching market price movements instantly.</p>

      <h2>3. Results and Operational Efficiency</h2>
      <p>Deploying automated price indexing engines eliminates manual spreadsheet updates and reduces arbitrage losses to zero. Store owners can focus on inventory acquisition and fulfillment, confident that their margins are protected by real-time data integration.</p>
    `
  },
  "multi-agent-ecosystem": {
    title: "Multi-Agent E-Commerce Ecosystem Architectures",
    subtitle: "A study on decentralized artificial intelligence in retail pipelines",
    date: "April 2026",
    readTime: "18 min read",
    tag: "Research",
    tagType: "green",
    content: `
      <h2>1. The Rise of Agentic Commerce</h2>
      <p>Traditional e-commerce pipelines rely on linear, cron-based automation scripts. These rigid pathways struggle to handle unpredictable variables like supplier delays, sudden price fluctuations, and dynamic ad performance. Multi-agent systems introduce autonomous, conversational intelligence to solve these challenges.</p>
      <p>Instead of a single monolithic script, we design a network of specialized, self-correcting agents working collaboratively to optimize the entire commerce pipeline.</p>

      <h2>2. Specialized Agent Roles</h2>
      <p>Our decentralized ecosystem consists of four main agents:
      <ul>
        <li><strong>Inventory Agent:</strong> Monitors stock levels, forecasts demand, and automatically drafts purchase orders.</li>
        <li><strong>Pricing Agent:</strong> Analyzes competitor prices, marketplace indexes, and margin goals to adjust SKU prices dynamically.</li>
        <li><strong>Frontend Agent:</strong> Adjusts product sorting, banners, and layout structures based on real-time conversion signals.</li>
        <li><strong>Coordination Agent:</strong> Acts as the orchestrator, passing messages between agents and logging system actions for human review.</li>
      </ul>
      Each agent operates within its own sandbox, communicating via a message broker to resolve pipeline issues without human intervention.</p>

      <h2>3. Safety Boundaries and Human-in-the-Loop</h2>
      <p>Autonomy must be bound by guardrails. The Coordination Agent enforces strict pricing and order boundaries. If an agent proposes an action outside these parameters, the execution halts, and a notification is sent to the human operator for approval. This guarantees operational safety while reaping the efficiency gains of agentic networks.</p>
    `
  },
  "predictive-latency": {
    title: "Predictive Latency in Scalable Systems",
    subtitle: "Technical breakdown of cache prefetching, speculative execution, and edge state hydration",
    date: "April 2026",
    readTime: "18 min read",
    tag: "Research",
    tagType: "green",
    content: `
      <h2>1. The Cost of Latency</h2>
      <p>In modern web applications, milliseconds cost millions. Users expect instantaneous transitions and real-time responsiveness. However, database round-trips, network handshake overheads, and complex rendering operations introduce inevitable latency. Predictive latency addresses this challenge by guessing user actions before they occur.</p>
      <p>By pre-fetching assets, caching database results speculatively, and dynamically hydrating edge states, we create an interface that feels faster than the network itself.</p>

      <h2>2. Speculative Execution and Caching</h2>
      <p>We analyze user interaction history to build a predictive model. If a user hovers over a menu item for more than 80ms, the system initiates a background fetch for that route's data. By the time the user clicks, the content is already cached locally and renders instantly.</p>
      <blockquote>"Predictive caching shifts the cost of latency from the user's action to their idle time."</blockquote>

      <h2>3. Edge Hydration Strategies</h2>
      <p>Leveraging edge compute nodes (such as Vercel or Cloudflare Workers) allows us to render page templates close to the user, while asynchronously fetching dynamic database entries. The static shell is delivered immediately, and dynamic data is hydrated seamlessly without page jumps or visible loading spinners.</p>
    `
  }
};

export default function EssayDetailPage() {
  const { id } = useParams();
  const { isDark } = useTheme();
  
  const essay = essaysContent[id];

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio("/touchpad sd.mp3");
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }, []);

  const renderSubtitle = (subtitle) => {
    const highlights = [
      "less understanding",
      "adaptive business systems",
      "fragmentation creates operational chaos",
      "decentralized artificial intelligence in retail pipelines",
      "cache prefetching, speculative execution, and edge state hydration"
    ];
    const matchedHighlight = highlights.find((h) => subtitle.includes(h));
    if (matchedHighlight) {
      const parts = subtitle.split(matchedHighlight);
      return (
        <>
          {parts[0]}
          <span>{matchedHighlight}</span>
          {parts[1]}
        </>
      );
    }
    return subtitle;
  };

  if (!essay) {
    return (
      <div className={styles.notFoundContainer} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
        <h1 className={styles.notFoundTitle}>Essay Not Found</h1>
        <p className={styles.notFoundDesc}>The requested research blueprint could not be located.</p>
        <Link href="/research" className={styles.backLink} onClick={playClickSound}>
          Back to Research
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper} data-theme={isDark ? "dark" : "light"} suppressHydrationWarning={true}>
      <Navbar activePage="research" />
      
      <main className={styles.mainContainer}>
        <Link href="/research" className={styles.backLink} onClick={playClickSound}>
          ← Back to Research
        </Link>
        
        <article className={styles.essayHeader} suppressHydrationWarning={true}>
          <div className={styles.headerMeta} suppressHydrationWarning={true}>
            <span className={`${styles.tagPill} ${styles[`tagPill_${essay.tagType}`]}`}>
              {essay.tag}
            </span>
            <span className={styles.dateText}>{essay.date}</span>
            <span className={styles.readTime}>• {essay.readTime}</span>
          </div>
          
          <h1 className={styles.essayTitle}>{essay.title}</h1>
          <h2 className={styles.essaySubtitle}>{renderSubtitle(essay.subtitle)}</h2>
        </article>
        
        <div className={styles.divider} />
        
        <div 
          className={styles.essayBody}
          dangerouslySetInnerHTML={{ __html: essay.content }}
          suppressHydrationWarning={true}
        />
      </main>
      
      <Footer />
    </div>
  );
}
