$(document).ready(function() {
  var eventsLoaded = function(json) {
    var showEvents = function(template, place, data) {
      place.append(template(data));
    } 

    json.events.map(function(ev){
      ev.begin = new Date(ev.begin);
      ev.end = new Date(ev.end);

      ev.beginTime = ev.begin.toTimeString().substr(0, 5);
      ev.endTime = ev.end.toTimeString().substr(0, 5);

      ev.day = ev.begin.getDate();
    });
    var activeEvents = json.events.filter(function(ev){
      return ev.end >= Date.now();
    });

    var fridayEvents = activeEvents.filter(function(ev){
      return ev.day == 19;
    });
    var saturdayEvents = activeEvents.filter(function(ev){
      return ev.day == 20;
    });
    var sundayEvents = activeEvents.filter(function(ev){
      return ev.day == 21;
    });

    $.ajax({
      url: "/assets/templates/events-list.hbs",
      type: "GET",
      success: function(data) {
          var template = Handlebars.compile(data);
          var place = $("#timetable");
          if (fridayEvents.length > 0) {
            showEvents(template, place, {day: "Friday", events: fridayEvents});
          }
          if (saturdayEvents.length > 0) {
            showEvents(template, place, {day: "Saturday", events: saturdayEvents});
          }
          if (sundayEvents.length > 0) {
            showEvents(template, place, {day: "Sunday", events: sundayEvents});
          }
          
          $("#list-applications tbody").html(template(json));
      }
    });
  };

  $.ajax({
      url: "/assets/data/events.json",
      type: "GET",
      dataType : "json",
      success: eventsLoaded,
   
      // Code to run if the request fails; the raw request and
      // status codes are passed to the function
      error: function(xhr, status, errorThrown) {
          console.log("Error: " + errorThrown);
          console.log("Status: " + status);
          console.dir(xhr);
      },
   
      // Code to run regardless of success or failure
      complete: function(xhr, status) {
      }
  });


});