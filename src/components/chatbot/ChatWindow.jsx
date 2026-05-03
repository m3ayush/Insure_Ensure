import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { sendChatMessage } from "../../utils/chatApi";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

const SUGGESTED_QUESTIONS = [
  "What is term life insurance?",
  "How does a health insurance claim work?",
  "What tax benefits do insurance policies offer?",
  "What is the difference between term and whole life insurance?",
  "What does co-pay mean in health insurance?",
];

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Welcome to InsureBot! I can help you understand insurance concepts, policy types, terminology, and general procedures. What would you like to know?",
  timestamp: Date.now(),
};

export default function ChatWindow() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const message = (text || input).trim();
    if (!message || isLoading) return;

    setInput("");
    setError("");

    const userMsg = { role: "user", content: message, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Build conversation history (last 10 messages, excluding welcome)
    const history = [...messages, userMsg]
      .filter((m) => m !== WELCOME_MESSAGE)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const data = await sendChatMessage(message, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, timestamp: Date.now() },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.message || "Something went wrong. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Disclaimer */}
      <div className="px-4 py-2 flex-shrink-0 flex justify-center">
        <div className="bg-[#f0eeb4] dark:bg-yellow-900/30 border border-[#111] dark:border-yellow-800/50 rounded-full px-5 py-2.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none">
          <p className="text-xs text-black dark:text-[#f6ca7d] text-center font-bold">
            <span className="font-black">Disclaimer:</span> This chatbot provides general
            insurance education only. It is not legal, financial, or medical advice. Consult a
            licensed advisor for specific guidance.
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {showSuggestions && (
        <div className="flex-shrink-0 px-4 pb-2 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs font-bold bg-[#e8e4d9] dark:bg-[#111] text-black dark:text-[#f6ca7d] border border-[#111] dark:border-[#333] px-5 py-2.5 rounded-full hover:bg-white dark:hover:bg-[#222] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-[2px_2px_0px_0px_rgba(246,202,125,0.3)]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="flex-shrink-0 p-4 pt-2">
        {error && <p className="text-xs text-red-500 mb-2 px-2">{error}</p>}
        <div className="flex items-center gap-2 bg-white dark:bg-black/20 border border-[#111] dark:border-[#333] p-1.5 rounded-full shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:shadow-none transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about insurance..."
            maxLength={800}
            disabled={isLoading}
            className="flex-1 px-5 py-3 bg-transparent border-none focus:ring-0 outline-none text-sm font-bold text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600 disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-black dark:bg-[#f6ca7d] text-white dark:text-black p-3.5 rounded-full hover:bg-gray-800 dark:hover:bg-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 border border-transparent dark:border-[#111]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
