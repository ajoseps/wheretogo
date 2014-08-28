var myDataRef = new Firebase('https://tbz71x63fad.firebaseio-demo.com/');
var url = "https://www.google.com/maps/embed/v1/search?key=AIzaSyBYZHhfGSwRMN1vFWDi2r2mnc-D09jwDDk";

$(document).ready(function() {
  myDataRef.child("query").on('value', function(snapshot){
    updateMap(snapshot);
  });
});

myDataRef.child("query").on('child_changed', function(snapshot){
  updateMap(snapshot);
});

$("#searchInput").keypress(function (e){
  if(e.keyCode == 13) {
    var params = "&q=" + $('#searchInput').val().replace(/ /g, "+");
    myDataRef.set({query:params});
    var srcurl = url + params;
    var mapHtml = '<iframe id="map" width="100%" height="100%" frameborder="0" style="border:0" src=' + srcurl + '> </iframe>'
    $('#map').replaceWith(mapHtml);
  }        
});

$('#messageInput').keypress(function (e) {
  if (e.keyCode == 13) {
    var name = $('#nameInput').val();
    var text = $('#messageInput').val();
    myDataRef.child("conversation").push({name: name, text: text});
    $('#messageInput').val('');
  }
});

myDataRef.child("conversation").on('child_added', function(snapshot) {
  var message = snapshot.val();
  displayChatMessage(message.name, message.text);
});

function displayChatMessage(name, text) {
  $('<li/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesOutputDiv'));
  $('#messagesOutputDiv')[0].scrollTop = $('#messagesOutputDiv')[0].scrollHeight;
};

function updateMap(snapshot){
  var changedQuery = snapshot.val();
  console.log(changedQuery);
  var srcurl = url + changedQuery;
  var mapHtml = '<iframe id="map" width="100%" height="100%" frameborder="0" style="border:0" src=' + srcurl + '> </iframe>'
  $('#map').replaceWith(mapHtml);
}