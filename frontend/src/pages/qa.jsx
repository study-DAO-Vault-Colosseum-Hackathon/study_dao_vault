import React, { useContext, useEffect, useState } from 'react';
import getApiClient from "../utils/api";
import { SocketContext } from '../hooks/useSocket';
import { supabase } from '../supabase/supabaseClient';
import Questionform from './questionform';
import './qa.css';

// Vote counter component
const VoteCounter = ({ messageId, voteCounts, userVotes, onVote, user }) => {
  const count = voteCounts[messageId] || 0;
  const hasVoted = userVotes[messageId] || false;

  const handleVote = async () => {
    if (!user) {
      alert('Please login to vote');
      return;
    }
    await onVote(messageId, user?.uid || user?.email);
  };

  return (
    <div className="vote-counter">
      <button 
        className={`vote-btn ${hasVoted ? 'voted' : ''}`}
        onClick={handleVote}
        disabled={hasVoted}
        title={hasVoted ? 'You already voted' : 'Upvote'}
      >
        ▲
      </button>
      <span className="vote-count">{count}</span>
    </div>
  );
};

// Marked answer badge component
const MarkedBadge = ({ isMarked }) => {
  if (!isMarked) return null;
  return (
    <div className="marked-badge" title="Marked as best answer">
      ✓ Best Answer
    </div>
  );
};

// 1. Recursive Comment Component (ONLY first-level replies show votes)
const Comment = ({ msg, allMessages, onReply, replyingTo, handleSendReply, isFirstLevel, voteCounts, userVotes, onVote, user, mainQuestionAuthor, isMarked, onMarkAnswer, mainQuestionId }) => {
  // This line is the "Engine" that makes the chain work
  const nestedReplies = allMessages.filter(m => m.parent_id === msg.id);
  const [localInput, setLocalInput] = useState("");
  // Question author can mark first-level answers as main/best
  const isCurrentUserQuestionAuthor = isFirstLevel && (user?.email === mainQuestionAuthor || user?.uid === mainQuestionAuthor);
  
  const submitReply = () => {
    if (!localInput.trim()) return;
    handleSendReply(msg.id, localInput);
    setLocalInput("");
  };

  const handleLocalKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      submitReply();
    }
  };

  return (
    <div className={`comment-wrapper ${isMarked ? 'marked-answer' : ''}`} style={{ marginLeft: '20px', borderLeft: isMarked ? '3px solid #4CAF50' : '1px solid #eee' }}>
      {isMarked && <MarkedBadge isMarked={true} />}
      <div className="comment-main">
        <div className="comment-meta">
          <span className="comment-user">{msg.user_name || msg.user || 'Anonymous'}</span>
          <span className="comment-time">{msg.timestamp || new Date(msg.created_at).toLocaleTimeString()}</span>
        </div>
        <div className="comment-content">{msg.content}</div>
        
        <div className="comment-actions">
          {isFirstLevel && (
            <>
              <VoteCounter 
                messageId={msg.id} 
                voteCounts={voteCounts} 
                userVotes={userVotes} 
                onVote={onVote}
                user={user}
              />
              {isCurrentUserQuestionAuthor && (
                <button 
                  className={`action-btn mark-btn ${isMarked ? 'marked' : ''}`}
                  onClick={() => onMarkAnswer(msg.id, isMarked, mainQuestionId)}
                  title={isMarked ? 'Unmark as main answer' : 'Pin as main answer'}
                >
                  {isMarked ? '📌 Main Answer' : '☆ Mark as Main'}
                </button>
              )}
            </>
          )}
          <button className="action-btn" onClick={() => onReply(msg.id)}>Reply</button>
        </div>

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
              <button onClick={submitReply} className="btn btn-send">Post Reply</button>
              <button onClick={() => onReply(null)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        )}

        {nestedReplies.length > 0 && (
          <div className="nested-replies">
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
                mainQuestionAuthor={mainQuestionAuthor}
                mainQuestionId={mainQuestionId}
                isMarked={false}
                onMarkAnswer={onMarkAnswer}
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
  const [voteCounts, setVoteCounts] = useState({}); 
  const [userVotes, setUserVotes] = useState({}); 
  const [isFetchingVotes, setIsFetchingVotes] = useState(false);
  const [markedAnswers, setMarkedAnswers] = useState({}); // { questionId: answerId }

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
      .order('created_at', { ascending: false });
      console.log("fetched data : ",data);
    if (data) {
      setMessages(data);
      // Fetch vote counts and marked answers
      if (user) {
        fetchVoteCounts(data);
        fetchMarkedAnswers(data);
      }
    }
  };
  fetchHistory();
}, [user]);

