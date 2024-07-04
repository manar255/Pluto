

import { Manager } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const manager = new Manager("http://localhost:8080");
const socket = manager.socket("/");

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("join", { username: "Manar" });
});

socket.on('chat message', (data) => {
    const messagesContainer = document.querySelector('.messages');
    const messageElement = document.createElement('div');

    if (socket.id === data.id) {
        messageElement.classList.add('send-message');
    } else {
        messageElement.classList.add('receive-message');
    }
    messageElement.innerHTML = `<p>${data.msg}</p>`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

const token = localStorage.getItem('token');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', () => {
    const messageInput = document.querySelector('.messageInput');
    const messageContent = messageInput.value.trim();
    messageInput.value = '';

    const activeChatId = document.querySelector('.chat.active').dataset.chatId;

    if (messageContent) {
        socket.emit('chat message', { msg: messageContent, id: socket.id });
        sendMessage(activeChatId, messageContent);
    }
});

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
    fetchUserInfo();
    fetchUserChats();
});

function fetchUserInfo() {
    fetch('http://localhost:8080/api/user/userInfo', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const user = data.data;
        const userElement = document.querySelector('.user');
        const userImage = userElement.querySelector('img');
        const userName = userElement.querySelector('h5');

        userImage.src = `/back-end/${user.imageUrl}`;
        userName.textContent = `${user.fName} ${user.lName}`;
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
    });
}

function fetchUserChats() {
    fetch('http://localhost:8080/api/chat/getUserChats', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const chatsContainer = document.querySelector('.chat-cards');
        data.user.Chats.sort((a, b) => new Date(b.Messages[0].createdAt) - new Date(a.Messages[0].createdAt));

        data.user.Chats.forEach(chat => {
            const chatCard = createChatCard(chat);
            chatsContainer.appendChild(chatCard);
        });

        // Display the first chat by default
        if (data.user.Chats.length > 0) {
            displayChat(data.user.Chats[0].id);
        }
    })
    .catch(error => {
        console.error('Error fetching user chats:', error);
    });
}

function createChatCard(chat) {
    const chatCard = document.createElement('div');
    chatCard.classList.add('chat-card');
    chatCard.dataset.chatId = chat.id;

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

    chatCard.addEventListener('click', () => {
        const chatId = chatCard.dataset.chatId;
        displayChat(chatId);
    });

    return chatCard;
}

function displayChat(chatId) {
    const activeChat = document.querySelector('.chat.active');
    if (activeChat) {
        activeChat.classList.remove('active');
    }

    const chatCard = document.querySelector(`.chat-card[data-chat-id="${chatId}"]`);
    chatCard.classList.add('active');

    fetch(`http://localhost:8080/api/chat/getMessages/${chatId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(messagesData => {
        const messagesContainer = document.querySelector('.messages');
        messagesContainer.innerHTML = '';

        messagesData.chat.Messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            if (message.Sender.id === data.user.id) {
                messageElement.classList.add('send-message');
            } else {
                messageElement.classList.add('receive-message');
            }
            messageElement.innerHTML = `<p>${message.content}</p>`;
            messagesContainer.appendChild(messageElement);
        });

        const chatHeader = document.querySelector('.chat-header');
        const userImage = chatHeader.querySelector('img');
        const userName = chatHeader.querySelector('.user-name h4');
        userImage.src = `/back-end/${messagesData.chat.Users[0].imageUrl}`;
        userName.textContent = `${messagesData.chat.Users[0].fName} ${messagesData.chat.Users[0].lName}`;

        document.querySelector('.welcome').style.display = 'none';
        document.querySelector('.chat').style.display = 'block';
    })
    .catch(error => {
        console.error('Error fetching chat messages:', error);
    });
}
