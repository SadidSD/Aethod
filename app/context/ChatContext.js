"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const openChat = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const getSmithReply = (query) => {
    const q = query.toLowerCase();
    
    // Greeting
    if (q === "hi" || q === "hello" || q === "hey" || q.includes("how are you")) {
      return "Hello! I am Smith, the Aeethod Core Architecture Node. How can I assist you with your TCG commerce platform, inventory synchronization, or store automation today?";
    }
    
    // How will you solve my problem
    if (q.includes("solve") || q.includes("problem")) {
      return "At Aeethod, we solve TCG retailer operational bottlenecks by: 1) Engineering custom headless commerce platforms to escape marketplace commission decay, 2) Deploying sub-second omnichannel inventory synchronization across TCGplayer, eBay, and POS, and 3) Automating algorithmic repricing and live buylist ingestion pipelines.";
    }

    // About Aeethod
    if (q.includes("about") || q.includes("aeethod") || q.includes("who are you") || q.includes("what is this")) {
      return "Aeethod is a specialized technology studio engineering custom commerce platforms, multi-channel marketplace inventory synchronization, automated buylist systems, and algorithmic repricing infrastructure for Trading Card Game (TCG) retailers outgrowing their marketplaces.";
    }

    // Cost / Pricing
    if (q.includes("cost") || q.includes("parameter") || q.includes("final cost") || q.includes("price") || q.includes("pricing") || q.includes("fee")) {
      return "Our TCG platform and engineering investments are structured around: 1) Catalog SKU complexity and multi-variant volume, 2) Multi-channel synchronization endpoints (TCGplayer, eBay, Shopify, POS), and 3) Custom buylist or algorithmic pricing automation needs.";
    }

    // Scope change
    if (q.includes("scope") || q.includes("change") || q.includes("project scope")) {
      return "Aeethod systems are architected modularly. As your card catalog expands or new marketplace channels emerge, our infrastructure scales with minimal friction to support your store's growth.";
    }

    // Services / Capabilities
    if (q.includes("services") || q.includes("what do you do") || q.includes("capabilities") || q.includes("offer")) {
      return "Our core services for TCG retailers include: 1) Custom TCG Commerce Platforms (high-speed card filtering, decklist pasting, sovereign checkout), 2) Multi-Marketplace Sync (sub-second stock arbitration between TCGplayer and eBay), 3) Automated Buylist Systems (real-time cash/credit valuation), and 4) Algorithmic Repricing & AI Automation.";
    }

    // Team / Founders
    if (q.includes("team") || q.includes("founder") || q.includes("who built") || q.includes("people")) {
      return "Aeethod was founded by systems architects and e-commerce engineers dedicated to building high-performance sovereign technology for trading card game retailers.";
    }

    // Contact
    if (q.includes("contact") || q.includes("support") || q.includes("email") || q.includes("reach") || q.includes("phone")) {
      return "You can reach our engineering team directly via the Contact page on our website, or by sending an inquiry to support@aeethod.com. We look forward to discussing your custom system deployment.";
    }

    // Tech Stack
    if (q.includes("tech") || q.includes("stack") || q.includes("technology") || q.includes("built with")) {
      return "Our systems leverage modern web technologies (Next.js, React, Node.js), robust database solutions, and state-of-the-art AI models. They are custom-engineered for security, scalability, and sub-second decision latency.";
    }

    // Timeline / Duration
    if (q.includes("timeline") || q.includes("duration") || q.includes("how long") || q.includes("time")) {
      return "Deployment timelines depend on architectural scope. A standard custom integration typically ranges from 4 to 8 weeks, including design, development, pipeline integration, and rigorous verification phases.";
    }

    // Default reply
    return `Query processed by Core Node. I have received your inputs: "${query}". We can customize this system to address your specific operational requirements. For detailed integration discussions, please contact our engineered support team at support@aeethod.com.`;
  };

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;

    // Add user message.
    const userMsg = { id: Date.now(), sender: "user", text };
    
    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate reply delay
    setTimeout(() => {
      const replyText = getSmithReply(text);
      const replyMsg = { id: Date.now() + 1, sender: "smith", text: replyText };
      setChatMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
    }, 1000);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        chatQuery,
        setChatQuery,
        chatMessages,
        isTyping,
        openChat,
        closeChat,
        toggleChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
