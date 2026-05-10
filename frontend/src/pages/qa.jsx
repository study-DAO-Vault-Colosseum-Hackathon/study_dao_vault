import React, { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../hooks/useSocket';
import { supabase } from '../supabase/supabaseClient';
import Questionform from './questionform';
import './qa.css';

// --- Sub-Components ---

const VoteCounter = ({ messageId, voteCounts, userVotes, onVote, user }) => {
  const count = voteCounts[messageId] || 0;
  const hasVoted = userVotes[messageId] || false;

  const handleVote = async () => {
    if (!user) return alert('Please login to vote');
    await onVote(messageId, user?.uid || user?.email);
  };

  return (
    <div className="vote-counter-ui">
      <button 
        className={`vote-pill ${hasVoted ? 'voted' : ''}`}
        onClick={handleVote}
        disabled={hasVoted}
      >
        <span className="arrow">▲</span>
        <span className="count">{count}</span>
      </button>
    </div>
  );
};

const Comment = ({ 
  msg, allMessages, onReply, replyingTo, handleSendReply, 
  isFirstLevel, voteCounts, userVotes, onVote, user, 
  mainQuestionAuthor, isMarked, onMarkAnswer, mainQuestionId 
}) => {
  const nestedReplies = allMessages.filter(m => m.parent_id === msg.id);
  const [localInput, setLocalInput] = useState("");
  
  const isAuthor = isFirstLevel && (user?.displayName === mainQuestionAuthor || user?.email === mainQuestionAuthor);

 const submitReply = () => {
  if (!localInput.trim()) return;
  handleSendReply(msg.id, localInput, msg.semester, msg.subject);
  setLocalInput("");
};
  // Consistent Avatar logic
  const avatarUrl = msg.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user_name}`;

  return (
    <div className={`comment-node ${isMarked ? 'is-best' : ''} ${!isFirstLevel ? 'nested' : ''}`}>
      <div className="comment-line"></div>
      <div className="comment-body">
        <div className="comment-header">
          <img src={avatarUrl} alt="avatar" className="mini-avatar" />
          <span className="user-tag">{msg.user_name}</span>
          <span className="dot">•</span>
          <span className="time-tag">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          {isMarked && <span className="best-badge">✓ Best Answer</span>}
        </div>

        <div className="comment-text">{msg.content}</div>

        <div className="comment-footer">
          <VoteCounter messageId={msg.id} voteCounts={voteCounts} userVotes={userVotes} onVote={onVote} user={user} />
          {isFirstLevel && isAuthor && (
            <button className={`mark-action ${isMarked ? 'active' : ''}`} onClick={() => onMarkAnswer(msg.id, isMarked, mainQuestionId)}>
              {isMarked ? '📌 Unpin' : '☆ Pin Best'}
            </button>
          )}
          <button className="reply-link" onClick={() => onReply(msg.id === replyingTo ? null : msg.id)}>Reply</button>
        </div>

        {replyingTo === msg.id && (
          <div className="reply-box-anim">
            <textarea 
              value={localInput} 
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="Write a reply..."
              autoFocus
            />
            <div className="reply-btns">
              <button onClick={submitReply} className="btn-post">Post</button>
              <button onClick={() => onReply(null)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        )}

        {nestedReplies.length > 0 && (
          <div className="nested-container">
            {nestedReplies.map(reply => (
              <Comment 
                key={reply.id} 
                msg={reply} 
                allMessages={allMessages} 
                onReply={onReply}
                replyingTo={replyingTo} 
                handleSendReply={handleSendReply} 
                isFirstLevel={false}
                voteCounts={voteCounts} 
                userVotes={userVotes} 
                onVote={onVote} 
                user={user}
                onMarkAnswer={onMarkAnswer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main QA Component ---

const QA = ({ user }) => {
  const { socket, isConnected, emitEvent } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [voteCounts, setVoteCounts] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [markedAnswers, setMarkedAnswers] = useState({});
  const [mainReplyInput, setMainReplyInput] = useState("");

  useEffect(() => {
    if (!socket) return;
    const handleMsg = (data) => {
      setMessages(prev => {
        if (prev.find(m => m.id === data.id)) return prev;
        return [data, ...prev];
      });
    };
    socket.on("message", handleMsg);
    return () => socket.off("message", handleMsg);
  }, [socket]);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (data) {
        setMessages(data);
        fetchVotes(data);
        fetchBestAnswers(data);
      }
    };
    loadData();
  }, [user]);

  const fetchVotes = async (msgs) => {
    const ids = msgs.map(m => m.id);
    if (!ids.length) return;
    const { data } = await supabase.from('votes').select('message_id, user_id').in('message_id', ids);
    if (data) {
      const counts = {};
      const status = {};
      data.forEach(v => {
        counts[v.message_id] = (counts[v.message_id] || 0) + 1;
        if (v.user_id === (user?.uid || user?.email)) status[v.message_id] = true;
      });
      setVoteCounts(counts);
      setUserVotes(status);
    }
  };

  const fetchBestAnswers = async (msgs) => {
    const questions = msgs.filter(m => !m.parent_id).map(m => m.id);
    if (!questions.length) return;
    const { data } = await supabase.from('messages').select('id, marked_answer_id').in('id', questions).not('marked_answer_id', 'is', null);
    const map = {};
    data?.forEach(q => map[q.id] = q.marked_answer_id);
    setMarkedAnswers(map);
  };

  const handleVote = async (messageId, userId) => {
    const { error } = await supabase.from('votes').insert([{ message_id: messageId, user_id: userId }]);
    if (error) return alert("Already voted!");
    setVoteCounts(p => ({ ...p, [messageId]: (p[messageId] || 0) + 1 }));
    setUserVotes(p => ({ ...p, [messageId]: true }));
  };

  const handleMarkAnswer = async (answerId, isMarked, questionId) => {
    const newId = isMarked ? null : answerId;
    const { error } = await supabase.from('messages').update({ marked_answer_id: newId }).eq('id', questionId);
    if (!error) setMarkedAnswers(p => ({ ...p, [questionId]: newId }));
  };

  const handleSendReply = async (parent_id, content, semester, subject) => {
  if(!user) return alert("Please log in to reply");
  if(!content.trim()) return;

  const { data, error } = await supabase.from('messages').insert([{
    content: content, 
    input: content, 
    user_name: user?.displayName || 'Anonymous',
    photo_url: user?.photoURL, 
    parent_id, 
    is_question: false,
    semester: semester, // Pass the parent's semester
    subject: subject    // Pass the parent's subject
  }]).select();

  if (!error && data) {
    emitEvent("message", data[0]);
    setMessages(p => [data[0], ...p]);
    setReplyingTo(null);
    setMainReplyInput(""); 
  }
};
  const handleNewPost = async (formData) => {
    // Ensuring we only pull the text 'input' and not the whole object
    const { data, error } = await supabase.from('messages').insert([{
      content: formData.input,
      input: formData.input, 
      subject: formData.subject, 
      semester: formData.semester,
      user_name: user?.displayName || 'Anonymous', 
      photo_url: user?.photoURL,
      is_question: true, 
      parent_id: null
    }]).select();

    if (!error && data) {
      emitEvent("message", data[0]);
      setMessages(p => [data[0], ...p]);
    }
  };

  return (
    <div className="qa-layout">
      <header className="qa-topbar">
        <div className="logo-section">
          <h1>Study DAO Vault</h1>
          <div className={`status-pill ${isConnected ? 'on' : 'off'}`}>
            {isConnected ? "Live" : "Offline"}
          </div>
        </div>
      </header>

      <main className="qa-main">
        <section className="form-section">
          <Questionform onPost={handleNewPost} />
        </section>

        <section className="feed-section">
          {messages.filter(m => !m.parent_id).map((q) => (
            <div key={q.id} className="q-card">
              <div className="q-header">
                <img className="mini-avatar" src={q.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${q.user_name}`} alt="u" />
                <div>
                  <span className="q-author">{q.user_name}</span>
                  <span className="q-meta">{q.subject} • {q.semester}</span>
                </div>
              </div>
              <div className="q-body">{q.content}</div>
              <div className="q-footer">
                <VoteCounter messageId={q.id} voteCounts={voteCounts} userVotes={userVotes} onVote={handleVote} user={user} />
                <button className="btn-reply-main" onClick={() => setReplyingTo(q.id === replyingTo ? null : q.id)}>
                  {replyingTo === q.id ? 'Cancel' : 'Answer'}
                </button>
              </div>

              {/* FIX: This handles the first reply (Answer) to a main question */}
              {/* Inside the q-card loop where the Answer box is */}
{replyingTo === q.id && (
  <div className="reply-box-anim main-level-reply">
    <textarea 
      value={mainReplyInput}
      onChange={(e) => setMainReplyInput(e.target.value)}
      placeholder="Write your answer..."
      autoFocus
    />
    <div className="reply-btns">
      <button 
        className="btn-post" 
        onClick={() => handleSendReply(q.id, mainReplyInput, q.semester, q.subject)}
      >
        Post Answer
      </button>
    </div>
  </div>
)}

              <div className="thread-area">
                {(() => {
                  const replies = messages.filter(m => m.parent_id === q.id);
                  const bestId = markedAnswers[q.id];
                  const sorted = replies.sort((a, b) => (a.id === bestId ? -1 : b.id === bestId ? 1 : (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0)));
                  
                  return sorted.map(reply => (
                    <Comment 
                      key={reply.id} 
                      msg={reply} 
                      allMessages={messages} 
                      onReply={setReplyingTo}
                      replyingTo={replyingTo} 
                      handleSendReply={handleSendReply} 
                      isFirstLevel={true}
                      voteCounts={voteCounts} 
                      userVotes={userVotes} 
                      onVote={handleVote} 
                      user={user}
                      mainQuestionAuthor={q.user_name} 
                      mainQuestionId={q.id}
                      isMarked={reply.id === bestId} 
                      onMarkAnswer={handleMarkAnswer}
                    />
                  ));
                })()}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default QA;