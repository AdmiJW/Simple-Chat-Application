import { useHistory } from 'react-router-dom';
import { useState } from 'react';

// Home page which shows the title and prompts user to enter their username
function Homepage() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [alertMsg, setAlertMsg] = useState('');

    // Event Handlers
    const onUsernameChange = (e)=> setUsername(e.target.value);

    const onSubmit = (e) => {
        e.preventDefault();
        setAlertMsg('');

        // Simple Username Validation
        if (username.length > 20 || username.length < 3)
            return setAlertMsg('Username must be of length 3-20 long!');
        
        history.push(`/chat/${username}`);
    };

    return (
    <main className='flex-grow flex flex-col justify-center items-center'>
        <div className='flex flex-row justify-center items-center flex-wrap my-4'>
            <h1 className='font-tourney font-medium text-center text-6xl md:text-8xl mx-4'>CHAT NOW</h1>
            <svg className="w-20 h-20 sm:ml-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path></svg>
        </div>

        {   // Renders Alert Message if and only if it is not empty string
            alertMsg && <div className='px-3 py-2 my-3 text-md text-white bg-red-500 rounded-lg shadow'>{alertMsg}</div>
        }

        <form onSubmit={onSubmit}>
            <input type='text' className='w-72 md:w-96 rounded-lg border-4 border-gray-400 px-2 py-1 text-2xl' 
                name='username' id='username' placeholder='Username' value={username} onChange={onUsernameChange}/>
            <button type='submit' id='username-submit' className='block px-4 py-3 my-5 mx-auto bg-blue-400 rounded-lg shadow-md transition transform hover:bg-blue-500 hover:scale-110'>
                <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path><path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            </button>
        </form>
    </main>
    );
}


export default Homepage;