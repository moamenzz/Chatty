import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import useAuthStore from "../../store/useAuthStore.js";
import { formatMessageTime } from "../../lib/formatMessageTime.js";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    getMessages,
    isLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { User } = useAuthStore();
  const axiosPrivate = useAxiosPrivate();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(axiosPrivate, selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${
              message.senderId === User.id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === User.id
                      ? User.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              {message.senderId === User.id
                ? User.username
                : selectedUser.username}
            </div>
            <div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
