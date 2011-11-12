$(document).ready(function() {
  var socket = io.connect('http://localhost');

  socket.on('message', function(services) {
    for (var i=0 ; i <= (services.length - 1); i++) {
      var name = services[i].name;
      var status = services[i].status;
      var service = $('#' + name);
      var service_status = service.find('.service-status');
      var last_updated = service.find('.last-updated-time');
      service_status.attr('data-status', status);
      last_updated.html(' ' + Date());
    }
  });
});