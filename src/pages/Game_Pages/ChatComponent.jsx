import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function ChatComponent() {
  const [messages, setMessages] = useState([]); // Start empty — no mock data
  const [inputVal, setInputVal] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    setMessages((prev) => [...prev, { tag: "Sender", message: inputVal.trim() }]);
    setInputVal("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-1">
            Room Chat
          </span>
          <h2 className="text-lg font-bold text-gray-900 leading-none">Table talk</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Message List */}
      <div ref={listRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-300 font-semibold text-center">
              No messages yet.<br />Say hello! 👋
            </p>
          </div>
        ) : (
          messages.map((chat, i) => (
            <div
              key={i}
              className={`flex ${chat.tag === "Sender" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  chat.tag === "Sender"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {chat.message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Action Footer */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Message"
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
