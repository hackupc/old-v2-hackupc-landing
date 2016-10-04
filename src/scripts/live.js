var leaves;

// Testing flag, for mocking the dates of the events
// without having to change the dates in the events.json
var testing = true;

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

var app = new Vue({
  el: '#app',
  data: {
    showoptions: false,
    foodNotify: true,
    talksNotify: true,
    eventsNotify: true,
    bieneNotify: false,
    events: [],
    activeIds: [],
    animation: true
  },
  ready: function() {
    this.updateEvents();
    this.startAnimation();
    this.notify("Welcome to HackUPC Live", null, "essential");

    if(testing){
       window.setInterval(function(){
          app.updateEvents();
        }, 1000);
    } else {
      window.setInterval(function(){
        app.updateEvents();
      }, 15000);
    }
  },
  methods: {
    options: function() {
      this.showoptions = this.showoptions ? false : true;
    },

    // fn newEvent()
    // creates a new event in the event
    // array, with notify status and 
    // the text dates converted to Date 
    // objects
    newEvent: function(event) {
      event.notifySent = false;
      event.begin = new Date(event.begin);
      event.end = new Date(event.end);
      event.progress = app.whereAreWe(event.begin, event.end);
      app.events.push(event);
    },

    // fn updateEvent()
    // updates an existing event with new
    // info
    updateEvent: function(event) {
        index = app.oldIndexById(event._id);

        event.notifySent = this.events[index].notifySent;
        event.begin = new Date(event.begin);
        event.end = new Date(event.end);
        event.progress = app.whereAreWe(event.begin, event.end);

        this.events.$set(index, event);
    },

    // fn oldIndexById()
    // find event in old event list by ID,
    // if event is found the index is returned
    // if it is not found -1 is returned
    oldIndexById: function(id) {
      old_events = this.$get('events')

      if(old_events != null) {
        for(var i = 0; i < old_events.length; i++) {
          if(old_events[i]._id == id) {
            return i;
          }
        }
      }

      return -1;
    },

    // fn deleteIndex()
    // deletes an event at index idx
    deleteIndex: function(idx) {
      this.events.splice(idx, 1);
    },

    // fn deleteDanglingEvents()
    // deletes all events that don't exist anymore
    // and those with an invalid id
    deleteDanglingEvents: function() {
      for (var i = this.events.length - 1; i >= 0; i--) {
        if(this.events[i]._id == "") {
          app.deleteIndex(i);
        }

        if(this.activeIds.indexOf(this.events[i]._id) == -1) {
          app.deleteIndex(i);
        }
      }
    },

    // fn updateTimetable()
    // updates the event array with the current json
    // manages all updates to the events
    updateEvents: function () {
    this.$http.get('/assets/data/events.json?nocache=' + Math.floor(Math.random()*100000))
      .then(function(response) {
        old_events = this.$get('events');
        new_events = response.body.events;

        this.activeIds = [];

        for(var i = 0; i < new_events.length; i++) {
          new_event = new_events[i];

          old_index = app.oldIndexById(new_event._id);
          this.activeIds.push(new_event._id);

          if(old_index >= 0) { // Event exists in old event list
            old_event = old_events[old_index];

            if(old_event._signature != new_event._signature) { // content has changed
              app.updateEvent(new_event);

              // after the change the event is in the future
              if(app.whereAreWe(new_event.begin, new_event.end) != -2) {
                old_events[old_index].notifySent = false;
              }
            } else { // content hasn't changed, notify if it's time and user hasn't
                     // been notified yet
              if(app.whereAreWe(old_event.begin, old_event.end) > 0) {
                app.updateEvent(new_event);

                if(!old_event.notifySent) {
                  app.notify(old_event.title, old_event.place, old_event.type);
                  this.events[old_index].notifySent = true;
                }
              }
            }
          } else if(old_index == -1) { // Event doesn't exist
            app.newEvent(new_event);
          }
        }

        app.deleteDanglingEvents();
      }, function(response) {
        console.log("Sth wrong");
      });
    },

    // Toggles animation between stopped and started state
    toggleAnimation: function (data) {
      console.log("toggle");
      if(data == false) {
        leaves.stop();
      } else {
        leaves.restart();
      }
    },

    // Starts background animation
    startAnimation: function () {
      leaves = new Leaves(true);
      leaves.start();
    },

    // Returns false if not in range and percentage of completion if true
    whereAreWe: function (start, end) {
      d = new Date(Date.now());
      
      if(start <= d && d <= end) { // Inside the range
        return (d - start)/(end - start);
      } else if(d < start) {
        return -2; // Before the range
      } else if(d > end) {
        return -1; // After the range
      }
    },

    // Notify the user of the events according
    // to his preferences
    notify: function (title, place, type) {
      permission = Notification.permission;
      if(permission !== "denied") {
        if(permission === "default") {
          Notification.requestPermission();
        }

        notifiable = false;
        if((type === "food" && this.foodNotify)
          || (type === "events" && this.eventsNotify) 
          || (type === "talks" && this.talksNotify)
          || (type === "essential")) {
          notifiable = true;
        }

        if (permission === "granted" && notifiable) {
          var options = {
            body: place != null ? 'happening right now at ' + place : '',
            icon: '/favicon.ico',
          }

          new Notification(title, options);
        }
      }
    }
  },
  watch: {
    animation: function (data) {
      this.toggleAnimation(data);
    }
  },
  computed: {
    completedEvents: function() {
      return this.events.filter(function(data) {
        return app.whereAreWe(data.begin, data.end) === -1;
      }).slice(-2);
    },
    currentEvents: function() {
      return this.events.filter(function(data) {
        return app.whereAreWe(data.begin, data.end) > 0;
      });
    },
    futureEvents: function() {
      return this.events.filter(function(data) {
        return app.whereAreWe(data.begin, data.end) === -2;
      });
    }
  },
  filters: {
    hackupcdate: function (date) {
      return date.getHours() + ":" + date.getMinutes().pad(2) + ":" + date.getSeconds().pad(2);
    }
  }
});
