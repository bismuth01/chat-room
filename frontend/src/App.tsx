import "./global.css";
import { useState, useEffect, ChangeEvent } from "react";
import { io, Socket } from "socket.io-client";

interface InputBoxProps {
  socket: Socket | null;
}

function InputBox({ socket }: InputBoxProps) {
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <div className="flex border-red-500 border-5 h-32">
      {/*Input box */}
      <textarea
        className="flex-9"
        value={inputValue}
        placeholder="Type a message..."
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setInputValue(event.target.value);
        }}
      />
      <button
        className="bg-blue-500 text-white flex-1 cursor-pointer"
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
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("add_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const history = messages.map((message, index) => (
    <div className="break-words" key={index}>
      {message}
    </div>
  ));

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
