import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { uploadDocument, sendDocumentQuestion } from "../../utils/documentChatApi";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import DocumentUploadZone from "./DocumentUploadZone";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Welcome to the Document Scanner! Upload an insurance document (JPG, PNG, or PDF) and I'll help you understand its contents. You can ask me questions about policy terms, coverage, exclusions, and more.",
  timestamp: Date.now(),
};

export default function DocumentChatWindow() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setError("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Uploaded: ${file.name}`, timestamp: Date.now() },
    ]);

    try {
      const data = await uploadDocument(currentUser.uid, file);
      setSessionId(data.sessionId);
      setUploadedFileName(data.fileName);
      setSuggestedQuestions(data.suggestedQuestions || []);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've processed your document **${data.fileName}**. Here's a preview:\n\n${data.documentSummary}\n\nFeel free to ask me any questions about this document!`,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.message || "Failed to process the document. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    }

    setIsUploading(false);
  };

  const handleRemoveDocument = () => {
    setSessionId(null);
    setUploadedFileName(null);
    setSuggestedQuestions([]);
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setError("");
  };

  const handleSend = async (text) => {
    const message = (text || input).trim();
    if (!message || isLoading) return;

    if (!sessionId) {
      setError("Please upload a document first");
      return;
    }

    setInput("");
    setError("");
    setSuggestedQuestions([]);

    const userMsg = { role: "user", content: message, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Build conversation history (last 10 messages, excluding welcome)
    const history = [...messages, userMsg]
      .filter((m) => m !== WELCOME_MESSAGE)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const data = await sendDocumentQuestion(currentUser.uid, sessionId, message, history);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, timestamp: Date.now() },
      ]);
    } catch (err) {
      // If session expired, reset upload state
      if (err.message.includes("expired") || err.message.includes("upload")) {
        setSessionId(null);
        setUploadedFileName(null);
      }
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

  const showSuggestions = suggestedQuestions.length > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex-shrink-0">
        <p className="text-xs text-amber-800 text-center">
          <span className="font-semibold">Disclaimer:</span> Document analysis is for educational
          purposes only. Verify all extracted information with the original document.
        </p>
      </div>

      {/* Document Upload Zone */}
      <DocumentUploadZone
        onFileSelect={handleFileUpload}
        isUploading={isUploading}
        uploadedFileName={uploadedFileName}
        onRemoveDocument={handleRemoveDocument}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
        ))}
        {(isLoading || isUploading) && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {showSuggestions && (
        <div className="flex-shrink-0 px-4 pb-2 flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3">
        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={sessionId ? "Ask about your document..." : "Upload a document to start asking questions..."}
            maxLength={800}
            disabled={isLoading || !sessionId}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm disabled:bg-gray-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim() || !sessionId}
            className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
