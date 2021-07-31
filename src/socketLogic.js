const SocketIOServerClass = require('socket.io').Server;

// Handles WebSocket Logics
function initializeWebSocketLogic (httpServer, rateLimiter) {
    const io = new SocketIOServerClass(httpServer);

    // SocketID => username 
    const connectedIDToUsername = {};
    // username => boolean
    const isClientTyping = {};


    io.on('connection', (clientSocket)=> {
        console.log("[Connected]: " + clientSocket.id);

        clientSocket.onAny(async ()=> {
            try {
                await rateLimiter.consume(clientSocket.id);
            } catch (exceedErr) {
                console.error("[RateLimiter]: " + exceedErr);
                clientSocket.emit('error', 'Potential flooding behavior. Connection closed. Please login again');
                clientSocket.disconnect(true);
            }
        });

        // When client sets the username
        // Client sends: username: string
        clientSocket.on('set-username', (username)=> {
            // Username taken. Close connection and ask to reselect a username
            if (isClientTyping[username] !== undefined) {
                clientSocket.emit('error', 'Username taken. Please rejoin the room with another username');
                clientSocket.disconnect(true);
                return;
            }

            // Invalid username (If this changes, client side validation needs to change too, in client-socket.js)
            if (username.length < 3 || username.length > 20) {
                clientSocket.emit('error', 'Invalid username. Username must be lengthed between 3-20 characters');
                clientSocket.disconnect(true);
                return;
            }

            connectedIDToUsername[clientSocket.id] = username;
            isClientTyping[username] = false;

            io.emit('joined', username);
        });


        // Fetches the list of clients online
        // Client sends: nothing
        // Respond: users: array
        clientSocket.on('fetch-online-users', ()=> {
            clientSocket.emit('fetch-online-users', JSON.stringify(Object.keys(isClientTyping)));
        });

        
        // When client disconnects
        // Broadcast: username: string
        clientSocket.on('disconnect', ()=> {
            const username = connectedIDToUsername[clientSocket.id];
            delete connectedIDToUsername[clientSocket.id];
            delete isClientTyping[ username ];
            
            if (username)
                io.emit('disconnected', username);
            console.log(`[Disconnected]: ${clientSocket.id} (${username})`);
        });


        // When client sends a message
        // Client sends: { id, text }
        // Respond: 'message-sent' event, { id, text, date }
        // Broadcast: 'message' event, { username, text, date }
        clientSocket.on('message', (message)=> {
            const { id, text } = JSON.parse(message);

            const username = connectedIDToUsername[clientSocket.id];
            isClientTyping[username] = false;

            clientSocket.broadcast.emit('message', JSON.stringify({
                username,
                text,
                date: new Date().getTime()
            }));
            clientSocket.emit('message-sent', JSON.stringify({
                id,
                text,
                date: new Date().getTime()                
            }));
        });
    

        // When client is typing
        // Broadcast: username: string
        clientSocket.on('typing', ()=> {
            const username = connectedIDToUsername[clientSocket.id];
            isClientTyping[username] = true;

            clientSocket.broadcast.emit('typing', username);
        });


        // When client stopped typing
        // Broadcast: username: string
        clientSocket.on('stop-typing', ()=> {
            const username = connectedIDToUsername[clientSocket.id];
            isClientTyping[username] = false;

            clientSocket.broadcast.emit('stop-typing', username);
        });
  
    });
};


module.exports = initializeWebSocketLogic;