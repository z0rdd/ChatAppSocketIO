from flask import Flask, request
from flask_socketio import SocketIO, send, emit


app = Flask(__name__)
app.config['SECRET_KEY'] = '!$EDQDAD!231 d%%hGGHhjj2#%YH^^'

socketio = SocketIO(app)
users = dict()


@socketio.on('newUser')
def handle_user(usr):
    users[usr] = request.sid
    print(users)
    print(request.sid)
    emit('loggedUsers', [usr, users],  broadcast=True)


@socketio.on('dc-user')
def handle_user_dc(usr):
    users.pop(usr)
    emit('dcUsers', [usr, users],  broadcast=True) # some stuff


@socketio.on('message')
def handle_message(msg):

    print('Message:' + msg)
    send(msg, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
