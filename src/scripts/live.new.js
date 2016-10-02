var leaves;

var app = new Vue({
  el: '#app',
  data: {
    showoptions: false,
    foodNotify: true,
    talksNotify: true,
    eventsNotify: true,
    bieneNotify: false,
    timeline: null,
    animation: true
  },
  methods: {
    options: function() {
      this.showoptions = this.showoptions ? false : true;
    },
    updateTimetable: function () {
    this.$http.get('/assets/data/events.json')
      .then(function(response) {
        if(response.body.events != this.$get('timeline')) {
          this.$set('timeline', response.body.events);
        }
      }, function(response) {
        console.log("Sth wrong");
      });
    }, 
    toggleAnimation: function (data) {
      console.log("toggle");
      if(data == false) {
        leaves.stop();
      } else {
        leaves.restart();
      }
    },
    startAnimation: function () {
      leaves = new Leaves(true);
      leaves.start();
    }
  },
  watch: {
    animation: function (data) {
      this.toggleAnimation(data);
    }
  },
});

app.updateTimetable();
app.startAnimation();

window.setInterval(function(){
  app.updateTimetable();
}, 15000);