
function ConnectionMessage(props) {

    const { connectionMessages } = props;

    const connectionMessagesJSX = connectionMessages.map(e => {
        switch(e.type) {
            case 'connecting':
                return <li key={e.timestamp}>
                    <p className='rounded-md bg-yellow-100 text-lg my-1 p-2'>Connecting to the chat room...</p>
                </li>;
            case 'joined':
                return <li key={e.timestamp}>
                    <p className='rounded-md bg-green-100 text-lg my-1 p-2'>{e.payload} joined the chat room!</p>
                </li>;
            case 'exited':
                return <li key={e.timestamp}>
                    <p className='rounded-md bg-red-100 text-lg my-1 p-2'>{e.payload} quit the chat room!</p>
                </li>;
            case 'error':
                return <li key={e.timestamp}>
                    <p className='rounded-md bg-red-300 text-lg my-1 p-2'>Error: {e.payload}</p>
                </li>;
            default:
                return '';
        }
    });

    return (
    <ul className='flex-grow overflow-y-auto flex flex-col mx-6 md:mx-2'>
        { connectionMessagesJSX }
    </ul>
    );
}


export default ConnectionMessage;