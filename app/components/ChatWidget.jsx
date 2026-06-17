"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "model",
      text: "Hi! I'm AiDigital Bot, your growth assistant. Ask me anything about our digital marketing, web development packages, or Razorpay pricing plans!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "What packages do you offer?",
    "How do I purchase a plan?",
    "Can I customize a plan?",
    "Is payment secure?"
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    if (!textToSend) setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { sender: "model", text: data.text }]);
      } else {
        setMessages(prev => [...prev, { sender: "model", text: "Sorry, I had trouble processing that request." }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { sender: "model", text: "Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div className="ai-chat-widget-wrapper">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button className="chat-trigger-btn" onClick={() => setIsOpen(true)} aria-label="Open support chat">
          <svg className="chat-icon-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
          <span className="notification-ping"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window-container">
          {/* Header */}
          <div className="chat-window-header">
            <div className="bot-header-info">
              <div className="bot-avatar-active">
                <span>AI</span>
              </div>
              <div>
                <h4 className="bot-title">AiDigital Bot</h4>
                <p className="bot-status">Online & ready to grow</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)} aria-label="Minimize support chat">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-messages-area">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message-bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message-bubble bot-bubble typing-indicator-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Section */}
          <div className="quick-questions-scroll">
            {quickQuestions.map((q, i) => (
              <button key={i} className="quick-question-chip" onClick={() => handleSendMessage(q)}>
                {q}
              </button>
            ))}
          </div>

          {/* Input Form Footer */}
          <form
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Ask anything..."
              className="chat-text-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="chat-send-btn" disabled={!inputValue.trim() || isLoading} aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
