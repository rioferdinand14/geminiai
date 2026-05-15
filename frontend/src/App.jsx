import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App(){
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  async function sendMessage(e) {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message
    };

    setChat((prevChat) => [...prevChat, userMessage]);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          convo: [userMessage],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      const botMessage = {
        role: "bot",
        text: data.result,
      };

      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        role: "bot",
        text: error.message,
      };

      setChat((prevChat) => [...prevChat, errorMessage]);
    }
  }

  return (
  <div className="app">
    <div className="chat-container">
      <h1 className="chat-title">TEaCH</h1>
      <p className="chat-subtitle">
        Tech Teacher
      </p>

      <div className="chat-box">
        {chat.map((item, index) => (
          <div key={index} className={`message ${item.role}`}>
            <strong>{item.role === "user" ? "Anda" : "Bot"}</strong>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Tech Teacher"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
);
}

export default App
