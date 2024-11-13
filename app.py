from flask import Flask, render_template, request    
from flask_socketio import SocketIO, emit, disconnect
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

# Dictionary for tracking active users
connected_users = {}

@app.route('/')
def home():
    return render_template('index.html')

# New Connection Handler
@socketio.on('connect')
def handle_connect():
    username = request.args.get('username')
    connected_users[request.sid] = username # Add new user to connected user dictionary. Session ID is key.
    emit('users', {'users': connected_users}, broadcast=True)

# Message Handler
@socketio.on('message sent')
def msg_sent(message):
    username = message.get('username')
    msg_content = message.get('data')
    emit('messages', { 'username': username, 'data': msg_content }, broadcast=True)

# Disconnect Handler
@socketio.on('disconnectUser')
def disconnect_user(username):
    if request.sid in connected_users:
        del connected_users[request.sid]
    disconnect()
    emit('users', {'users': connected_users}, broadcast=True)

    
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)