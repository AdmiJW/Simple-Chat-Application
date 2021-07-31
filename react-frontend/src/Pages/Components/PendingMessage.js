
function PendingMessage(props) {
    let { username, text } = props.message;

    //==============
    // JSX
    //==============
    return (
        <div className='my-2 px-3 py-2 border-2 bg-opacity-60 opacity-50 rounded-lg shadow-lg bg-yellow-200 border-yellow-200'>
            <p className='font-bold text-md' >{ username } (Sending...)</p>
            <p className=''>{ text }</p>
        </div>
    );
}


export default PendingMessage;