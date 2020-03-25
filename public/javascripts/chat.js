const socket = io.connect("http://localhost:3000");

const typing = document.querySelector("#typing");
const message = document.querySelector("#message");
const messages = document.querySelector('#messages .container');
const sendMessage = document.querySelector("#send-button");
const username = user.firstName;

sendMessage.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('new_message', { message: message.value, username, date: new Date });
});

socket.on('new_message', (data) => {
    message.value = '';
    const messageSend = document.createElement('div');
    if (data.username == username) {
        messageSend.classList.add('outgoing');
    } else {
        messageSend.classList.add('incoming');
    }
    messageSend.innerHTML = `
    <div class="metadata">
        <span class="author">${ data.username == username ? 'You' : data.username } at</span>
        <span class="date">${ data.date }</span>
    </div>
    <p>${ data.message }</p>
    `;
    messages.appendChild(messageSend);
});

message.addEventListener('keypress', () => {
    socket.emit('typing', { username });
});

socket.on('typing', (data) => {
    setTimeout(() => {
        typing.textContent = '';
    }, 3000);
    typing.textContent = data.username + ' is typing...';
});