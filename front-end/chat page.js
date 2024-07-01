const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiX21hbmFyIiwiaWF0IjoxNzE5ODEzOTUxfQ._BtCRvvgyXhuysxVMU4uu6Jh7YufhYs2pvH8tQ5MaUg"
const sendButton = document.querySelector('button');

function sendMessage(chatId, messageContent) {
    fetch(`http://localhost:8080/api/chat/sendMessage/${chatId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: messageContent
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        // Handle success if needed
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Fetching data from API
    fetch('http://localhost:8080/api/chat/getUserChats', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const chatsContainer = document.querySelector('.chat-cards');

        // Assuming 'data' is your API response JSON
        data.user.Chats.forEach(chat => {
            const chatCard = document.createElement('div');
            chatCard.classList.add('chat-card');

            chatCard.innerHTML = `
                <img src="/back-end/${chat.Users[0].imageUrl}" width="50" height="50" />
                <div class="card-data">
                    <div class="right">
                        <h4 class="name">${chat.Users[0].fName} ${chat.Users[0].lName}</h4>
                        <p class="msg">${chat.Messages.length > 0 ? chat.Messages[0].content : ''}</p>
                    </div>
                    
                    <p class="time">${chat.Messages.length > 0 ? new Date(chat.Messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>

                </div>
            `;

            chatsContainer.appendChild(chatCard);

            // Add click event listener to each chat card
            chatCard.addEventListener('click', () => {
                // Fetch messages for this chat
                fetch(`http://localhost:8080/api/chat/getMessages/${chat.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(messagesData => {
                    const messagesContainer = document.querySelector('.messages');
                    messagesContainer.innerHTML = ''; // Clear previous messages

                    // Assuming 'messagesData' is your messages API response JSON
                    messagesData.chat.Messages.forEach(message => {
                        const messageElement = document.createElement('div');
                        //TODO:
                        if(chat.Users[0].id == message.Sender.id){
                            messageElement.classList.add('receive-message');
                        }else{
                            messageElement.classList.add('send-message');
                        }
                        //messageElement.classList.add('receive-message');
                        messageElement.innerHTML = `
                            <p>${message.content}</p>
                        `;
                        messagesContainer.appendChild(messageElement);
                    });

                    // Show chat area and hide welcome message
                    document.querySelector('.welcome').style.display = 'none';
                    document.querySelector('.chat').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                });
            });
            sendButton.addEventListener('click', () => {
                const messageInput = document.querySelector('.messageInput');
                const messageContent = messageInput.value.trim();
                const chatId = chat.id;
                console.log(messageContent)
                if (messageContent) {
                    sendMessage(chatId, messageContent);
                    messageInput.value = ''; // Clear input field after sending
                }
            });

        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});