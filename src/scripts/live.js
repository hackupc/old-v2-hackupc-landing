var leaves;

// Testing flag, for mocking the dates of the events
// without having to change the dates in the events.json
var testing = false;

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
    animation: true,
    reload: false
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
      }, 30000);
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
      index = app.oldIndexById(event._id);

      if(index == -1) {
        event.notifySent = false;
      } else {
        event.notifySent = this.events[index].notifySent;
      }

      event.begin = new Date(event.begin);

      if(event.end === "") {
        event.end = new Date(event.begin.getTime() + 10*60000);
        event.showProgress = false;
      } else {
        event.end = new Date(event.end);
        event.showProgress = true;
      }
      
      event.progress = app.whereAreWe(event.begin, event.end);

      if(!event.notifySent && event.progress > 0) {
         app.notify(event.title, event.place, event.type);
         event.notifySent = true;
      }

      return event;
    },

    // fn updateEvent()
    // updates an existing event with new
    // info
    updateEvent: function(event) {
        index = app.oldIndexById(event._id);

        event.begin = new Date(event.begin);
        event.end = new Date(event.end);
        newProgress = app.whereAreWe(event.begin, event.end);

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

    // fn updateTimetable()
    // updates the event array with the current json
    // manages all updates to the events
    updateEvents: function () {
    this.$http.get('/assets/data/events.json?nocache=' + Math.floor(Math.random()*100000))
      .then(function(response) {
        old_events = this.$get('events');
        new_events = response.body.events;

        for (var i = 0; i < new_events.length; i++) {
          new_events[i] = app.newEvent(new_events[i]); 
        }

        new_events.sort(function(a,b){
          return (a.begin - b.begin) ||
                 (a.end - b.end) ||
                 (b.title < a.title ? 1 : -1);
        });

        this.$set('events', new_events);
      }, function(response) {
        console.log("Sth wrong");
      });
    },

    biene: function () {
      alert("BIENE");
    },

    // Toggles animation between stopped and started state
    toggleAnimation: function (data) {
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
        return (d - start)/(end - start);;
      } else if(d < start) {
        return -2; // Before the range
      } else if(d > end) {
        return -1; // After the range
      }
    },

    // Notify the user of the events according
    // to his preferences
    notify: function (title, place, type) {
      if(typeof Notification === 'function' &&
        !navigator.userAgent.match(/IEMobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Mobile Safari|Opera Mini|\bCrMo\/|Opera Mobi/i)) {
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
      }).slice(-3);
    },
    currentEvents: function() {
      current = this.events.filter(function(data) {
        this.reload = false;
        return app.whereAreWe(data.begin, data.end) > 0;
      });

      return current;
    },
    futureEvents: function() {
      future = this.events.filter(function(data) {
        return app.whereAreWe(data.begin, data.end) === -2;
      });

      return future;
    }
  },
  filters: {
    hackupcdate: function (date) {
      return date.getHours() + ":" + date.getMinutes().pad(2) + ":" + date.getSeconds().pad(2);
    }
  }
});
