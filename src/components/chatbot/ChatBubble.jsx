function formatContent(text) {
  // Split into paragraphs and handle basic formatting
  return text.split("\n").map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Bullet points
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
      return (
        <li key={i} className="ml-4 list-disc">
          {parts}
        </li>
      );
    }

    if (trimmed === "") return <br key={i} />;

    return (
      <p key={i} className="mb-1">
        {parts}
      </p>
    );
  });
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatBubble({ role, content, timestamp }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-600 text-white rounded-lg rounded-br-sm"
            : "bg-white text-gray-800 rounded-lg rounded-bl-sm shadow-sm border border-gray-100"
        }`}
      >
        <div className={isUser ? "" : "prose-sm"}>{isUser ? content : formatContent(content)}</div>
        {timestamp && (
          <p className={`text-[10px] mt-1.5 ${isUser ? "text-indigo-200" : "text-gray-400"}`}>
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
