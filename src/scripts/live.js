var leaves;

// Testing flag, for mocking the dates of the events
// without having to change the dates in the events.json
var testing = true;
var first = true;


var app = new Vue({
  el: '#app',
  data: {
    showoptions: false,
    foodNotify: true,
    talksNotify: true,
    eventsNotify: true,
    bieneNotify: false,
    timeline: null,
    animation: true,
    dateFormat: "%H:%M:%S"
  },
  methods: {
    options: function() {
      this.showoptions = this.showoptions ? false : true;
    },
    updateTimetable: function () {
    this.$http.get('/assets/data/events.json?nocache=' + Math.floor(Math.random()*100))
      .then(function(response) {
        timeline = this.$get('timeline')
        events = response.body.events;

        if(first) {
          for(var i = 0; i < events.length; i++) {
            events[i].notifySent = false;
          }
        } else {
          for(var i = 0; i < events.length; i++) {
            events[i].notifySent = timeline[i].notifySent;
          }
        }

        // For testing we use the current time and create
        // events in the near future
        if(testing && first) {
          first = false;
          for(var i = 0; i < events.length; i++) {
            events[i].begin = new Date(Date.now() + i*30000);
            events[i].end = new Date(Date.now() + (i+1)*30000);
          }
        } else if(!testing) {
          for(var i = 0; i < events.length; i++) {
            events[i].begin = new Date(events[i].begin);
            events[i].end = new Date(events[i].end);
          }
        } else { // for testing, we keep the old times
          for(var i = 0; i < events.length; i++) {
            events[i].begin = timeline[i].begin;
            events[i].end = timeline[i].end;
          }
        }

        for(var i = 0; i < events.length; i++) {
          if(app.whereAreWe(events[i].begin, events[i].end) > 0 && !events[i].notifySent){
            events[i].notifySent = true;
            app.notify(events[i].title, events[i].place, events[i].type);
          }
        }

        this.$set('timeline', events);
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
      return this.timeline.filter(function(data) {
        return app.whereAreWe(data.begin, data.end) === -1;
      }).slice(-5);
    },
    currentEvents: function() {
      return this.timeline.filter(function(data) {
        percentage = app.whereAreWe(data.begin, data.end);
        if(percentage > 0) {
          if(!data.notifySent) {
            app.notify(data.title, data.place, "essential");
            data.notifySent = true;
          }
          return true;
        }
      });
    },
    futureEvents: function() {
      return this.timeline.filter(function(data) {
        return app.whereAreWe(data.begin, data.end) === -2;
      });
    }
  }
});

app.updateTimetable();
app.startAnimation();
app.notify("Welcome to HackUPC Live", null, "essential");

if(testing){
   window.setInterval(function(){
      app.updateTimetable();
    }, 1000);
} else {
  window.setInterval(function(){
    app.updateTimetable();
  }, 15000);
}
