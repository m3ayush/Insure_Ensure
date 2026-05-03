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
        className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 text-sm leading-relaxed border ${
          isUser
            ? "bg-black text-white dark:bg-[#f6ca7d] dark:text-black rounded-[1.5rem] rounded-br-[0.5rem] border-transparent dark:border-[#111]"
            : "bg-white text-black dark:bg-[#1a1a1a] dark:text-white rounded-[1.5rem] rounded-bl-[0.5rem] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none border-[#111] dark:border-[#333]"
        }`}
      >
        <div className={`font-bold ${isUser ? "" : "prose-sm prose-black dark:prose-invert"}`}>{isUser ? content : formatContent(content)}</div>
        {timestamp && (
          <p className={`text-[10px] mt-1.5 font-bold ${isUser ? "text-gray-400 dark:text-black/60" : "text-gray-500 dark:text-gray-500"}`}>
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
