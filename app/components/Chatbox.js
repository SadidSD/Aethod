"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import styles from "./Chatbox.module.css";

export default function Chatbox() {
  const {
    isChatOpen,
    chatQuery,
    setChatQuery,
    chatMessages,
    isTyping,
    toggleChat,
    sendMessage,
  } = useChat();

  const [inputVal, setInputVal] = useState("");
  const viewportRef = useRef(null);

  // Sync input value with chatQuery state (for search bar sync)
  useEffect(() => {
    setInputVal(chatQuery);
  }, [chatQuery]);

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  if (!isChatOpen) {
    // Render only the floating toggle button when chatbox is closed
    return (
      <button
        className={styles.floatingAssistantBtn}
        onClick={toggleChat}
        aria-label="Open AI Assistant"
      >
        <img
          src="/chatbox/Button.svg"
          alt="Open AI Assistant"
          className={styles.closeBtnIcon}
        />
      </button>
    );
  }

  const handleSend = () => {
    if (inputVal.trim()) {
      sendMessage(inputVal);
      setInputVal("");
      setChatQuery("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSuggestionClick = (query) => {
    sendMessage(query);
  };

  return (
    <>
      {/* Chatbox Container Panel */}
      <div className={styles.chatboxPanel} id="chatbox-panel">
        {/* Main Message Viewport */}
        <div className={styles.messageViewport} ref={viewportRef}>
          {chatMessages.length === 0 ? (
            /* Welcome / Prompt View */
            <div className={styles.welcomeContainer}>
              <img
                src="/chatbox/Motion.svg"
                alt="Core Architecture Node"
                className={styles.orbImage}
              />
              <h2 className={styles.welcomeTitle}>
                Core <span className={styles.titleHighlight}>Architecture Node</span>
              </h2>
              <p className={styles.welcomeDesc}>
                Data exists, clarity doesn’t. Use this dedicated node to bypass
                administrative overhead and interface directly with Aethod’s
                engineered insights.
              </p>
            </div>
          ) : (
            /* Active Chat Messages */
            <div className={styles.messagesList}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.sender === "user"
                      ? styles.userMsgRow
                      : styles.smithMsgRow
                  }
                >
                  {msg.sender === "smith" && (
                    <img
                      src="/chatbox/Motion.svg"
                      alt="Smith"
                      className={styles.smithAvatar}
                    />
                  )}
                  <div
                    className={
                      msg.sender === "user"
                        ? styles.userBubble
                        : styles.smithBubble
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={styles.smithMsgRow}>
                  <img
                    src="/chatbox/Motion.svg"
                    alt="Smith"
                    className={styles.smithAvatar}
                  />
                  <div className={styles.smithBubble}>
                    <span className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Bar Section */}
        <div className={styles.inputBarWrapper}>
          <div className={styles.inputBarContainer}>
            <button className={styles.addBtn} aria-label="Add attachment">
              <img src="/chatbox/add-btn.svg" alt="Add" className={styles.addBtnImg} />
            </button>

            <div className={styles.chatInputWrapper}>
              {/* SVG background — search icon + gradient placeholder text, pointer-events none so input works */}
              <img
                src="/chatbox/tEXT-ASK.svg"
                alt=""
                className={styles.textAskBg}
                aria-hidden="true"
              />
              {/* Actual functional input overlaid on top */}
              <input
                type="text"
                className={`${styles.chatInput} ${inputVal ? styles.hasText : ""}`}
                placeholder=""
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className={styles.inputRight}>
              <div className={styles.modeSelector}>
                <img src="/chatbox/mode-text.svg" alt="Mode" className={styles.modeImg} />
              </div>

              <button className={styles.micBtn} aria-label="Voice input">
                <img src="/chatbox/voice-btn.svg" alt="Mic" className={styles.micBtnImg} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Suggestions + Close Button */}
        <div className={styles.bottomRow}>
          {/* Suggestions Bar */}
          <div className={styles.suggestionsContainer}>
            <div className={styles.suggestionsRow1}>
              <button
                className={styles.suggestionPill}
                onClick={() =>
                  handleSuggestionClick(
                    "What parameters determine the final cost of my custom system?"
                  )
                }
              >
                What parameters determine the final cost of my custom system?
              </button>
            </div>
            <div className={styles.suggestionsRow2}>
              <button
                className={styles.suggestionPill}
                onClick={() => handleSuggestionClick("About Aeethod")}
              >
                About Aeethod
              </button>
              <button
                className={styles.suggestionPill}
                onClick={() =>
                  handleSuggestionClick(
                    "What happens if my project scope changes?"
                  )
                }
              >
                What happens if my project scope changes?
              </button>
            </div>
          </div>

          {/* Inside Toggle / Close Button */}
          <button
            className={styles.chatboxCloseBtn}
            onClick={toggleChat}
            aria-label="Close Chat"
          >
            <img
              src="/chatbox/Button.svg"
              alt="Close"
              className={styles.closeBtnIcon}
            />
          </button>
        </div>
      </div>
    </>
  );
}
