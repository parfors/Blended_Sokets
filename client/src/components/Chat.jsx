import io from "socket.io-client";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import axios from "axios";

const socket = { current: io("http://localhost:3001") };

export default function Chat() {
  const [currentUser, setCurrentUser] = useState({ name: "", id: nanoid() });
  const [message, setMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(1);

  useEffect(() => {
    console.log("first");
    axios.get("http://localhost:3001/").then(({ data }) => setMessages(data));
    socket.current.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });
  }, []);

  useEffect(() => {
    socket.current.on("onlineMessage", (data) => {
      console.log(messages);
      setMessages([data, ...messages]);
    });
  }, [messages]);

  const clickHandler = (e) => {
    e.preventDefault();

    socket.current.emit("addUser", currentUser);
    // setOnlineUsers(onlineUsers + 1);
  };

  const messageClickHandler = (e) => {
    e.preventDefault();
    socket.current.emit("sendMessage", {
      name: currentUser.name,
      text: message,
    });
    setMessages([
      {
        name: currentUser.name,
        text: message,
      },
      ...messages,
    ]);
  };

  return (
    <>
      <p>{!!onlineUsers ? onlineUsers : 0}</p>
      {/* <input/> */}
      <form>
        <label>enter name</label>
        <input
          onChange={(e) =>
            setCurrentUser({ name: e.target.value, id: nanoid() })
          }
          value={currentUser.name}
        />
        <button onClick={clickHandler}>Submit</button>
      </form>
      <ul>
        {messages.map((el, index) => (
          <li key={index}>
            <span>{el.name}</span> :<span>{el.text}</span>
          </li>
        ))}
      </ul>
      <form>
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message.text}
        />
        <button onClick={messageClickHandler}>Submit</button>
      </form>
    </>
  );
}
