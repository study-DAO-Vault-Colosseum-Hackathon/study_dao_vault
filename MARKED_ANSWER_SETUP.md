# 🎯 Marked Answer Feature - Complete Setup Guide

## Overview

This feature allows question authors to mark one answer as the "Best Answer". It includes:
- ✅ Only question author can mark answers
- ✅ Marked answer displays at the top with a special badge
- ✅ Other answers sorted by upvotes
- ✅ Green highlight for marked answers
- ✅ Badge visible only to question author

---

## Setup Steps

### Step 1: Add Column to Messages Table

Run this SQL in **Supabase SQL Editor**:

```sql
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS marked_answer_id UUID REFERENCES messages(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_marked_answer_id ON messages(marked_answer_id);
```

### Step 2: Verify Column Was Added
1. Go to **Supabase** → **Table Editor**
2. Click **messages** table
3. Look for new column: `marked_answer_id` (should be UUID type)

### Step 3: Frontend Already Updated ✅

The code changes have been applied to:
- `frontend/src/pages/qa.jsx` - Mark/unmark logic and sorting
- `frontend/src/pages/qa.css` - Styling for marked answers

---

## Features Implemented

### 1. **Mark Answer Button**
- Only visible to the question author
- Shows "☐ Mark" (unchecked) or "✓ Marked" (checked)
- Green button when marked
- Appears on first-level replies only

### 2. **Best Answer Badge**
- Green badge with checkmark (✓ Best Answer)
- Displays at the top of marked answers
- Only visible to everyone (not hidden)

### 3. **Sorting Logic**
```
Order of replies:
1. Marked answer (at the top)
2. All other answers sorted by upvotes (highest first)
```

### 4. **Author-Only Visibility**
- Mark button only shows if current user is the question author
- Comparison: `user?.email === mainQuestion.user_name`

### 5. **Styling**
- Green highlight: `rgba(76, 175, 80, 0.1)`
- Green border: `#4CAF50`
- Button color changes when marked
- Hover effects for better UX

---

## How to Use

### For Question Authors:
1. Post a question
2. Wait for answers/replies
3. Look at each reply - a "☐ Mark" button appears
4. Click "☐ Mark" to mark as best answer
5. Button turns green and shows "✓ Marked"
6. Click "✓ Marked" again to unmark
7. Marked answer automatically moves to top

### For Other Users:
1. See replies sorted by upvotes
2. If an answer is marked, see it at the top with green badge
3. Cannot mark answers (button only shows for author)

---

## Code Changes Summary

### New State
```javascript
const [markedAnswers, setMarkedAnswers] = useState({}); // { questionId: answerId }
```

### New Functions
```javascript
// Fetch marked answers from database
fetchMarkedAnswers(msgs)

// Mark or unmark an answer
handleMarkAnswer(answerId, isCurrentlyMarked, questionId)
```

### New Component
```javascript
const MarkedBadge = ({ isMarked }) => // Green badge component
```

### Updated Comment Component Props
```javascript
mainQuestionAuthor={mainQuestion.user_name}  // Question author
isMarked={comment.id === markedAnswerId}     // Is this the marked answer?
onMarkAnswer={handleMarkAnswer}               // Mark/unmark handler
```

### Sorting Logic
```javascript
// 1. Separate marked from other replies
const markedAnswer = replies.find(r => r.id === markedAnswerId);
const otherReplies = replies.filter(r => r.id !== markedAnswerId);

// 2. Sort others by votes
const sortedOtherReplies = otherReplies.sort((a, b) => {
  return (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0);
});

// 3. Combine: marked first, then sorted
const sortedReplies = markedAnswer 
  ? [markedAnswer, ...sortedOtherReplies] 
  : sortedOtherReplies;
```

---

## Database Schema

### messages table changes:
```sql
Column: marked_answer_id
Type: UUID (nullable)
References: messages(id) ON DELETE SET NULL
Index: idx_marked_answer_id
```

**Example data:**
```
Question:
  id: abc-123
  user_name: "John"
  marked_answer_id: def-456  ← Points to answer

Answer 1 (marked):
  id: def-456
  parent_id: abc-123
  content: "Best solution..."

Answer 2:
  id: ghi-789
  parent_id: abc-123
  content: "Also good..."
```

---

## Testing

### Test 1: Mark an Answer
1. Post a question
2. Wait for replies
3. As question author, click "☐ Mark" on a reply
4. ✅ Should turn green, show "✓ Marked"
5. ✅ Answer should move to top
6. ✅ Badge should appear on answer

### Test 2: Sorting by Votes
1. Mark an answer
2. Upvote another answer more times
3. ✅ Marked answer stays on top
4. ✅ Other answers below, sorted by votes

### Test 3: Author-Only Visibility
1. Post a question as User A
2. Login as User B
3. ✅ User B should NOT see mark button
4. ✅ User A should see mark button

### Test 4: Persistence
1. Mark an answer
2. Refresh page
3. ✅ Marked answer should still be marked
4. ✅ Should be at the top
5. ✅ Badge should still show

---

## Styling Details

### Marked Answer Container
```css
.marked-answer {
  background: rgba(76, 175, 80, 0.1);  /* Light green */
  border-left: 4px solid #4CAF50;      /* Green border */
  border-radius: 8px;
  padding: 12px;
}
```

### Mark Button
```css
.mark-btn {
  color: #818384;  /* Gray by default */
}

.mark-btn:hover {
  color: #4CAF50;   /* Green on hover */
}

.mark-btn.marked {
  color: #4CAF50;   /* Green when marked */
  font-weight: bold;
}
```

### Badge
```css
.marked-badge {
  background-color: #4CAF50;    /* Green */
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 600;
}
```

---

## Troubleshooting

### Mark button doesn't appear
- ✅ Check if you're the question author
- ✅ Button only shows on first-level replies
- ✅ Refresh page and try again

### Marked answer doesn't move to top
- ✅ Refresh page
- ✅ Check database query: `marked_answer_id` column should have value
- ✅ Check browser console for errors

### Can't mark answer as non-author
- ✅ This is by design! Only question author can mark
- ✅ Login with the account that posted the question

### Marked status not persisting
- ✅ Run SQL migration to add `marked_answer_id` column
- ✅ Check Supabase connection
- ✅ Check browser console for errors

---

## Future Enhancements

Possible improvements:
- Add "mark as duplicate" feature
- Award points/badges to authors of marked answers
- Show statistics (e.g., "Best answer marked 10 times")
- Allow multiple marked answers with categories (e.g., "Best", "Most Helpful")
- Send notification when answer is marked
- Add comments on why it's marked as best

---

## Summary

✅ **Feature Complete!**

| Feature | Status |
|---------|--------|
| Mark/unmark answers | ✅ Done |
| Author-only mark button | ✅ Done |
| Sort by votes | ✅ Done |
| Show marked at top | ✅ Done |
| Green badge styling | ✅ Done |
| Persistence in database | ✅ Done |

**Your Q&A system now has a full best-answer system like Stack Overflow!** 🚀
