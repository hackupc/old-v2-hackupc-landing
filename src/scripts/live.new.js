var leaves;
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
    this.$http.get('/assets/data/events.json')
      .then(function(response) {
        timeline = this.$get('timeline')
        if(response.body.events != timeline) {
          events = response.body.events;

          if(testing && first) {
            first = false;
            for(var i = 0; i < events.length; i++) {
              events[i].begin = new Date(Date.now() + i*30000);
              events[i].end = new Date(Date.now() + i*60000);
            }
          } else if(!testing) {
            for(var i = 0; i < events.length; i++) {
              events[i].begin = new Date(events[i].begin);
              events[i].end = new Date(events[i].end);
            }
          } else {
            for(var i = 0; i < events.length; i++) {
              events[i].begin = timeline[i].begin;
              events[i].end = timeline[i].end;
            }
          }

          this.$set('timeline', events);
        }
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
        return percentage > 0;
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

window.setInterval(function(){
  app.updateTimetable();
}, 5000);