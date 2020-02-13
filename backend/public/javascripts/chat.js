$(document).ready(function() {
    const socket = io.connect("http://localhost:3000");

    let feedback = $("#text-feedback");
    let typing = $("#typing");
    let message = $("#message");
    let sendMessage = $("#send-button");

    let username = $("#username");
    let changeUsername = $("#change-username");

    sendMessage.click(() => {
        socket.emit('new_message', { message: message.val() });
    });

    socket.on('new_message', (data) => {
        message.val('');
        feedback.append('<p>' + data.username + ': ' + data.message + '</p>');
        console.log(data);
    });

    changeUsername.click(() => {
        socket.emit('change_username', { username: username.val() });
    });

    message.bind('keypress', () => {
        socket.emit('typing');
    });

    let timeout;
    socket.on('typing', (data) => {
        setTimeout(() => {
            typing.text('');
        }, 2000);
        typing.text(data.username + ' is typing...');
    });

})