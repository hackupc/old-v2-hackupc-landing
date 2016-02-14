function showEvents (template, target, data) {
  var html = template(data)
  target.append(html)
}

var parseEventData = function (evData) {
  var events = evData.events
  events.forEach(function (ev) {
    ev.begin = new Date(ev.begin)
    ev.end = new Date(ev.end)
    ev.beginTime = ev.begin.toTimeString().substr(0, 5)
    ev.endTime = ev.end.toTimeString().substr(0, 5)
    ev.day = ev.begin.getDate()
  })

  var activeEvents = events.filter(function (ev){
    return ev.end >= Date.now()
  })
  var fridayEvents = activeEvents.filter(function (ev){
    return ev.day == 19
  })
  var saturdayEvents = activeEvents.filter(function (ev){
    return ev.day == 20
  })
  var sundayEvents = activeEvents.filter(function (ev){
    return ev.day == 21
  })

  $.ajax({
    url: '/assets/templates/events-list.hbs',
    type: 'GET',
    success: function (rawTemplate) {
      var template = Handlebars.compile(rawTemplate)
      var target = $('#timetable')
      if (fridayEvents.length > 0) {
        showEvents(template, target, {day: 'Friday', events: fridayEvents})
      }
      if (saturdayEvents.length > 0) {
        showEvents(template, target, {day: 'Saturday', events: saturdayEvents})
      }
      if (sundayEvents.length > 0) {
        showEvents(template, target, {day: 'Sunday', events: sundayEvents})
      }
    }
  })
}

function ajaxFailed (xhr, status, errorThrown) {
  console.log('Error: ' + errorThrown)
  console.log('Status: ' + status)
  console.dir(xhr)
}

$(document).ready(function () {
  $.ajax({
    url: '/assets/data/events.json',
    type: 'GET',
    dataType : 'json',
    success: parseEventData,
    error: ajaxFailed
  })
})
