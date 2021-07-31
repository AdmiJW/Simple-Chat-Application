import io from 'socket.io-client';


// Initializes the socket to connect to the socketIO server.
// Returns the socket object.
function initializeClientSocket(username, state_setters) {
    const { setOnlineUsers, setPeopleCurrTyping, setMessages, setConnectionMessages,
            setPendingMessages } = state_setters;

    let socket = io();
    
    setConnectionMessages((prev)=> {
        return [...prev, {
            type: 'connecting',
            timestamp: new Date().getTime()
        }];
    });

    socket.on('connect_error', (error)=> {
        console.error(`Error while connecting to websocket server. ${error}`);
        setConnectionMessages((prev)=> {
            return [...prev, {
                type: 'error',
                timestamp: new Date().getTime(),
                payload: 'Unable to connect to server'
            }];
        });
    });

    // Upon connect, set the username and fetch online users
    socket.on('connect', ()=> {
        socket.emit('set-username', username);
        socket.emit('fetch-online-users');
    });

    // Register all event listeners
    set_On_Disconnected_Event(socket, setOnlineUsers, setConnectionMessages);
    set_On_Error_Event(socket, setConnectionMessages);
    set_On_Fetch_Online_Users_Event(socket, setOnlineUsers);
    set_On_Joined_Event(socket, setOnlineUsers, setConnectionMessages);
    set_On_Message_Event(socket, setPeopleCurrTyping, setMessages);
    set_On_Message_Sent_Event(socket, username, setPendingMessages, setMessages);
    set_On_Stop_Typing_Event(socket, setPeopleCurrTyping);
    set_On_Typing_Event(socket, setPeopleCurrTyping);

    //=======================================================================
    // Appending the event emitter functions on the socket object itself.
    //=======================================================================
    let typingTimeout = null;
    let lastTyped = 0;          // EPOCH time since last typing. We don't want to flood the server by fast typers
    let messageID = 1;

    // Upon call, will emit a 'typing' event to server.
    socket.emitTypingEvent = ()=> {
        // If last emitted typed event is less than 2 seconds ago, do not emit another one to the server
        if (new Date().getTime() - lastTyped < 2000) return;

        lastTyped = new Date().getTime();
        
        if (typingTimeout)
            clearTimeout(typingTimeout);

        socket.emit('typing');
        typingTimeout = setTimeout(() => {
            socket.emit('stop-typing');
        }, 10000);
    };

    // Upon call, will append the message to PendingMessages, and emit a 'message' event to server.
    // Sent to Server: {
    //      text: string,
    //      id: number       
    // }
    socket.emitMessageEvent = (text)=> {
        if (!text) return;

        if (typingTimeout)
            clearTimeout(typingTimeout);

        setPendingMessages(prev => [...prev, {
            id: messageID,
            username,
            text,
            date: new Date()
        }]);

        socket.emit('message', JSON.stringify({
            text,
            id: messageID
        }));
        messageID++;
    };

    return socket;
};

//================================================
// Event Handlers
//================================================

// 'joined' event - Indicating a new user has joined the server
// Server sends: Username: string
function set_On_Joined_Event(socket, setOnlineUsers, setConnectionMessages) {
    socket.on('joined', (username)=> {
        setOnlineUsers((prev)=> [...prev, username]);
        setConnectionMessages((prev=> [...prev, {
            timestamp: new Date().getTime(),
            type: 'joined',
            payload: username
        }]));
    });
}


// 'fetch-online-users' event - Obtains a list of online users from the server
// Server sends: users: array
function set_On_Fetch_Online_Users_Event(socket, setOnlineUsers) {
    socket.on('fetch-online-users', (users)=> {
        setOnlineUsers(JSON.parse(users));
    });
}


// 'disconnected' event - When a user disconnected
// Server sends: username: string
function set_On_Disconnected_Event(socket, setOnlineUsers, setConnectionMessages) {
    socket.on('disconnected', (username)=> {
        setOnlineUsers(prev => prev.filter(e => e !== username));
        setConnectionMessages(prev => [...prev, {
            type: 'exited',
            timestamp: new Date().getTime(),
            payload: username
        }]);
    });
}


// 'message' event - When a user sends a message
// Server sends: {
//      username: string,
//      text: string,
//      date: milliseconds since UNIX epoch         
// }
function set_On_Message_Event(socket, setPeopleCurrTyping, setMessages) {
    socket.on('message', (payload)=> {
        const { username, text, date } = JSON.parse(payload);

        setPeopleCurrTyping(prev => prev.filter(e => e !== username));
        setMessages(prev => [...prev, {
            isSelf: false,
            username, 
            date: new Date(date),
            text
        }]);
    })
}


// 'message-sent' event - Response given When own message is successfully received by the server
// Server sends: {
//      id,
//      text,
//      date: milliseconds since UNIX epoch   
// }
function set_On_Message_Sent_Event(socket, selfUsername, setPendingMessages, setMessages) {
    // id, text
    socket.on('message-sent', (msg)=> {
        const { id, text, date } = JSON.parse(msg);

        setPendingMessages((prev)=> prev.filter(e => e.id != id));
        setMessages((prev)=> [...prev, {
            isSelf: true,
            username: selfUsername,
            date: new Date(date),
            text
        }]);
    });
}


// 'typing' event - When a user starts typing
// Server sends: username: string
function set_On_Typing_Event(socket, setPeopleCurrTyping) {
    socket.on('typing', username => {
        setPeopleCurrTyping(prev => prev.indexOf(username) !== -1? prev: [...prev, username]);
    });
}


// 'stop-typing' event - When a user stopped typing for ~15s (May change. Refer Code below)
// Server sends: username: string
function set_On_Stop_Typing_Event(socket, setPeopleCurrTyping) {
    socket.on('stop-typing', username => {
        setPeopleCurrTyping(prev => prev.filter(e => e !== username));
    });
}


// 'error' event - Server side error
// Server sends: errorMsg: string
function set_On_Error_Event(socket, setConnectionMessages) {
    socket.on('error', errorMsg => {
        setConnectionMessages(prev => [...prev, {
            type: 'error',
            timestamp: new Date().getTime(),
            payload: errorMsg
        }]);
    });
}


export default initializeClientSocket;