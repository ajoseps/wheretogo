var myDataRef = new Firebase('https://sizzling-torch-2010.firebaseio.com/');
var url = "https://www.google.com/maps/embed/v1/search?key=AIzaSyBYZHhfGSwRMN1vFWDi2r2mnc-D09jwDDk";
var session = '';

$(document).ready(function() {
  session = myDataRef.push({conversation:{}, query:"&q=Palo+Alto"});
  session.child("conversation").push({name:"WTG",text:"Welcome!"});
  session = session.name();
  myDataRef = myDataRef.child(session);

  // Initalizes Map
  myDataRef.child("query").on('value', function(snapshot){
    updateMap(snapshot);
  });
});

// Listener for map updates
myDataRef.child("query").on('child_changed', function(snapshot){
  updateMap(snapshot);
});

// Stores search input into session's query slot (location) once entered
$("#searchInput").keypress(function (e){
  if(e.keyCode == 13) {
    var params = "&q=" + $('#searchInput').val().replace(/ /g, "+");
    myDataRef.set({query:params});
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

// Listener for new messages
myDataRef.child("conversation").on('child_added', function(snapshot) {
  var message = snapshot.val();
  console.log("NEW: " + message[0]);
  displayChatMessage(message.name, message.text);
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