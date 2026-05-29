import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import socket from "../../socket";
import { FaSearch } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

function Chat() {
  const { id } = useParams();
  const inputref = useRef();
  const go = useNavigate();

  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState([]);

  const token = localStorage.getItem("token");

  const currentUserId = JSON.parse(localStorage.getItem("user"))._id;
  console.log(currentUserId);

  const currentChat = chat.find((c) => c._id === id);

  const otherUser = currentChat?.members?.find((m) => m._id !== currentUserId);

  async function getallmessage() {
    try {
      const res = await axios.get(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/message/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessages(res.data.data || res.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }

  async function sendmessage() {
    try {
      const content = inputref.current?.value || "";
      if (!content.trim()) return;

      const res = await axios.post(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/message/`,
        { content, chat: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      inputref.current.value = "";

      // setMessages((prev) => [...prev, res.data.data]);
      toast.success(res.data.message || "Message sent");
      inputref.current?.focus();
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  }

  async function getallchat() {
    try {
      const res = await axios.get(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/chat/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setChat(res.data.data || res.data);
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  }

  async function getchat(chatId) {
    try {
      await axios.get(
        `https://social-media-platform-production-4442.up.railway.app/api/v1/chat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      go(`/chat/${chatId}`);
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
    if (!id) return;
    getallmessage();
  }, [id]);

  useEffect(() => {
    getallchat();
  }, []);

  useEffect(() => {
    if (!id) return;

    socket.emit("joinChat", id);

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("getMessage", handleMessage);

    return () => {
      socket.off("getMessage", handleMessage);
    };
  }, [id]);

  return (
    <div className={`messages ${currentChat ? "chat-open" : ""}`}>
      <div className="messages_left">
        <div className="messages_header">
          <h3>Messages</h3>
          <div className="messages_search">
            <FaSearch />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        <div className="messages_users">
          {chat.map((c) => {
            const chatPartner = c.members?.find((m) => m._id !== currentUserId);

            return (
              <div
                key={c._id}
                className={`messages_user ${c._id === id ? "active" : ""}`}
                onClick={() => getchat(c._id)}
              >
                <img
                  src={
                    chatPartner?.profileImage
                      ? `http://localhost:5000/${chatPartner.profileImage}`
                      : "default-avatar.png"
                  }
                  alt="avatar"
                />
                <div>
                  <h5>
                    {chatPartner
                      ? `${chatPartner.firstName} ${chatPartner.lastName}`
                      : "User"}
                  </h5>
                  <p>{c.lastMessage?.content || "No messages yet"}</p>
                  {c.lastMessage?.createdAt && (
                    <p className="time">
                      {new Date(c.lastMessage.createdAt).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="message_right">
        {currentChat ? (
          <>
            <div className="chat_top">
              <button className="back_btn" onClick={() => go("/chat")}>
                <FaArrowLeft />
              </button>
              <img
                src={
                  otherUser?.profileImage
                    ? `http://localhost:5000/${otherUser.profileImage}`
                    : "default-avatar.png"
                }
                alt="profile"
              />
              <div>
                <h5>
                  {otherUser
                    ? `${otherUser.firstName} ${otherUser.lastName}`
                    : "Loading..."}
                </h5>
                <span>Online</span>
              </div>
            </div>

            <div className="chat_body">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`message ${
                    message.sender?._id === currentUserId ||
                    message.sender === currentUserId
                      ? "sent"
                      : "received"
                  }`}
                >
                  <p>{message.content}</p>
                  {message.createdAt && (
                    <p className="time">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="chat_input">
              <input
                type="text"
                placeholder="Write a message..."
                ref={inputref}
                onKeyDown={(e) => e.key === "Enter" && sendmessage()}
              />
              <button onClick={sendmessage}>
                <IoSend />
              </button>
            </div>
          </>
        ) : (
          <div className="no_chat_selected">
            <h3>Select a chat to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
