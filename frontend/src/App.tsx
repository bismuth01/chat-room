import "./global.css";
import { useState, useEffect, ChangeEvent } from "react";
import { io, Socket } from "socket.io-client";

{
  /*Message interface for message, type can be "your" or "history" */
}
interface Message {
  type: string;
  message: string;
}

function YourMessage(message: string) {
  return (
    <div className="break-words my-2 mr-32 ml-4 border-solid border-2 border-green-400">
      {message}
    </div>
  );
}

function HistoryMessage(message: string) {
  return (
    <div className="break-words my-2 mr-4 ml-32 border-solid border-2 border-gray-500">
      {message}
    </div>
  );
}

interface InputBoxProps {
  socket: Socket | null;
}

function InputBox({ socket }: InputBoxProps) {
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <div className="flex h-32">
      {/*Input box */}
      <textarea
        className="flex-9 rounded-xl my-4 mr-2 ml-4 border-4 border-solid border-black"
        value={inputValue}
        placeholder="Type a message..."
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setInputValue(event.target.value);
        }}
      />
      <button
        className="bg-blue-500 text-white flex-1 cursor-pointer rounded-full my-4 ml-2 mr-4"
        onClick={() => {
          if (inputValue.trim() && socket) {
            socket.emit("message", inputValue);
            setInputValue("");
          }
        }}
      >
        Send
      </button>
    </div>
  );
}

function ChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("add_message", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const history = messages.map((message: Message) => {
    if (message.type === "history") {
      return HistoryMessage(message.message);
    } else if (message.type === "your") {
      return YourMessage(message.message);
    }
    return null;
  });

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Flex box container for chat history and input box */}
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        {/*Chat history messages */}
        {history}
      </div>
      <InputBox socket={socket} />
    </div>
  );
}

function App() {
  return (
    <>
      <ChatHistory />
    </>
  );
}

export default App;
