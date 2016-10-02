var leaves;

var app = new Vue({
	el: '#app',
	data: {
		title: 'Title here',
		subtitle: '',
		showoptions: false,
	},
	methods: {
		toggleOptions: function() {
			this.showoptions = !this.showoptions;
			if(this.showoptions) {
				document.getElementById("titleedit").focus();
			}
		}
	}
});

leaves = new Leaves(false);
leaves.start();

console.log("Press 'Control+e' for editing options!");

window.addEventListener("keypress", function(e) {
	if(e.key == "e" && e.ctrlKey) {
		app.toggleOptions();
	}
}); 