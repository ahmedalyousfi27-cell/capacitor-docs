# Auth Testing Playbook

## Test User & Session Created
- Session token: test_session_1768769228127
- User ID: test_admin_1768769228127
- Role: admin

## Backend API Test
```bash
curl -X GET "https://express-bridge.preview.emergentagent.com/api/auth/me" -H "Authorization: Bearer test_session_1768769228127"
```

## Browser Testing
```javascript
await page.context.add_cookies([{
    "name": "session_token",
    "value": "test_session_1768769228127",
    "domain": "express-bridge.preview.emergentagent.com",
    "path": "/",
    "httpOnly": true,
    "secure": true,
    "sameSite": "None"
}]);
await page.goto("http://localhost:3000/browse");
```
