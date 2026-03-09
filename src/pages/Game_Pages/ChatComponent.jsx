function ChatComponent() {
  const chats = [
    {
      tag: "Sender",
      message: "Hi how are you",
    },
    {
      tag: "receiver",
      message: "am fine how are you",
    },
    {
      tag: "Sender",
      message: "Where have you been",
    },
    {
      tag: "receiver",
      message: "i was hospitaziled after turamatized by teketel ",
    },
    {
      tag: "Sender",
      message: "really",
    },
    {
      tag: "Sender",
      message: "Where have you been",
    },
    {
      tag: "receiver",
      message: "i was hospitaziled after turamatized by teketel ",
    },
    {
      tag: "Sender",
      message: "really",
    },
    {
      tag: "Sender",
      message: "Where have you been",
    },
    {
      tag: "receiver",
      message: "i was hospitaziled after turamatized by teketel ",
    },
    {
      tag: "Sender",
      message: "really",
    },
    {
      tag: "Sender",
      message: "Where have you been",
    },
    {
      tag: "receiver",
      message: "i was hospitaziled after turamatized by teketel ",
    },
    {
      tag: "Sender",
      message: "really",
    },
  ];
  return (
    <div className="flex-1 bg shadow-all flex flex-col p-2">
      <ul className="flex flex-col gap-2 bg-slate-200 h-[500px] flex-1 overflow-y-auto">
        {chats.map((chat, i) => (
          <li
            key={i}
            className={`${chat.tag === "Sender" ? "flex justify-end " : "flex justify-start"} text-xs  px-2 py-1`}
          >
            <div
              className={`${chat.tag === "Sender" ? "bg-blue-500 text-white" : "bg-green-300 text-black"} px-2 py-1 `}
            >
              {chat.message}
            </div>
          </li>
        ))}
      </ul>
      <div>input</div>
    </div>
  );
}

export default ChatComponent;
