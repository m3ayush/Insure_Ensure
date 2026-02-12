import Navbar from "../components/Navbar";
import ChatWindow from "../components/chatbot/ChatWindow";

export default function Chatbot() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <ChatWindow />
    </div>
  );
}
