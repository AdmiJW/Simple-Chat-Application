
function Message(props) {
    // Message processing
    let { isSelf, username, date, text } = props.message;
    date = new Date(date).toLocaleString();

    //==============
    // JSX
    //==============
    const className = 'my-2 px-3 py-2 bg-opacity-60 rounded-lg shadow-lg bg-green-200 ' + 
        (isSelf? 'border-green-400 border-4': 'border-green-200 border-2');

    return (
        <div className={className}>
            <div className='flex justify-between flex-wrap '>
                <p className='font-bold text-md' >{ username }</p>
                <p className='font-light text-sm text-gray-600'>{ date }</p>
            </div>
            <p className=''>{ text }</p>
        </div>
    );
}

export default Message;