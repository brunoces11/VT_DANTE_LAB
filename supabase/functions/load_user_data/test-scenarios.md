# Test Scenarios for load_user_data Edge Function

## Test Cases

### 1. Authenticated User with Multiple Sessions and Messages
**Expected**: HTTP 200 with complete data structure
```json
{
  "user_id": "uuid",
  "chat_sessions": [
    {
      "chat_session_id": "uuid",
      "chat_session_title": "Session Title",
      "messages": [
        {
          "chat_msg_id": "uuid",
          "msg_input": "User message",
          "msg_output": "AI response"
        }
      ]
    }
  ]
}
```

### 2. Authenticated User with No Sessions
**Expected**: HTTP 200 with empty chat_sessions array
```json
{
  "user_id": "uuid",
  "chat_sessions": []
}
```

### 3. Authenticated User with Sessions but No Messages
**Expected**: HTTP 200 with sessions containing empty messages arrays
```json
{
  "user_id": "uuid",
  "chat_sessions": [
    {
      "chat_session_id": "uuid",
      "chat_session_title": "Empty Session",
      "messages": []
    }
  ]
}
```

### 4. Missing Authorization Header
**Expected**: HTTP 401
```json
{
  "error": "Missing authorization header",
  "code": "UNAUTHORIZED"
}
```

### 5. Invalid JWT Token
**Expected**: HTTP 401
```json
{
  "error": "Invalid authentication token",
  "code": "UNAUTHORIZED"
}
```

### 6. Database Connection Error
**Expected**: HTTP 500
```json
{
  "error": "Failed to fetch chat sessions",
  "code": "DATABASE_ERROR"
}
```

### 7. CORS Preflight Request
**Method**: OPTIONS
**Expected**: HTTP 200 with CORS headers

## Manual Testing Commands

### Test with curl (replace with actual values):
```bash
# Valid request
curl -X POST https://your-project.supabase.co/functions/v1/load_user_data \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Missing auth header
curl -X POST https://your-project.supabase.co/functions/v1/load_user_data \
  -H "Content-Type: application/json"

# Invalid token
curl -X POST https://your-project.supabase.co/functions/v1/load_user_data \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json"

# CORS preflight
curl -X OPTIONS https://your-project.supabase.co/functions/v1/load_user_data \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization"
```

## Test Data Setup (SQL)

```sql
-- Create test user (assuming auth.users already has the user)
INSERT INTO public.tab_user (user_id, user_name, user_role) 
VALUES ('test-user-uuid', 'Test User', 'free');

-- Create test chat session
INSERT INTO public.tab_chat_session (chat_session_id, user_id, chat_session_title, session_time)
VALUES ('test-session-uuid', 'test-user-uuid', 'Test Chat Session', NOW());

-- Create test messages
INSERT INTO public.tab_chat_msg (chat_msg_id, chat_session_id, user_id, msg_input, msg_output, msg_time)
VALUES 
  ('test-msg-1', 'test-session-uuid', 'test-user-uuid', 'Hello', 'Hi there!', NOW()),
  ('test-msg-2', 'test-session-uuid', 'test-user-uuid', 'How are you?', 'I am doing well, thank you!', NOW());

-- Create empty session for testing
INSERT INTO public.tab_chat_session (chat_session_id, user_id, chat_session_title, session_time)
VALUES ('empty-session-uuid', 'test-user-uuid', 'Empty Session', NOW());
```

## Validation Checklist

- [ ] Function responds to POST requests
- [ ] CORS headers are properly set
- [ ] Authentication validation works correctly
- [ ] Database queries execute without errors
- [ ] Response structure matches specification exactly
- [ ] Error handling returns appropriate status codes
- [ ] TypeScript interfaces are properly implemented
- [ ] Function handles edge cases (empty data, missing data)
- [ ] Security: Only user's own data is returned
- [ ] Performance: Efficient queries with proper ordering