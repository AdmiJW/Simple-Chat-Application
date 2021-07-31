import UsersOnline from "./UsersOnline";
import ConnectionMessage from "./ConnectionMessage";

function UsersUI(props) {
    const { onlineUsers, connectionMessages, isMobileViewOpen, setIsMobileViewOpen } = props;

    //===============
    // JSX
    //===============
    // Classname for the outermost, overall component
    const className = (isMobileViewOpen? 'fixed flex ': 'hidden') + ' top-0 left-0 min-w-full min-h-screen max-h-screen p-6 md:flex bg-black bg-opacity-25 z-50 '
                + 'md:relative md:min-h-0 md:p-0 md:min-w-300px md:max-w-50vw';

    return (
        // The blindfold
        <section className={className}>
            <div className='relative w-full bg-white rounded-md shadow-md py-2 px-6 md:px-3 flex flex-col
                        md:rounded-none max-h-screen'>
                {/* Button to close the UsersUI on mobile screens */}
                <button type='button' onClick={()=> setIsMobileViewOpen((prev)=> !prev)}
                    className='absolute right-3 top-3 md:hidden'>
                    <svg className="w-8 h-8" fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
                
                {/* Top: Users Online
                    Bottom: Connection Statuses */}
                <h4 className='text-center text-2xl font-semibold mb-3'>Users Online</h4>
                <UsersOnline onlineUsers={onlineUsers} />
                <hr className='my-1'/>
                <h4 className='text-center text-2xl font-semibold mb-3'>Connection Status</h4>
                <ConnectionMessage connectionMessages={connectionMessages} />
            </div>
        </section>
    );
}

export default UsersUI;