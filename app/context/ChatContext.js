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
    if (q.includes("about") || q.includes("aeethod")) {
      return "Aeethod designs intelligent systems for complex environments. We engineer AI-first architectures, operations automation, and decision support engines to bypass administrative overhead and deliver decisive corporate action.";
    }
    if (q.includes("cost") || q.includes("parameter") || q.includes("final cost")) {
      return "Our system costs are determined by: 1) Architectural complexity (data pipelines, model integration), 2) Scale and environment volatility, 3) Level of human-in-the-loop oversight required, and 4) Core computational throughput needs.";
    }
    if (q.includes("scope") || q.includes("change") || q.includes("project scope")) {
      return "Aeethod systems are architected dynamically. If your operational parameters or project scope change, our core node adapts. We refactor the pipeline integration with minimal friction to align with your updated corporate objectives.";
    }
    return `Query processed. Core Node has received your inputs: "${query}". Insights are being generated. For custom deployments or direct integration, please contact our engineered support team.`;
  };

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;

    // Add user message
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
