import { useState } from "react";
import Navbar from "../components/Navbar";
import ChatWindow from "../components/chatbot/ChatWindow";
import DocumentChatWindow from "../components/chatbot/DocumentChatWindow";
import TabSwitcher from "../components/chatbot/TabSwitcher";

export default function Chatbot() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen flex flex-col bg-[#e8e4d9] dark:bg-black transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <div className="flex-grow bg-white dark:bg-[#111111] border border-[#111] dark:border-[#333] rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(246,202,125,0.3)] flex flex-col overflow-hidden transition-all duration-300">
          <div className="p-4 sm:p-6 pb-0">
            <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="flex-grow flex flex-col min-h-0 relative">
            {activeTab === "general" ? <ChatWindow /> : <DocumentChatWindow />}
          </div>
        </div>
      </main>
    </div>
  );
}
