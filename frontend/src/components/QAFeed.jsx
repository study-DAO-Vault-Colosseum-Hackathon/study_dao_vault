import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaReply, FaCircleNotch } from 'react-icons/fa';
import './QAFeed.css';

export default function QAFeed({ questions = [], replies = {}, loading, onAskQuestion, onReplyToQuestion, onVote, selectedSubject, semesterNumber }) {
  const [newQuestionText, setNewQuestionText] = useState('');
  const [expandedQId, setExpandedQId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [submittingReplies, setSubmittingReplies] = useState({});

  const handleAskQuestion = async () => {
    if (!newQuestionText.trim()) return;
    setSubmittingQuestion(true);
    try {
      await onAskQuestion(newQuestionText, selectedSubject?.name, `Semester ${semesterNumber}`);
      setNewQuestionText('');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleReplySubmit = async (questionId) => {
    const replyText = replyTexts[questionId];
    if (!replyText || !replyText.trim()) return;
    setSubmittingReplies(prev => ({ ...prev, [questionId]: true }));
    try {
      await onReplyToQuestion(questionId, replyText);
      setReplyTexts(prev => ({ ...prev, [questionId]: '' }));
    } finally {
      setSubmittingReplies(prev => ({ ...prev, [questionId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="qa-feed-container">
        <div className="qa-loading">
          <FaCircleNotch className="qa-spinner" />
          <p>Loading Q&A feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qa-feed-container">
      <div className="qa-feed-stack">
        {/* Ask Question Section */}
        <div className="qa-ask-section">
          <div className="qa-ask-header">
            <h3>Ask a Question</h3>
            <p>Get help from the community</p>
          </div>
          <div className="qa-ask-form">
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="What would you like to know about this subject?"
              className="qa-input-textarea"
              rows="3"
            />
            <button
              onClick={handleAskQuestion}
              disabled={submittingQuestion || !newQuestionText.trim()}
              className="qa-submit-btn"
            >
              {submittingQuestion ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="qa-questions-section">
          <div className="qa-section-header">
            <h3>Questions ({questions.length})</h3>
            <p>Recent questions from the community</p>
          </div>

          {questions.length > 0 ? (
            <div className="qa-questions-list">
              {questions.map((question) => (
                <div key={question.id} className="qa-question-card">
                  {/* Question */}
                  <div className="qa-question-main">
                    <div className="qa-question-content">
                      <h4>{question.text}</h4>
                      <p className="qa-question-meta">
                        <span className="qa-meta-item">by {question.author}</span>
                        <span className="qa-meta-item">•</span>
                        <span className="qa-meta-item">{new Date(question.created_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <div className="qa-question-votes">
                      <button
                        className="qa-vote-btn"
                        onClick={() => onVote(question.id, 'question', 'upvote')}
                      >
                        <FaThumbsUp />
                        <span>{question.vote_count || 0}</span>
                      </button>
                    </div>
                  </div>

                  {/* Toggle Replies Button */}
                  <button
                    className="qa-toggle-replies-btn"
                    onClick={() => setExpandedQId(expandedQId === question.id ? null : question.id)}
                  >
                    {expandedQId === question.id ? '▼' : '▶'} Replies ({(replies[question.id] || []).length})
                  </button>

                  {/* Replies Section */}
                  {expandedQId === question.id && (
                    <div className="qa-replies-section">
                      {replies[question.id] && replies[question.id].length > 0 ? (
                        <div className="qa-replies-list">
                          {replies[question.id].map((reply) => (
                            <div key={reply.id} className="qa-reply-card">
                              <div className="qa-reply-content">
                                <p>{reply.text}</p>
                                <p className="qa-reply-meta">
                                  <span className="qa-meta-item">by {reply.author}</span>
                                  <span className="qa-meta-item">•</span>
                                  <span className="qa-meta-item">{new Date(reply.created_at).toLocaleDateString()}</span>
                                </p>
                              </div>
                              <button
                                className="qa-vote-btn"
                                onClick={() => onVote(reply.id, 'reply', 'upvote')}
                              >
                                <FaThumbsUp />
                                <span>{reply.vote_count || 0}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="qa-no-replies">No replies yet. Be the first to answer!</p>
                      )}

                      {/* Reply Form */}
                      <div className="qa-reply-form">
                        <textarea
                          value={replyTexts[question.id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [question.id]: e.target.value }))}
                          placeholder="Write your answer..."
                          className="qa-input-textarea"
                          rows="2"
                        />
                        <button
                          onClick={() => handleReplySubmit(question.id)}
                          disabled={submittingReplies[question.id] || !replyTexts[question.id]?.trim()}
                          className="qa-submit-btn"
                        >
                          {submittingReplies[question.id] ? 'Posting...' : 'Post Answer'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="qa-empty-state">
              <p>No questions yet. Be the first to ask!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
