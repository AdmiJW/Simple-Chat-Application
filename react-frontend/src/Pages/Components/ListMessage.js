import Message from './Message';
import PendingMessage from './PendingMessage';
import TypingAlert from './TypingAlert';


function ListMessage(props) {
    const { messages, pendingMessages, peopleThatAreTyping } = props;

    return (
    <section className='flex-grow px-3 py-2 flex flex-col overflow-y-auto'>   
        {messages.map((e)=> <Message message={e} key={e.date.getTime()} />)}
        {pendingMessages.map((e)=> <PendingMessage message={e} key={e.date.getTime()} />)}

        {/* Only show typing Alert if there is people typing */}
        { peopleThatAreTyping.length? <TypingAlert peopleThatAreTyping={peopleThatAreTyping} />: "" }
    </section>
    );
}

export default ListMessage;