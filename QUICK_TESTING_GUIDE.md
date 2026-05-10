# 🧪 QUICK MANUAL TESTING GUIDE

## Quick Start (5 minutes)

### Step 1: Verify Services Running ✅
```powershell
# Terminal 1: Backend
cd d:\Colesseum_hackthon\study_dao_vault\backend
npm start
# Should show: ✓ Express server started on port 3000
```

```powershell
# Terminal 2: Frontend  
cd d:\Colesseum_hackthon\study_dao_vault\frontend
npm run dev
# Should show: ➜ Local: http://localhost:5175/
```

---

## Test Procedure

### ✅ Test 1: Open App (30 seconds)
1. Open browser: http://localhost:5175/study-dao
2. Sign in with Google
3. Look for **blue "Connected" badge** at top of page
4. **Expected**: Page shows Q&A feed

**Pass Criteria**: No errors, Connected badge visible ✅

---

### ✅ Test 2: Post Question (1 minute)
1. In the "Ask a Question" section, type:
   ```
   What is the capital of Nepal?
   ```
2. Select semester: Any
3. Select subject: Any
4. Click **"Post Question"**
5. **Expected**: Question appears in feed below immediately

**Pass Criteria**: Question displays WITHOUT duplicates ✅

---

### ✅ Test 3: Real-Time Sync (1 minute)
1. **Keep current browser tab open**
2. **Open new browser tab**: http://localhost:5175/study-dao
3. Sign in with same account
4. **In Tab 1**: Post another question:
   ```
   What is 2 + 2?
   ```
5. **In Tab 2**: Question appears WITHOUT refresh

**Pass Criteria**: Question appears in Tab 2 within 1 second ✅

---

### ✅ Test 4: Reply to Question (1 minute)
1. Click **"Answer/Comment"** on any question
2. Type reply:
   ```
   I think the answer is correct!
   ```
3. Press **Enter** or click **Post**
4. **Expected**: Reply appears under question

**Pass Criteria**: Reply displays in correct hierarchy ✅

---

### ✅ Test 5: Voting (1 minute)
1. Find any question
2. Click **upvote button (↑)**
3. Vote count increases: `↑ 1`
4. Click again - should toggle/decrease
5. **Expected**: Vote count changes

**Pass Criteria**: Vote count updates correctly ✅

---

### ✅ Test 6: Page Refresh (1 minute)
1. Post a few questions
2. Press **F5** to refresh page
3. **Expected**: Questions still there with correct votes

**Pass Criteria**: Data persists after refresh ✅

---

## What to Look For

### ✅ Success Indicators
- Blue "Connected" badge at top
- Questions post and appear
- No duplicate questions
- Replies nest under questions
- Votes count changes
- Real-time sync works (2 tabs)
- Data persists after refresh

### ❌ Error Indicators
- Red "Disconnected" badge
- Questions don't appear
- Duplicate questions in feed
- Replies in wrong place
- Vote count doesn't update
- Browser console shows errors

---

## Browser Console Debugging

Open **Developer Tools (F12)** and check **Console tab** for:

### Expected Success Messages
```javascript
✅ "Question saved to Supabase: xxxxxxxx"
✅ "Question posted and broadcasted!"
✅ "✅ Question added"
✓ New user connected: [socket-id]
```

### Error Messages to Watch For
```javascript
❌ "Failed to post question:"
❌ "Error saving to Supabase"
❌ "WebSocket connection failed"
```

---

## Quick Fixes

### Issue: "Disconnected" badge
**Solution**: 
1. Check backend is running: `npm start` in backend folder
2. Refresh browser (F5)

### Issue: Questions don't appear
**Solution**:
1. Check browser console for errors (F12)
2. Check Supabase credentials in frontend .env
3. Verify backend port 3000 is correct

### Issue: Duplicate questions
**Solution**:
1. This was already fixed! ✅
2. If still seeing duplicates, check frontend/src/pages/qa.jsx line 369

### Issue: Real-time sync not working
**Solution**:
1. Verify both tabs have "Connected" badge
2. Check network tab in DevTools for WebSocket connection
3. Restart frontend: `npm run dev`

---

## Test Data

Use this for testing:

**Test Questions**:
- "What is React?"
- "How do hooks work?"
- "Explain async/await"
- "What is Supabase?"

**Test Replies**:
- "Great question!"
- "I think..."
- "Here's the answer:"
- "Can you clarify?"

---

## Performance Expectations

| Action | Expected Time |
|--------|----------------|
| Load page | < 2 seconds |
| Post question | < 1 second |
| Display in feed | < 100ms |
| Real-time sync (2 tabs) | < 1 second |
| Vote count update | < 500ms |
| Page refresh | < 2 seconds |

---

## Success Criteria Checklist

After testing, verify:

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5175  
- [ ] "Connected" badge is blue
- [ ] Can post questions
- [ ] Questions appear once (no duplicates)
- [ ] Can reply to questions
- [ ] Can vote on questions
- [ ] Real-time sync works (2 tabs)
- [ ] Data persists after refresh
- [ ] No console errors

**If all checked**: ✅ **SYSTEM IS WORKING!**

---

## Support

### Check These Files
- **Backend Logs**: Terminal running `npm start`
- **Frontend Logs**: Browser Console (F12)
- **Status Docs**: TESTING_IMPLEMENTATION_COMPLETE.md
- **Test Results**: FINAL_TESTING_SUMMARY.md

### Key Files Modified
- `frontend/src/pages/qa.jsx` - Main Q&A component
- `backend/src/index.js` - Socket.io server
- `frontend/src/hooks/useSocket.jsx` - Socket context

---

## Next Steps After Testing

1. ✅ Verify all 6 tests pass
2. ✅ Check console logs are clean
3. ✅ Confirm no duplicates
4. ✅ Test with multiple users (open 3+ tabs)
5. ✅ Test vote persistence (refresh and check)
6. ✅ Document any issues found
7. ✅ Deploy to staging environment

---

**Last Updated**: May 10, 2026  
**Time to Complete**: ~10 minutes  
**Difficulty**: Easy ✅  
**All Systems Go**: YES! 🚀
