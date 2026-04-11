# Auth Routes (Authentication)

POST    /auth/login
POST    /auth/register
POST    /auth/forget-password

# User Routes
## Profile Routes
GET     /user/profile
PUT     /user/profile

## Offers
GET     /user/offers

# Client Routes

## Profile Routes
GET     /client/profile
PUT     /client/profile

## Offers
POST    /client/offers


# Request / Response Lifecycle
User do something in the web/mobile app ->
    Web/Mobile App Sends a HTTP Request to the server on the API Endpoint (e.g. POST /register) ->
        Server processes the request ->
            Middleware does Validation/Authentication/Authorization (if needed) ->
            Server interacts with the Database if needed ->
                Database returns data to the Server ->
        Server sends back a HTTP Response to the Web/Mobile App -> 
    Web/Mobile App processes the response and updates the UI accordingly.


# Server Proccessing Steps
1. Receive HTTP Request
2. Match the request to the appropriate route
3. Do Validation (if needed)                            |
4. Check Authentication/Authorization (if needed)       | --> Middleware 
5. Process the request (business logic)
6. Interact with the Database (if needed)
7. Prepare the HTTP Response
8. Send the HTTP Response back to the client


## Http Response 
- Status Codes
- Content (Payload)
- Headers

### Status 
- 200 OK
- 201 Created
- 400 Bad Request (Validation Errors)
- 401 Unauthorized
- 403 Forbidden 
- 404 Not Found
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout

### Content (Request Payload/Response Payload) 
#### Types
- Plain Text
  e.g., "Hello, World!"
- JSON
    e.g., { "key": "value" }
- XML
    e.g., <key>value</key><key2>value2</key2>
- Form Data
    e.g., key=value&key2=value2 
- Multipart Form Data
    e.g., for file uploads
    name="Ahmed"&photo=[binary data]

## Hashing, Encryption/Decryption. 

