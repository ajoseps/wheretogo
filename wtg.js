var myDataRef = new Firebase('https://sizzling-torch-2010.firebaseio.com/');
var url = "https://www.google.com/maps/embed/v1/search?key=AIzaSyBYZHhfGSwRMN1vFWDi2r2mnc-D09jwDDk";
var currenUrl = "http://127.0.0.1:8000/room.html"
var session = '';


$(document).ready(function() {
  var roomID = getParameterByName('roomID');
  doesRoomExist(roomID);

  // Initalizes Map
  myDataRef.child("query").on('value', function(snapshot){
    updateMap(snapshot);
  });

  // Listener for new messages
  myDataRef.child("conversation").on('child_added', function(snapshot){
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
  });

});

// Listener for 'Share Link' button click
$("#shareButton").click(function(){
  copyToClipboard();
});

// Stores search input into session's query slot (location) once entered
$("#searchInput").keypress(function (e){
  if(e.keyCode == 13) {
    var params = "&q=" + $('#searchInput').val().replace(/ /g, "+");
    myDataRef.update({query:params});
    var srcurl = url + params;
    var mapHtml = '<iframe id="map" width="100%" height="100%" frameborder="0" style="border:0" src=' + srcurl + '> </iframe>'
    $('#map').replaceWith(mapHtml);
  }        
});

// Stores message into session's conversation once entered
$('#messageInput').keypress(function (e) {
  if (e.keyCode == 13) {
    var name = $('#nameInput').val();
    var text = $('#messageInput').val();
    myDataRef.child("conversation").push({name: name, text: text});
    $('#messageInput').val('');
  }
});

// Displays messages
function displayChatMessage(name, text) {
  $('<li/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesOutputDiv'));
  $('#messagesOutputDiv')[0].scrollTop = $('#messagesOutputDiv')[0].scrollHeight;
};

// Update's the map's image
function updateMap(snapshot){
  var changedQuery = snapshot.val();
  var srcurl = url + changedQuery;
  var mapHtml = '<iframe id="map" width="100%" height="100%" frameborder="0" style="border:0" src=' + srcurl + '> </iframe>'
  $('#map').replaceWith(mapHtml);
}

// Checks if the room of specified id exists in firebase
function doesRoomExist(id){
  if(id == '')
    loadRoom(false);
  var base = new Firebase('https://sizzling-torch-2010.firebaseio.com/');
  base.child(id).once('value', function(snapshot){
    var exists = (snapshot.name() !== null);
    loadRoom(exists, id);
  })
}

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript?page=1&tab=votes#tab-top
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Loads new or pre-existing room accordingly
function loadRoom(exists, roomID){
  if(!exists){
    session = myDataRef.push({conversation:{},query:"&q=Sunnyvale"});
    myDataRef = session;
    session = session.name();
  }
  else{
    session = new Firebase(myDataRef + "/" + roomID);
    myDataRef = session;
    session = roomID;

    // Load Existing Map
    myDataRef.child("query").once('value', function(snapshot){
      updateMap(snapshot);
    })

    // Load Existing Messages
    myDataRef.child("conversation").once('child_added', function(snapshot){
      var message = snapshot.val();
      displayChatMessage(message.name, message.text);
    });
  }

  // Initalizes Map
  myDataRef.child("query").on('value', function(snapshot){
    updateMap(snapshot);
  });

  // Listener for new messages
  myDataRef.child("conversation").on('child_added', function(snapshot){
    var message = snapshot.val();
    displayChatMessage(message.name, message.text);
  });
}

// Prompts user to copy link to current room to clipboard to share
function copyToClipboard() {
  window.prompt("Copy Link to Room: Ctrl+C, Enter", currenUrl + "?roomID=" + session);
}