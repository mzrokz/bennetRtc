// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Experiments       - github.com/muaz-khan/WebRTC-Experiment

var config = {
    openSocket: function (config) {
        var SIGNALING_SERVER = 'https://socketio-over-nodejs2.herokuapp.com:443/';

        config.channel = config.channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');
        var sender = Math.round(Math.random() * 999999999) + 999999999;

        io.connect(SIGNALING_SERVER).emit('new-channel', {
            channel: config.channel,
            sender: sender
        });

        var socket = io.connect(SIGNALING_SERVER + config.channel);
        socket.channel = config.channel;
        socket.on('connect', function () {
            if (config.callback) config.callback(socket);
        });

        socket.send = function (message) {
            debugger;
            socket.emit('message', {
                sender: sender,
                data: message
            });
        };

        socket.on('message', config.onmessage);
    },
    onRemoteStream: function (media) {
        var audio = media.audio;
        audio.setAttribute('controls', true);
        audio.setAttribute('autoplay', true);

        participants.insertBefore(audio, participants.firstChild);

        audio.play();
        rotateAudio(audio);
    },
    onRoomFound: function (room) {
        var alreadyExist = document.getElementById(room.broadcaster);
        if (alreadyExist) return;

        if (typeof roomsList === 'undefined') roomsList = document.body;

        debugger;
        var tr = document.createElement('tr');
        tr.setAttribute('id', room.broadcaster);
        tr.setAttribute('token', room.roomToken);

        var td1 = document.createElement('td');
        td1.innerText = room.roomName;
        tr.appendChild(td1);

        var td2 = document.createElement('td');
        // td2.innerText = room.roomName;

        var textBox = document.createElement('input');
        textBox.setAttribute('id', 'userName');

        var button = document.createElement('button');
        button.setAttribute('id', room.roomToken);
        button.innerText = "Join Room";

        td2.appendChild(textBox);
        td2.appendChild(button);
        tr.appendChild(td2);

        // tr.innerHTML = '<td>' + + '</td>' +
        //     '<td>' + inputHtml + '<button class="join" id="' + room.roomToken + '">Join Room</button></td>';
        roomsList.insertBefore(tr, roomsList.firstChild);

        button.onclick = function () {
            captureUserMedia(function () {
                var token = tr.getAttribute('token');
                broadcastUI.joinRoom({
                    roomToken: token,
                    joinUser: tr.id,
                    userName: textBox.value
                });
            });
            hideUnnecessaryStuff();
        };
    }
};

function createButtonClickHandler() {
    captureUserMedia(function () {
        broadcastUI.createRoom({
            roomName: (document.getElementById('conference-name') || {}).value || 'Anonymous'
        });
    });
    hideUnnecessaryStuff();
}

function captureUserMedia(callback) {
    debugger;
    var audio = document.createElement('audio');
    audio.setAttribute('autoplay', true);
    audio.setAttribute('controls', true);

    audio.muted = true;
    audio.volume = 0;

    participants.insertBefore(audio, participants.firstChild);

    getUserMedia({
        video: audio,
        constraints: { audio: true, video: false },
        onsuccess: function (stream) {
            config.attachStream = stream;
            callback && callback();

            audio.muted = true;
            audio.volume = 0;

            rotateAudio(audio);
        },
        onerror: function () {
            alert('unable to get access to your microphone.');
            callback && callback();
        }
    });
}

/* on page load: get public rooms */
var broadcastUI = broadcast(config);

/* UI specific */
var participants = document.getElementById("participants") || document.body;
var startConferencing = document.getElementById('start-conferencing');
var roomsList = document.getElementById('rooms-list');

if (startConferencing) startConferencing.onclick = createButtonClickHandler;

function hideUnnecessaryStuff() {
    var visibleElements = document.getElementsByClassName('visible'),
        length = visibleElements.length;
    for (var i = 0; i < length; i++) {
        visibleElements[i].style.display = 'none';
    }
}

function rotateAudio(audio) {
    audio.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
    setTimeout(function () {
        audio.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
    }, 1000);
}

(function () {
    var uniqueToken = document.getElementById('unique-token');
    if (uniqueToken)
        if (location.hash.length > 2) uniqueToken.parentNode.parentNode.parentNode.innerHTML = '<h2 style="text-align:center;"><a href="' + location.href + '" target="_blank">Share this link</a></h2>';
        else uniqueToken.innerHTML = uniqueToken.parentNode.parentNode.href = '#' + (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace(/\./g, '-');
})();
