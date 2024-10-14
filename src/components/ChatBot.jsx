import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Sou seu assistente de dieta saudável. Me diga o que você tem na geladeira e eu vou te ajudar a planejar uma refeição saudável com base nesses ingredientes! Posso sugerir receitas, ajustar porções e oferecer dicas de substituições saudáveis. Se precisar, também posso te ajudar a montar uma lista de compras para completar sua refeição. O que você tem aí hoje? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const cleanBotMessage = (message) => {
    return message.replace(/[*#]/g, "");
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setInput("");

      setIsTyping(true);

      try {
        const response = await axios.post("/api/message", { message: input });

        let botMessageText = response.data.reply;

        botMessageText = cleanBotMessage(botMessageText);

        const botMessage = { text: response.data.reply, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);
      } catch (error) {
        console.error("Error communicating with the bot:", error);
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 rounded-3xl shadow-2xl w-full max-w-md h-[500px] flex flex-col overflow-hidden ">
        <div className="bg-[#aea80c] p-4 flex justify-between items-center ">
          <div className="title text-white">Personal Virtual</div>
          <h2 className="text-white text-sm">@seupersonal </h2>
          <figure className="avatar">
            <img src="/" width="50" height="50" className="rounded-full" />
          </figure>
        </div>

        <div
          className="chat-body flex-1 p-4 overflow-y-auto flex flex-col space-y-2 h-full"
          id="chat"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "bg-black text-white self-end p-2 rounded-lg max-w-xs"
                  : "bg-[#aea80c] text-white self-start p-2 rounded-lg max-w-xs"
              }
            >
              {msg.text}
            </div>
          ))}

          {isTyping && (
            <div className="self-start bg-[#aea80c] text-white p-2 rounded-lg max-w-xs">
              <div className="typing-indicator">
                Digitando
                <span className="dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="bg-[#aea80c]  p-2 flex">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-grow p-2 bg-transparent ring-0 outline-none border border-neutral-800 text-black placeholder-gray-800 text-sm rounded-lg focus:ring-gray-700 placeholder-opacity-50 focus:border-gray-200 w-full p-2.5 checked:bg-gray-800 rounded-md outline-none resize-none mb-4"
            rows="3"
          ></input>
          <button
            onClick={sendMessage}
            className="sendMessage ml-2 bg-[#f0d96d] hover:bg-[#f8efce] font-bold py-2 px-4 rounded-md mb-4"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
