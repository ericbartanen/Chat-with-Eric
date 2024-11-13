document.getElementById('enterName').addEventListener('submit', function(event) {
    event.preventDefault();

    // Variables for page elements
    const username = document.getElementById('username').value;
    const enterMessage = document.getElementById('enterMessage');
    const input = document.getElementById('input');
    const disconnectUser = document.getElementById('disconnect');

    if (username) {

        // Hide sign in page after name is entered and show chat 
        document.getElementById('enterName').style.display = 'none';
        document.getElementById('chatSection').style.display = 'block';
        document.getElementById('userSection').style.display = 'block';

        // Connect to server
        const socket = io.connect('http://localhost:5000', {
            query: { username: username }
        });

        // Show connected users
        socket.on('users', function(msg) {
            document.getElementById('users').replaceChildren(); //Remove all Users to avoid duplicates
            
            // Loop through object from server with all connected users
            for (const name in msg.users) {
                const li = document.createElement('li');
                li.textContent = msg.users[name];
                document.getElementById('users').appendChild(li);
            }
        });

        // Handle form submission and send message to server
        enterMessage.addEventListener('submit', (event) => {
            event.preventDefault();
            const message = input.value;
            socket.emit('message sent', { username: username, data: message});
            input.value = ''; // Clear input field
        })

        // Receive messages from server and display to client
        socket.on('messages', function(msg) {
            const li = document.createElement('li');
            li.textContent = `${msg.username}: ${msg.data}`;
            document.getElementById('messages').appendChild(li);
        })

        // Disconnect user
        disconnectUser.addEventListener('submit', (event) => {
            console.log("event heard")
            event.preventDefault();
            socket.emit('disconnectUser', { username: username });
            location.reload();
        })
    }
});