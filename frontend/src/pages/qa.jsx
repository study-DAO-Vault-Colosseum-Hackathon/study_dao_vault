import React, { useContext, useEffect, useState } from 'react';
import getApiClient from "../utils/api";
import { SocketContext } from '../hooks/useSocket';
import { supabase } from '../supabase/supabaseClient';
import Questionform from './questionform';
import './qa.css';

// 1. Recursive Comment Component
const Comment = ({ msg, allMessages, onReply, replyingTo, setReplyingTo, handleSendReply, messageInput, setMessageInput }) => {
  const replies = allMessages.filter(m => m.parent_id === msg.id);
  const [localInput, setLocalInput] = useState("");
  
  const handleLocalKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSendReply(msg.id, localInput);
      setLocalInput("");
    }
  };

  return (
    <div className="comment-wrapper">
      <div className="comment-sidebar">
        <img src={msg.photoURL} className="comment-avatar" referrerPolicy="no-referrer" alt="avatar" />
        <div className="thread-line"></div>
      </div>
      
      <div className="comment-main">
        <div className="comment-meta">
          <span className="comment-user">{msg.user}</span>
          <span className="comment-time">{msg.timestamp}</span>
        </div>
        <div className="comment-content">{msg.content}</div>
        
        <div className="comment-actions">
          <button className="action-btn" onClick={() => onReply(msg.id)}>Reply</button>
        </div>

        {/* 2. Show the Reply Input box only for the specific comment being replied to */}
        {replyingTo === msg.id && (
          <div className="reply-input-container">
            <input 
              type="text" 
              className="message-input" 
              placeholder="Write a reply..."
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onKeyDown={handleLocalKeyPress}
              autoFocus
            />
            <div className="reply-buttons">
              <button onClick={() => { handleSendReply(msg.id, localInput); setLocalInput(""); }} className="btn btn-send">Post Reply</button>
              <button onClick={() => { onReply(null); setLocalInput(""); }} className="btn-cancel">Cancel</button>
            </div>
          </div>
        )}

        {/* Render nested replies */}
        {replies.length > 0 && (
          <div className="replies-container">
            {replies.map(reply => (
             <Comment 
                key={reply.id} 
                msg={reply} 
                allMessages={allMessages} 
                onReply={onReply}
                replyingTo={replyingTo}
                handleSendReply={handleSendReply}
                messageInput={messageInput}
                setReplyingTo={setReplyingTo}
                setMessageInput={setMessageInput}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const QA = ({user}) => {
  const { socket, isConnected, vaultEvents, emitEvent } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [questions , setQuestions] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      setMessages((prev) => [data, ...prev]);
      alert('hello');
    });
    return () => socket.off("message");
  }, [socket]);

useEffect(() => {
  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')

      // .is('parent_id', null) 
      .order('created_at', { ascending: false });
      console.log("fetched data : ",data);
    if (data) setMessages(data);
    // console.log(messages);
  };
  fetchHistory();
}, []);
const handleKeyPress = (e, parent_id = null)=>{
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); 
    if (parent_id) {
      handleSendReply(parent_id);
    } else {
      handleSendMessage();
    }
  }
}

  const handleSendMessage = () => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return;

    const messageData = {
      id: Date.now().toString(),
      content: trimmedMessage,
      input: 'trimmedMessage.input',
      semester: 'trimmedMessage.semester',
      subject: 'trimmedMessage.subject',
      user: user?.displayName || user?.email || 'Anonymous',
      photoURL : user?.photoURL || "https://ui-avatars.com/api/?name=User",
      timestamp: new Date().toLocaleTimeString(),
      parent_id: null // Main messages have no parent
    };
    emitEvent("message", messageData);
    setMessages((prev) => [messageData, ...prev]);
    setMessageInput("");
  };
