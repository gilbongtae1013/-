import { useEffect, useState } from 'react';

export default function Today({ user }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem('mteworld_token');

    useEffect(() => {
        fetch('/api/today/messages')
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((todayMessages) => setMessages(todayMessages))
            .catch(() => setMessages([]));
    }, []);

    const submitMessage = async () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;

        try {
            const response = await fetch('/api/today/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: trimmedMessage }),
            });
            if (!response.ok) return;

            const todayMessage = await response.json();
            setMessages((currentMessages) => [...currentMessages, todayMessage]);
            setMessage('');
        } catch {
            return;
        }
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitMessage();
        }
    };

    return (
        <div id='Today-container'>
            <div id='Today-ChatBox'>
                {messages.map((chatMessage) => (
                    <p className='Today-chatMessage' key={chatMessage.id}>
                        <strong>{chatMessage.name}:</strong> {chatMessage.text}
                    </p>
                ))}
            </div>

            <div id='Today-inputBox'>
                <input
                    id='Today-input'
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    autoComplete="off"
                />
                <button id='Today-inputSubmit' onClick={submitMessage}>
                    &uarr;
                </button>
            </div>
        </div>
    )
}