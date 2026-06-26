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
      return "Hello sir! I am Smith, the Aeethod Core Architecture Node. How can I assist you with your systems and operations today?";
    }
    
    // How will you solve my problem
    if (q.includes("solve") || q.includes("problem")) {
      return "At Aeethod, we solve complex operational problems by: 1) Deploying specialized autonomous subagents to handle targeted tasks, 2) Automating manual workflows with custom engineered pipelines, and 3) Integrating intelligent decision-support engines directly into your tech stack. This eliminates administrative overhead and converts raw inputs into coordinated corporate actions.";
    }

    // About Aeethod
    if (q.includes("about") || q.includes("aeethod") || q.includes("who are you") || q.includes("what is this")) {
      return "Aeethod designs intelligent systems for complex environments. We engineer AI-first architectures, operations automation, and decision support engines to bypass administrative overhead and deliver decisive corporate action.";
    }

    // Cost / Pricing
    if (q.includes("cost") || q.includes("parameter") || q.includes("final cost") || q.includes("price") || q.includes("pricing") || q.includes("fee")) {
      return "Our system costs are determined by: 1) Architectural complexity (data pipelines, model integration), 2) Scale and environment volatility, 3) Level of human-in-the-loop oversight required, and 4) Core computational throughput needs.";
    }

    // Scope change
    if (q.includes("scope") || q.includes("change") || q.includes("project scope")) {
      return "Aeethod systems are architected dynamically. If your operational parameters or project scope change, our core node adapts. We refactor the pipeline integration with minimal friction to align with your updated corporate objectives.";
    }

    // Services / Capabilities
    if (q.includes("services") || q.includes("what do you do") || q.includes("capabilities") || q.includes("offer")) {
      return "Our core services include: 1) Systems Architecture (designing intelligent digital systems), 2) AI-Driven Automation (operational intelligence, decision support, process orchestration), and 3) Applied Research (turning emerging system insights into corporate tools).";
    }

    // Team / Founders
    if (q.includes("team") || q.includes("founder") || q.includes("who built") || q.includes("people")) {
      return "Aeethod was founded by a team of systems architects and AI researchers dedicated to converting operational complexity into coordinated digital action. We build custom-engineered systems for organizations operating under uncertainty.";
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

    // Add user message. If it is the first message, prepend Smith's welcome greeting.
    const userMsg = { id: Date.now(), sender: "user", text };
    
    setChatMessages((prev) => {
      if (prev.length === 0) {
        const welcomeMsg = { id: Date.now() - 10, sender: "smith", text: "Hello sir, how are you?" };
        return [welcomeMsg, userMsg];
      }
      return [...prev, userMsg];
    });
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
