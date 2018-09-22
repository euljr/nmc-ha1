# Node.js Master Class - Homework Assignment #1

This is a simple pure Node.js API for the [The Node.JS Master Class](https://pirple.thinkific.com/courses/the-nodejs-master-class) course Homework Assignment #1

## Usage examples

### GET /hello
Response:
```json
    200 - Success
    { "message": "Hello World!" }
```

### GET /hello?name=Euler
Response:
```json
    200 - Success
    { "message": "Hello Euler!" }
```

### POST /hello
Request:
```json
    { "name": "Euler" }
```
Response:
```json
    200 - Success
    { "message": "Hello Euler!" }
```

### PUT /hello
Response
```json
    405 - Method not allowed
```

### GET /anything
```json
    404 - Not found
```