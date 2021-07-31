import { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Messagebox from "./Components/Messagebox";
import ListMessage from './Components/ListMessage';
import UsersUI from './Components/UsersUI';

import initializeClientSocket from '../client-socket';

function ChatRoom() {
    const { username } = useParams();

    // States
    const [socket, setSocket] = useState({});
    const [onlineUsers, setOnlineUsers ] = useState([]);
    const [peopleCurrTyping, setPeopleCurrTyping ] = useState([]);
    const [messages, setMessages ] = useState([]);
    const [connectionMessages, setConnectionMessages ] = useState([]);
    const [pendingMessages, setPendingMessages ] = useState([]);
    const [isMobileViewOpen, setIsMobileViewOpen] = useState(false);

    // UseEffect(), to connect to the server
    // This will only run once - When the component mounts.
    // The cleanup function will ensure that the disconnection with chat room is done correctly
    useEffect(()=> {
        const socket = initializeClientSocket(username, {
            setOnlineUsers, setPeopleCurrTyping, setMessages, setConnectionMessages, setPendingMessages
        });

        setSocket(socket);

        // Cleanup / Teardown function
        return function cleanup() {
            socket.disconnect(true);
        }
    }, [username]);
    

    //===============
    // JSX
    //===============
    return (
    <Fragment>
        {/* Left - ListMessage, 
            Right - Users UI (Online Users, Connection messages) */}
        <main className='flex flex-grow overflow-y-hidden'>
            <ListMessage messages={messages} pendingMessages={pendingMessages} peopleThatAreTyping={peopleCurrTyping} />
            <UsersUI onlineUsers={onlineUsers} connectionMessages={connectionMessages}
                isMobileViewOpen={isMobileViewOpen} setIsMobileViewOpen={setIsMobileViewOpen} />
        </main>

        <Messagebox username={username} 
            emit_Message={socket.emitMessageEvent} 
            emit_On_Typing_Event={socket.emitTypingEvent}
            setIsMobileViewOpen={setIsMobileViewOpen} />
    </Fragment>
    );
}


export default ChatRoom;