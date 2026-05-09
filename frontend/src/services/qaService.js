import { supabase } from '../supabase/supabaseClient';

/**
 * Handle new question submission
 * Stores in Supabase and broadcasts via socket
 */
export async function submitQuestion(socket, { title, content, course, semester, subject, tags }) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          title,
          content,
          course,
          semester,
          subject,
          tags,
          upvotes: 0,
          downvotes: 0,
          reply_count: 0,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Broadcast to all users
    socket?.emit('new_question', data);
    return data;
  } catch (error) {
    console.error('Error submitting question:', error);
    throw error;
  }
}

/**
 * Handle new reply/answer to a question
 * Supports hierarchical threading with parent_id
 */
export async function submitReply(socket, { questionId, content, parentId = null }) {
  try {
    const { data, error } = await supabase
      .from('replies')
      .insert([
        {
          question_id: questionId,
          content,
          parent_id: parentId, // For threading
          upvotes: 0,
          downvotes: 0,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Update question reply count
    await supabase
      .from('questions')
      .update({ reply_count: (await getReplyCount(questionId)) + 1 })
      .eq('id', questionId);

    // Broadcast to all users
    socket?.emit('new_reply', {
      ...data,
      question_id: questionId
    });

    return data;
  } catch (error) {
    console.error('Error submitting reply:', error);
    throw error;
  }
}

/**
 * Handle voting (upvote/downvote) on questions or replies
 * Updates counts in Supabase and broadcasts real-time
 */
export async function castVote(socket, { itemId, itemType, voteType, userId }) {
  try {
    const table = itemType === 'question' ? 'questions' : 'replies';
    const voteColumn = voteType === 'upvote' ? 'upvotes' : 'downvotes';

    // Get current item
    const { data: item, error: fetchError } = await supabase
      .from(table)
      .select(voteColumn)
      .eq('id', itemId)
      .single();

    if (fetchError) throw fetchError;

    // Increment or decrement vote count
    const newCount = item[voteColumn] + 1;

    const { data, error } = await supabase
      .from(table)
      .update({ [voteColumn]: newCount })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    // Broadcast to all users for real-time sync
    socket?.emit('vote_cast', {
      item_id: itemId,
      item_type: itemType,
      vote_type: voteType,
      [voteColumn]: newCount,
      user_id: userId,
      timestamp: new Date().toISOString()
    });

    return data;
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
}

/**
 * Get all questions with optional filtering
 */
export async function getQuestions(filters = {}) {
  try {
    let query = supabase.from('questions').select('*');

    if (filters.course) query = query.eq('course', filters.course);
    if (filters.semester) query = query.eq('semester', filters.semester);
    if (filters.subject) query = query.eq('subject', filters.subject);
    if (filters.sortBy === 'recent') query = query.order('created_at', { ascending: false });
    if (filters.sortBy === 'popular') query = query.order('upvotes', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

/**
 * Get replies for a specific question with threading support
 */
export async function getReplies(questionId, parentId = null) {
  try {
    let query = supabase
      .from('replies')
      .select('*')
      .eq('question_id', questionId);

    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null); // Top-level replies only
    }

    query = query.order('upvotes', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
}

/**
 * Get reply count for a question
 */
export async function getReplyCount(questionId) {
  try {
    const { count, error } = await supabase
      .from('replies')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', questionId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting reply count:', error);
    return 0;
  }
}

/**
 * Subscribe to real-time question updates
 */
export function subscribeToQuestions(callback) {
  return supabase
    .from('questions')
    .on('*', (payload) => {
      callback(payload);
    })
    .subscribe();
}

/**
 * Subscribe to real-time reply updates
 */
export function subscribeToReplies(questionId, callback) {
  return supabase
    .from('replies')
    .on('*', (payload) => {
      if (payload.new?.question_id === questionId) {
        callback(payload);
      }
    })
    .subscribe();
}
