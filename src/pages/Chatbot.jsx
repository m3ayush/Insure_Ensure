import { useState } from "react";
import Navbar from "../components/Navbar";
import ChatWindow from "../components/chatbot/ChatWindow";
import DocumentChatWindow from "../components/chatbot/DocumentChatWindow";
import TabSwitcher from "../components/chatbot/TabSwitcher";

export default function Chatbot() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "general" ? <ChatWindow /> : <DocumentChatWindow />}
    </div>
  );
}
