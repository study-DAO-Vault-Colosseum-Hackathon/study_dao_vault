import { useContext, useState, useCallback, useEffect } from 'react';
import { SocketContext } from '../hooks/useSocket';
import {
  submitQuestion,
  submitReply,
  castVote,
  getQuestions,
  getReplies,
  subscribeToQuestions,
  subscribeToReplies
} from '../services/qaService';

/**
 * Custom hook for Q&A functionality with real-time socket integration
 * Features:
 * - Ask questions
 * - Reply to questions (with threading support)
 * - Vote on questions and replies
 * - Real-time updates via socket.io
 * - Persistent storage via Supabase
 */
export function useQA() {
  const { socket, isConnected, vaultEvents } = useContext(SocketContext);
  const [questions, setQuestions] = useState([]);
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load questions from Supabase
   */
  const loadQuestions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getQuestions(filters);
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load replies for a specific question
   */
  const loadReplies = useCallback(async (questionId, parentId = null) => {
    try {
      setLoading(true);
      const data = await getReplies(questionId, parentId);
      setReplies((prev) => ({
        ...prev,
        [questionId]: data
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Ask a new question
   */
  const askQuestion = useCallback(async (questionData) => {
    if (!isConnected) {
      setError('Socket connection required');
      return null;
    }

    try {
      const newQuestion = await submitQuestion(socket, questionData);
      setQuestions((prev) => [newQuestion, ...prev]);
      setError(null);
      return newQuestion;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [socket, isConnected]);

  /**
   * Reply to a question
   */
  const replyToQuestion = useCallback(
    async (questionId, replyData) => {
      if (!isConnected) {
        setError('Socket connection required');
        return null;
      }

      try {
        const newReply = await submitReply(socket, {
          questionId,
          ...replyData
        });
        
        setReplies((prev) => ({
          ...prev,
          [questionId]: [newReply, ...(prev[questionId] || [])]
        }));
        
        // Update question with new reply count
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? { ...q, reply_count: (q.reply_count || 0) + 1 }
              : q
          )
        );
        
        setError(null);
        return newReply;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [socket, isConnected]
  );

  /**
   * Vote on a question or reply
   */
  const vote = useCallback(
    async (itemId, itemType, voteType, userId) => {
      if (!isConnected) {
        setError('Socket connection required');
        return null;
      }

      try {
        const updatedItem = await castVote(socket, {
          itemId,
          itemType,
          voteType,
          userId
        });

        if (itemType === 'question') {
          setQuestions((prev) =>
            prev.map((q) =>
              q.id === itemId
                ? {
                    ...q,
                    upvotes:
                      voteType === 'upvote'
                        ? q.upvotes + 1
                        : q.upvotes,
                    downvotes:
                      voteType === 'downvote'
                        ? q.downvotes + 1
                        : q.downvotes
                  }
                : q
            )
          );
        } else {
          // Update reply votes
          Object.keys(replies).forEach((qId) => {
            setReplies((prev) => ({
              ...prev,
              [qId]: (prev[qId] || []).map((r) =>
                r.id === itemId
                  ? {
                      ...r,
                      upvotes:
                        voteType === 'upvote'
                          ? r.upvotes + 1
                          : r.upvotes,
                      downvotes:
                        voteType === 'downvote'
                          ? r.downvotes + 1
                          : r.downvotes
                    }
                  : r
              )
            }));
          });
        }

        setError(null);
        return updatedItem;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [socket, isConnected, replies]
  );

  /**
   * Listen for real-time vault updates from socket
   */
  useEffect(() => {
    if (vaultEvents.length === 0) return;

    const latestEvent = vaultEvents[0];

    if (latestEvent.type === 'question') {
      setQuestions((prev) => [latestEvent, ...prev]);
    } else if (latestEvent.type === 'reply') {
      const qId = latestEvent.question_id;
      setReplies((prev) => ({
        ...prev,
        [qId]: [latestEvent, ...(prev[qId] || [])]
      }));
    } else if (latestEvent.type === 'vote') {
      // Handle vote update
      if (latestEvent.item_type === 'question') {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === latestEvent.item_id
              ? {
                  ...q,
                  [latestEvent.vote_type === 'upvote' ? 'upvotes' : 'downvotes']:
                    latestEvent[latestEvent.vote_type === 'upvote' ? 'upvotes' : 'downvotes']
                }
              : q
          )
        );
      }
    }
  }, [vaultEvents]);

  return {
    questions,
    replies,
    loading,
    error,
    isConnected,
    askQuestion,
    replyToQuestion,
    vote,
    loadQuestions,
    loadReplies
  };
}