// Fetch marked answers for all questions
const fetchMarkedAnswers = async (msgs) => {
  try {
    const questions = msgs.filter(m => !m.parent_id).map(m => m.id);
    
    // Avoid empty array error
    if (questions.length === 0) {
      setMarkedAnswers({});
      return;
    }
    
    const { data: marked, error } = await supabase
      .from('messages')
      .select('id, marked_answer_id')
      .in('id', questions)
      .not('marked_answer_id', 'is', null);

    if (error) {
      console.warn('Error fetching marked answers:', error);
      return;
    }

    const markedMap = {};
    marked?.forEach(question => {
      if (question.marked_answer_id) {
        markedMap[question.id] = question.marked_answer_id;
      }
    });

    setMarkedAnswers(markedMap);
    console.log('✅ Fetched marked answers');
  } catch (err) {
    console.error('Error fetching marked answers:', err);
  }
};
const fetchVoteCounts = async (msgs) => {
  if (isFetchingVotes || !msgs.length) return;
  
  setIsFetchingVotes(true);
  const userId = user?.uid || user?.email;
  const messageIds = msgs.map(m => m.id);

  // Avoid empty array error in .in() filter
  if (messageIds.length === 0) {
    setVoteCounts({});
    setUserVotes({});
    setIsFetchingVotes(false);
    return;
  }

  try {
    const { data: allVotes, error } = await supabase
      .from('votes')
      .select('message_id, user_id')
      .in('message_id', messageIds);

    if (!error && allVotes) {
      const counts = {};
      const userStatus = {};
      
      allVotes.forEach(v => {
        counts[v.message_id] = (counts[v.message_id] || 0) + 1;
        if (v.user_id === userId) userStatus[v.message_id] = true;
      });

      setVoteCounts(counts);
      setUserVotes(userStatus);
    } else if (error) {
      console.error('❌ Supabase votes fetch error:', error);
    }
  } catch (err) {
    console.error('❌ Error fetching vote counts:', err);
  } finally {
    setIsFetchingVotes(false);
  }
};

// Mark or unmark an answer as the main/best answer
const handleMarkAnswer = async (answerId, isCurrentlyMarked, questionId) => {
  try {
    const newMarkedAnswerId = isCurrentlyMarked ? null : answerId;

    const { error } = await supabase
      .from('messages')
      .update({ marked_answer_id: newMarkedAnswerId })
      .eq('id', questionId);

    if (error) {
      console.error('Error marking answer:', error);
      alert('Failed to mark answer');
      return;
    }

    // Update local state
    setMarkedAnswers(prev => ({
      ...prev,
      [questionId]: newMarkedAnswerId
    }));

    console.log(`✅ Answer ${isCurrentlyMarked ? 'unmarked' : 'marked'} as main answer`);
  } catch (err) {
    console.error('Error marking answer:', err);
    alert('Failed to mark answer');
  }
};

// Handle upvote
const handleVote = async (messageId, userId) => {
  try {
    // Insert vote - let database handle duplicate check via unique constraint
    const { data: voteResult, error: voteError } = await supabase
      .from('votes')
      .insert([
        {
          message_id: messageId,
          user_id: userId
        }
      ])
      .select();

    if (voteError) {
      if (voteError.code === '23505') {
        alert('You already voted on this!');
      } else if (voteError.status === 406) {
        alert('⚠️ Permission issue. Please try refreshing the page.');
        console.error('RLS policy error:', voteError);
      } else {
        console.error('Error voting:', voteError);
        alert('Error voting: ' + voteError.message);
      }
      return;
    }

    // Update state immediately (optimistic update)
    setVoteCounts(prev => ({
      ...prev,
      [messageId]: (prev[messageId] || 0) + 1
    }));

    setUserVotes(prev => ({
      ...prev,
      [messageId]: true
    }));
    
    console.log('✅ Vote successful!');
  } catch (err) {
    console.error('Vote error:', err);
    alert('Failed to vote. Please try again.');
  }
};
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
  // If customMessage exists (from a nested comment), use it. 
  // Otherwise, use the global messageInput (from a main question reply).
  const finalContent = customMessage || messageInput;
  
  if (!finalContent.trim()) return;

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {    
        content: finalContent, 
        input: finalContent,
        semester: "N/A",
        subject: "REPLY",
        user_name: user?.displayName || 'Anonymous', 
        photo_url: user?.photoURL,
        parent_id: parent_id, // This link is what keeps the chain alive
        is_question: false
      }
    ])
    .select();

  if (error) {
    console.error(error);
    return;
  }

  const savedReply = data[0];
  
  // Update Socket and Local State
  emitEvent("message", savedReply);
  setMessages((prev) => [savedReply, ...prev]);
  
  // Reset states
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
        content : formData.input, 
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
                <VoteCounter 
                  messageId={mainQuestion.id} 
                  voteCounts={voteCounts} 
                  userVotes={userVotes} 
                  onVote={handleVote}
                  user={user}
                />
                <button className="action-btn" onClick={() => setReplyingTo(mainQuestion.id)}>
                   Answer/Comment
                </button>
              </div>
            </div>

            <div className="comments-thread">
              {(() => {
                // Get all replies for this question
                const replies = messages.filter((m) => m.parent_id === mainQuestion.id);
                
                // Separate marked answer from others
                const markedAnswerId = markedAnswers[mainQuestion.id];
                const markedAnswer = replies.find(r => r.id === markedAnswerId);
                const otherReplies = replies.filter(r => r.id !== markedAnswerId);
                
                // Sort other replies by vote count (descending)
                const sortedOtherReplies = otherReplies.sort((a, b) => {
                  return (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0);
                });

                // Combine: marked first, then sorted by votes
                const sortedReplies = markedAnswer 
                  ? [markedAnswer, ...sortedOtherReplies] 
                  : sortedOtherReplies;

                return sortedReplies.map((comment) => (
                  <Comment 
                    key={comment.id} 
                    msg={comment} 
                    allMessages={messages} 
                    onReply={setReplyingTo}
                    replyingTo={replyingTo}
                    handleSendReply={handleSendReply}
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                    isFirstLevel={true}
                    voteCounts={voteCounts}
                    userVotes={userVotes}
                    onVote={handleVote}
                    user={user}
                    mainQuestionAuthor={mainQuestion.user_name || mainQuestion.user}
                    mainQuestionId={mainQuestion.id}
                    isMarked={comment.id === markedAnswerId}
                    onMarkAnswer={handleMarkAnswer}
                  />
                ));
              })()}
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

}
export default QA;