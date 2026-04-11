# Design API 
- List all Endpoints
- Define Request and Response formats and Body
# Building API
=================================================

# Design API
## Authentication Endpoint
- `POST /api/auth/register` - Register a new user
   Request Body:
   ```json 
   {
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "password": "string",
        "country_code": "string",
        "phone_number": "string",
        "type": "string" // "user" or "client"
   }
   ```
   Response Body: 
   200 OK
   ```json
   {
        "success": true,
        "message": "User registered successfully",
        "data": {
            "id": "string",
            "first_name": "string",
            "last_name": "string",
            "email": "string",
            "country_code": "string",
            "phone_number": "string",
            "type": "string"
        }
   }
   ```
   400 Bad Request
   ```json
   {
        "success": false,
        "message": "Error message"
   }
   ```


## Building API
1. Define Route 
2. Validate Input
3. Process Request
4

```javascript
app.post("/api/auth/register", async (req, res) => {
    // Logic for registering a new user
});
```
