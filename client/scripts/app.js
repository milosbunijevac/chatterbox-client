// YOUR CODE HERE:
var message;
var url = document.URL;
var user = url.substring(url.lastIndexOf('=') + 1);
user = user.replace(/\W/g, '')

function getMessage() {
    message = {
        username: user,
        text: $('#userMessage').val(),
        roomname: $('select').val(),
    };
    console.log(message);
    return message;
}
var app = $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    contentType: 'application/json'
});

app.init = function () {

}
app.send = function (message) {
    $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
            console.log('chatterbox: Message sent');
        },
        error: function (data) {
            // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
            console.error('chatterbox: Failed to send message', data);
        }
    });
    app.renderMessage(message);
}
app.fetch = function () {
    return $.ajax({
        // This is the url you should use to communicate with the parse API server.
        type: 'GET',
        contentType: 'application/json'
    });

}
app.clearMessages = function () {
    document.getElementById("chats").innerHTML = "";
}
app.renderMessage = function (message) {
    $('#chats').append(`<p>${message.username}: 
        ${message.text}</p>`);
}

app.renderRoom = function (str) {
    $('#roomSelect').append(new Option(`${str}`));
}

app.handleUsernameClick = function () {
    $('#main').find('.username').trigger('click');
}
app.handleSubmit = function () {
    $('#send .submit').trigger('submit');
}

function myFunction() {
    document.getElementById("roomSelected").classList.toggle("show");
}

// window.onclick = function (event) {
//     if (!event.target.matches('.dropbtn')) {

//         var dropdowns = document.getElementsByClassName("dropdown-content");
//         var i;
//         for (i = 0; i < dropdowns.length; i++) {
//             var openDropdown = dropdowns[i];
//             if (openDropdown.classList.contains('show')) {
//                 openDropdown.classList.remove('show');
//             }
//         }
//     }
// }
var room;

function promptRoom() {
    room = prompt("Enter room name:");
    app.renderRoom(room);
}
console.log(app);

var lobby;

function lobbyCheck() {
    lobby = $('select').val();
    if (lobby === undefined) {
        lobby = "lobby";
    }
    return lobby;
}
lobbyCheck();

function updater() {
  app.clearMessages();
    $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
        type: 'GET',
        data: {
            order: '-createdAt'
        },
        success: function (data) {
            var dataMess = data.results;
            for (var i = 0; i < 100; i++) {
                app.renderRoom(dataMess[i].roomname);
                if (dataMess[i].text && dataMess[i].text.includes("<script>")) {} else {
                    if (dataMess[i].roomname === undefined) {
                        dataMess[i].roomname = "lobby";
                    }
                    if (dataMess[i].roomname === lobby) {
                        app.renderMessage(dataMess[i]);
                    }
                }
            }
        },
      error: function (data) {
            // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
}