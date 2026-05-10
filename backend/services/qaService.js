/**
 * Q&A Service for Backend
 * Handles questions, replies, and voting with Supabase
 * Bridges socket events with persistent database storage
 */

const supabase = require('../supabase/supabaseClient');

/**
 * Create a new question
 * @param {Object} questionData - { title, content, course, semester, subject, tags, userId, email }
 * @returns {Object} Created question object
 */
async function createQuestion(questionData) {
  try {
    const { title, content, course, semester, subject, tags, userId, email } = questionData;

    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          title,
          content,
          course,
          semester,
          subject,
          tags: tags || [],
          user_id: userId,
          user_email: email,
          upvotes: 0,
          downvotes: 0,
          reply_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating question:', error);
      throw new Error(error.message);
    }

    console.log('✓ Question created:', data.id);
    return data;
  } catch (error) {
    console.error('createQuestion error:', error);
    throw error;
  }
}

/**
 * Create a new reply to a question
 * @param {Object} replyData - { questionId, content, parentId, userId, email }
 * @returns {Object} Created reply object
 */
async function createReply(replyData) {
  try {
    const { questionId, content, parentId = null, userId, email } = replyData;

    // Insert reply
    const { data: reply, error: insertError } = await supabase
      .from('replies')
      .insert([
        {
          question_id: questionId,
          content,
          parent_id: parentId, // For hierarchical threading
          user_id: userId,
          user_email: email,
          upvotes: 0,
          downvotes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating reply:', insertError);
      throw new Error(insertError.message);
    }

    // Increment question reply count
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        reply_count: supabase.rpc('increment', { x: 1, table_name: 'questions', id: questionId })
      })
      .eq('id', questionId);

    // Alternative if RPC doesn't work: fetch current count and update
    if (updateError) {
      const { data: question } = await supabase
        .from('questions')
        .select('reply_count')
        .eq('id', questionId)
        .single();

      if (question) {
        await supabase
          .from('questions')
          .update({ reply_count: (question.reply_count || 0) + 1 })
          .eq('id', questionId);
      }
    }

    console.log('✓ Reply created:', reply.id);
    return reply;
  } catch (error) {
    console.error('createReply error:', error);
    throw error;
  }
}

/**
 * Handle voting on questions or replies
 * @param {Object} voteData - { itemId, itemType, voteType, userId }
 * @returns {Object} Updated item with new vote counts
 */
async function castVote(voteData) {
  try {
    const { itemId, itemType, voteType, userId } = voteData;
    const table = itemType === 'question' ? 'questions' : 'replies';
    const voteColumn = voteType === 'upvote' ? 'upvotes' : 'downvotes';

    // Get current item
    const { data: item, error: fetchError } = await supabase
      .from(table)
      .select('*')
      .eq('id', itemId)
      .single();

    if (fetchError) {
      console.error('Error fetching item for voting:', fetchError);
      throw new Error(fetchError.message);
    }

    // Check if user already voted
    const votes = item.votes || [];
    const userVoted = votes.some(v => v.userId === userId);

    if (userVoted) {
      throw new Error('You have already voted on this item');
    }

    // Update vote count
    const updatedVotes = [...votes, { userId, type: voteType, timestamp: new Date().toISOString() }];
    const newVoteCount = item[voteColumn] + 1;

    const { data: updated, error: updateError } = await supabase
      .from(table)
      .update({
        [voteColumn]: newVoteCount,
        votes: updatedVotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating votes:', updateError);
      throw new Error(updateError.message);
    }

    console.log(`✓ Vote (${voteType}) recorded on ${itemType}:`, itemId);
    return updated;
  } catch (error) {
    console.error('castVote error:', error);
    throw error;
  }
}

/**
 * Get all questions with optional filters
 */
async function getQuestions(filters = {}) {
  try {
    let query = supabase.from('questions').select('*');

    if (filters.course) {
      query = query.eq('course', filters.course);
    }
    if (filters.semester) {
      query = query.eq('semester', filters.semester);
    }
    if (filters.subject) {
      query = query.eq('subject', filters.subject);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getQuestions error:', error);
    throw error;
  }
}

/**
 * Get replies for a specific question
 */
async function getReplies(questionId, parentId = null) {
  try {
    let query = supabase
      .from('replies')
      .select('*')
      .eq('question_id', questionId);

    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getReplies error:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time question updates
 * For future real-time subscriptions
 */
function subscribeToQuestions(callback) {
  return supabase
    .channel('questions')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, (payload) => {
      callback(payload);
    })
    .subscribe();
}

/**
 * Subscribe to real-time reply updates
 */
function subscribeToReplies(questionId, callback) {
  return supabase
    .channel(`replies:${questionId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'replies', filter: `question_id=eq.${questionId}` },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
}

module.exports = {
  createQuestion,
  createReply,
  castVote,
  getQuestions,
  getReplies,
  subscribeToQuestions,
  subscribeToReplies
};
