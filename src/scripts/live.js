var events
var fridayEvents
var saturdayEvents
var sundayEvents

var template
var lastHalf
var titleDate = document.getElementById('title-date')
var timetable = document.getElementById('timetable')

function showEvents (template, target, data) {
  var html = template(data)
  target.innerHTML += html
}

function pendingEvent (ev) {
  return !ev.done
}

function eventComparator (ev1, ev2) {
  if (ev1.done != ev2.done) return Number(ev2.done) - Number(ev1.done)
  return ev1.begin - ev2.begin
}

function renderTimetable () {
  var now = Date.now()
  events.forEach(function (ev) {
    ev.highlight = ev.begin <= now && now <= ev.end
    ev.done = ev.end < now
  })
  fridayEvents.sort(eventComparator)
  saturdayEvents.sort(eventComparator)
  sundayEvents.sort(eventComparator)

  timetable.innerHTML = ''
  if (fridayEvents.some(pendingEvent)) {
    showEvents(template, timetable, {day: 'Friday', events: fridayEvents})
  }
  if (saturdayEvents.some(pendingEvent)) {
    showEvents(template, timetable, {day: 'Saturday', events: saturdayEvents})
  }
  if (sundayEvents.some(pendingEvent)) {
    showEvents(template, timetable, {day: 'Sunday', events: sundayEvents})
  }
}

function updateTitleDate () {
  var date = (new Date ()).toString().split(' ')
  date.splice(-2)
  titleDate.textContent = date.join(' ')
}

function parseEventData (evData) {
  events = evData.events
  events.forEach(function (ev) {
    ev.begin = new Date(ev.begin)
    ev.end = new Date(ev.end)
    ev.beginTime = ev.begin.toTimeString().substr(0, 5)
    ev.endTime = ev.end.toTimeString().substr(0, 5)
    ev.day = ev.begin.getDate()
  })

  fridayEvents = events.filter(function (ev){
    return ev.day == 19
  })
  saturdayEvents = events.filter(function (ev){
    return ev.day == 20
  })
  sundayEvents = events.filter(function (ev){
    return ev.day == 21
  })
}

function ajaxFailed (xhr, status, errorThrown) {
  console.log('Error: ' + errorThrown)
  console.log('Status: ' + status)
  console.dir(xhr)
}

$.ajax({
  url: '/assets/data/events.json',
  type: 'GET',
  dataType : 'json',
  success: parseEventData,
  error: ajaxFailed
})

$.ajax({
  url: '/assets/templates/events-list.hbs',
  type: 'GET',
  success: function (rawTemplate) {
    template = Handlebars.compile(rawTemplate)
  },
  error: ajaxFailed
})

var MIN = 60 * 1000
function timer () {
  updateTitleDate()
  var currentHalf = Math.floor(Date.now() / (30 * MIN))
  if (lastHalf != currentHalf && events && template) {
    renderTimetable()
    lastHalf = currentHalf
  }
}
timer()
setInterval(timer, 1000)
