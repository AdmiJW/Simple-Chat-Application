import { useState } from 'react';

function Messagebox(props) {
    const {username, emit_Message, emit_On_Typing_Event, setIsMobileViewOpen} = props;

    const [message, setMessage] = useState('');

    const onMessageChange = (e)=> {
        setMessage(e.target.value);
        emit_On_Typing_Event();
    };
    const onSubmit = (e)=> {
        e.preventDefault();
        emit_Message(message);
        setMessage('');
    }

    //===================
    // JSX
    //===================
    return (
        <form onSubmit={onSubmit} className='flex text-lg md:text-xl z-30 relative' id='chatbox'>
            {/* For the toggling of the mobile client UsersList */}
            <button type='button' onClick={()=> setIsMobileViewOpen((prev)=> !prev)}
                className='absolute md:hidden right-4 -top-20 p-2 bg-blue-500 hover:bg-blue-600 rounded-full shadow-md'>
                <svg className="w-10 h-10" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </button>

            <input type='text' placeholder={username + ":"} value={message} onChange={onMessageChange}
                className='flex-grow shadow-inner px-3 py-2 border-2 border-gray-300 rounded-t-md' 
                disabled={emit_Message === undefined}/>
            <button type='submit' id='chatbox__send' className='bg-blue-600 px-3 rounded-t-md hover:bg-blue-700'
                disabled={emit_Message === undefined}>
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
        </form>
    );
}


export default Messagebox;