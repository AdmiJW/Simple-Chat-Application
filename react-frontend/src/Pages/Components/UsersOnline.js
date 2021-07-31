
function UsersOnline(props) {

    const { onlineUsers } = props;

    //===============
    // JSX
    //===============
    return (
    <ul className='flex-grow overflow-y-auto flex flex-col mx-6 md:mx-2'>
        { onlineUsers.map(e => <li key={e}><p className='rounded-md bg-gray-100 text-lg my-1 p-2'>{e}</p></li>) }
    </ul>
    );
}


export default UsersOnline;