$(document).ready(function() {
  var socket = io.connect('http://localhost');

  socket.on('message', function(services) {
    var s = $('#services');
    s.html('');
    for (i in services) {
      var name = services[i].name;
      var status = services[i].status;
      s.append('<div id="' + name + '" class="service"> <div class="service-status" data-status="' + status + '"></div> <p>' + name + '</p> <p class="last-updated">last updated<span class="last-updated-time"> ' + Date() + '</span></p> </div> ');
    }
  });
});