// handle send reply
  const handleSendReply = async (parent_id, customMessage = null) => {
    const trimmedMessage = messageInput.trim();
  if (!trimmedMessage) return;

  // 1. Save to Supabase
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {    
        content: trimmedMessage, 
         input: trimmedMessage,
      semester: "N/A",
      subject: "REPLY",
        user_name: user?.displayName || 'Anonymous', 
        photo_url: user?.photoURL,
        parent_id: parent_id, // This links it to the specific question
        is_question: false
      }
    ])
    .select();

  if (error) return;

  const savedReply = data[0];
  
  // 2. Emit and Update local state
  emitEvent("message", savedReply);
  setMessages((prev) => [savedReply, ...prev]);
  setMessageInput("");
  setReplyingTo(null);
    // const messageText = customMessage !== null ? customMessage : messageInput;
    // const trimmedMessage = messageText.trim();
    // if (!trimmedMessage) return;

    // const messageData = {
    //   id: Date.now().toString(), 
    //   parent_id: parent_id,     
    //   content: trimmedMessage,
    //   user: user?.displayName || 'Anonymous',
    //   photoURL: user?.photoURL || "https://ui-avatars.com/api/?name=User",
    //   timestamp: new Date().toLocaleTimeString(),
    // };
    
    // emitEvent("message", messageData);
    // setMessages((prev) => [messageData, ...prev]);
    // if (customMessage === null) {
    //   setMessageInput("");
    // }
    // setReplyingTo(null);
  };

  const handleNewPost = async(formData) => {
    // 1. Save to Supabase first
  const { data, error } = await supabase
    .from('messages')
    .insert([
      { 
        content : formData, 
        input : formData.input,
        semester : formData.semester,
        subject: formData.subject, 
        user_name: user?.displayName || 'Anonymous', 
        photo_url: user?.photoURL || "https://ui-avatars.com/api/?name=User",
        is_question: true,
        parent_id: null 
      }
    ])
    .select(); // Returns the saved row with its new UUID
console.log(formData);
  if (error) {
    console.error("Error saving post:", error);
    return;
  }

  // 2. Emit the saved data to Socket.io
  const savedPost = data[0];
  emitEvent("message", savedPost); 
  
  // 3. Update local state
  setMessages((prev) => [savedPost, ...prev]);
  
  //   const content = typeof formData === 'object' ? formData.input : formData;
  //   const messageData = {
  //   id: Date.now().toString(),
  //   content: content,
  //   user: user?.displayName || 'Anonymous',
  //   photoURL: user?.photoURL || "https://ui-avatars.com/api/?name=User",
  //   timestamp: new Date().toLocaleTimeString(),
  //   parent_id: null
  // };
  
  // emitEvent("message", messageData); // Send to socket
  // setMessages((prev) => [messageData, ...prev]); // Update UI
};

  return (
    <div className="qa-container">
      <div className="qa-header">
        <h1>Study DAO Vault: Live Feed</h1>
        {/* <Questionform onPost={handleNewPost}/> */}
        <div className="status-badge">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <div className="qa-content">
  <div className="messaging-section">
    {/* 1. The Form to create the 'Main Question' */}
    <Questionform onPost={handleNewPost} />

    <div className="feed-container">
      {messages
        .filter((msg) => !msg.parent_id)
        .map(( mainQuestion,i) => (
          <div key={mainQuestion.id} className="main-post-wrapper">
            
            {/* The Actual Question Card */}
            <div className="main-question-card">
              <div className="post-header">
                <img src={mainQuestion.photo_url} alt="user" className="post-avatar" />
                <span className="post-user">user : {mainQuestion.user_name}</span> - - - 
                <span className="post-time">{mainQuestion.created_at}</span>
              </div>
              <div className="post-body">
                <h3>{mainQuestion.subject}  --  {mainQuestion.semester}</h3>
                <p>{i+1}. {mainQuestion.input}</p>
              </div>
              <div className="post-footer">
                <button className="action-btn" onClick={() => setReplyingTo(mainQuestion.id)}>
                   Answer/Comment
                </button>
              </div>
            </div>

            <div className="comments-thread">
              {messages
                .filter((m) => m.parent_id === mainQuestion.id)
                .map((comment) => (
                  <Comment 
                    key={comment.id} 
                    msg={comment} 
                    allMessages={messages} 
                    onReply={setReplyingTo}
                    replyingTo={replyingTo}
                    handleSendReply={handleSendReply}
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                  />
                ))}
            </div>
            
            {replyingTo === mainQuestion.id && (
              <div className="inline-reply-box">
                <input 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Write a comment..."
                  onKeyDown={(e) => { if(e.key === 'Enter') handleSendReply(mainQuestion.id); }}
                />
                <button onClick={() => handleSendReply(mainQuestion.id)}>Post</button>
              </div>
            )}
          </div>
        ))}
    </div>
  </div>
</div>
</div>
  );
};

export default QA;