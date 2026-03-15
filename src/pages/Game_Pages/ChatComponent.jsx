import { Send } from "lucide-react";

function ChatComponent() {
  const chats = [
    {
      tag: "Sender",
      message: "Hello how are you",
    },
    {
      tag: "Accepter",
      message: "Hello how are you",
    },
    {
      tag: "Sender",
      message: "Hello how are you",
    },
    {
      tag: "Accepter",
      message: "Hello how are you",
    },
    {
      tag: "Sender",
      message: "Hello how are you",
    },
    {
      tag: "Accepter",
      message: "Hello how are you",
    },
    {
      tag: "Sender",
      message: "Hello how are you",
    },
    {
      tag: "Accepter",
      message: "Hello how are you",
    },
    {
      tag: "Sender",
      message: "Hello how are you",
    },
    {
      tag: "Accepter",
      message: "Hello how are you",
    },
    {
      tag: "Sender",
      message: "Hello how are you",
    },
    {
      tag: "Accepter",
      message: "Hello how are you",
    },
    
    
   
  ];
  return (
    <div className="h-full flex-1 min-h-0  bg shadow-all flex flex-col justify-between p-2 ">
      <ul className="flex flex-1  flex-col gap-2   scrollbar-custom py-2">
        {chats.length > 0 ? (
          chats.map((chat, i) => (
            <li
              key={i}
              className={`${chat.tag === "Sender" ? "flex justify-end " : "flex justify-start"} text-xs  px-3 py-1`}
            >
              <div
                className={`${chat.tag === "Sender" ? "bg-blue-500 text-white" : "bg-green-300 text-black"} px-2 py-1 rounded-2xl`}
              >
                {chat.message}
              </div>
            </li>
          ))
        ) : (
          <div className="h-full border-t-2 border-black  flex items-center justify-center">
            <h1 className="font-bold text-slate-500/40 text-2xl">
              Start Messging
            </h1>
          </div>
        )}
      </ul>
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          placeholder="Message"
          className="text-xs border w-full h-full p-1 outline-none border-slate-500 rounded"
        />
        <Send />
      </div>
    </div>
  );
}

export default ChatComponent;
