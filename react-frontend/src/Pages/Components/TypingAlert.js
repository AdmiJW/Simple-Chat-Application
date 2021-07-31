
function TypingAlert(props) {
    const { peopleThatAreTyping } = props;
    
    const alert = peopleThatAreTyping.length > 3? 'Multiple people are typing...':
            peopleThatAreTyping.length === 3? `${peopleThatAreTyping[0]}, ${peopleThatAreTyping[1]} and ${peopleThatAreTyping[2]} are typing...`:
            peopleThatAreTyping.length === 2? `${peopleThatAreTyping[0]} and ${peopleThatAreTyping[1]} are typing...`:
                                              `${peopleThatAreTyping[0]} are typing...`

    return (
        <div className='self-center my-4 px-3 py-2 border-2 bg-opacity-80 rounded-lg shadow-lg bg-gray-400 border-gray-400 text-sm font-medium text-center'>
            {alert}
        </div>
    );
}


export default TypingAlert;