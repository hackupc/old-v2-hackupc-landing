
(function (CONST, Util) {
	'use strict';

	////////////////////////
	// Globals
	////////////////////////
	var body;
	var main;
	var header;
	var smallHeader;
	var aside;
	var viewElements;
	var countdown;
	var schedule = {"version":-1};
	var canNotify = false;

	var itsFullscreen = false;

	var views ={
		"fullscreen" : "fullscreen",
		"live" : "live",
		"dayof" : "dayof",
		"rules" : "rules",
		"hardware" : "hardware",
		"faq" : "faq",
		"schedule" : "schedule"
	};

	var icons ={
		"logo" : "assets/img/logo.png"
	};

	var actions = {
		removeParent: function(element){
			if(element.parentElement.parentElement)
				element.parentElement.parentElement.removeChild(element.parentElement);
		},
		removeEmptyLi: function(element){
			if(element.children.length === 0)
				element.parentElement.removeChild(element);
		}
	};


	////////////////////////
	// Main functions
	////////////////////////
	function malformedDataError(){
		//TODO: decide what to do if this happens
		console.error("New schedule data appears to be malformed. "+
			"Please, try again refreshing the page. "+
			"If the problem persists please contact us");
	}

	/*
	* Generates boring tabular schedule
	*/
	function generateSchedule(){
		var container = document.createElement("div");
		schedule.days.forEach(function(day){
			container.appendChild(
				Util.inflateWith("scheduleDay",day)
			);
			var lastDiv = container.children[container.children.length-1];
			var dayTable = lastDiv.getElementsByTagName("table")[0];
			day.events.forEach(function(event){
				dayTable.tBodies[0].appendChild(
					Util.inflateWith("scheduleRow", event)
				);
			});
		});

		return container;
	}

	/*
	* Generates the list for 'live' and 'fullscreen'
	*/
	function generateFancySchedule(){
		var list = document.createElement("ul");

		schedule.days.forEach(function(day){
			//Adding day title element
			day.startTmsp = Util.dateToSeconds(day.date);
			day.endTmsp = day.startTmsp + 24*60*60;
			list.appendChild(
				Util.inflateWith("fancyTitle", day)
			);

			var eventIndex = 0;
			var nextEventTmsp = Util.hourToSeconds(
				day.events[eventIndex].startHour
			);
			//Adding events for that day
			for(var i = 0; i < 24*60*60; i += CONST.SCHEDULE_STEP){
				//Add a list element for every step
				list.appendChild(
					Util.inflateWith("fancyItem", {
						"startTmsp": day.startTmsp + i,
						"endTmsp": day.startTmsp + i + CONST.SCHEDULE_STEP - 1
					})
				);
				var liEvent = list.children[list.children.length-1];

				//I think this loop could be a lot simpler
				//I just don't know how right now
				//Add events that fit in this step
				while(nextEventTmsp < i+CONST.SCHEDULE_STEP && 
					     eventIndex < day.events.length){

					day.events[eventIndex].startTmsp = day.startTmsp + nextEventTmsp;
					day.events[eventIndex].endTmsp = day.startTmsp + Util.hourToSeconds(
						day.events[eventIndex].endHour
					);

					liEvent.appendChild(
						Util.inflateWith("fancyEvent", day.events[eventIndex])
					);
					eventIndex++;
					if(eventIndex < day.events.length){
						nextEventTmsp = Util.hourToSeconds(
							day.events[eventIndex].startHour
						);
						
					}
				}
			}

		});

		return list;
	}

	/*
	* Choronological elements store start(optional) 
	* and end timestamps (in seconds)
	* A chronological element can have 3 states: none, happening, happened
	* An action callback can be specified
	*/
	function updateChronologicalElements(){
		var elements = document.querySelectorAll("[data-end-timestamp]");
		var now = Date.now()/1000;
		for(var i = 0; i < elements.length; i++){
			if(elements[i].dataset.endTimestamp < now){
				elements[i].classList.add(CONST.HAPPENED_CLASS);
				//If action callback defined
				if(elements[i].dataset.endAction &&
					actions[elements[i].dataset.endAction])
				{
					actions[elements[i].dataset.endAction](elements[i]);
				}
			}
			else if(elements[i].dataset.startTimestamp < now){
				elements[i].classList.add(CONST.HAPPENING_CLASS);
			}
			
		}
	}

	/*
	* Gets all schedule dependent elements
	* and repaints
	*/
	function paintSchedule(){
		var fancyElements = document.querySelectorAll(".events-fancy");
		var scheduleElement = document.getElementById(views.schedule);
		try{
			var fancySchedule = generateFancySchedule();
			for(var i = 0; i < fancyElements.length; i++){
				fancyElements[i].innerHTML = "<div class='hide-scroll-hack'></div>";
				fancyElements[i].appendChild(
					fancySchedule.cloneNode(true)
				);
			}
			scheduleElement.innerHTML = "";
			scheduleElement.appendChild(
				(generateSchedule()).cloneNode(true)
			);

		} catch(e) {
			console.error(e);
			malformedDataError();
		}

	}

	function updateCountdown(){
		var countdownStart = (new Date(schedule.countdownStart)).getTime();
		var current = CONST.HACKATHON_DURATION - (Date.now() - countdownStart);
		var obj = {hours: 0, minutes: 0, seconds: 0};
		if(current > 0 && current < CONST.HACKATHON_DURATION)
		{
			obj = Util.getHumanTime(current);	
		}
		else
		{
			if(current > CONST.HACKATHON_DURATION)
			{
				obj.hours = 36;
			}
		}
		
		var element = Util.inflateWith("countdownTimerTemplate",{
			hours: Util.pad(obj.hours) + ":" + Util.pad(obj.minutes),
			seconds: Util.pad(obj.seconds) + ".00"
		});
		var countdownElements = document.querySelectorAll(".countdown");
		for(var i = 0; i < countdownElements.length; i++){
			countdownElements[i].innerHTML = "";
			countdownElements[i].appendChild(
				element.cloneNode(true)
			);
		}
	}

	/*
	* Loads the schedule in the global scope
	* and checks version.
	* If version is different from local
	* executes callback
	* Added actual datetime to avoid browser cached copies of schedule
	*/
	function updateSchedule(cb){
		Util.loadFile("assets/data/schedule.json?date="+new Date().getTime(), function(data){
			var newSchedule = JSON.parse(data);

			if(!newSchedule.version)
				malformedDataError();

			//TODO: discuss, != or <
			if(schedule.version != newSchedule.version) {
				schedule = newSchedule;
				if(typeof cb == "function")
					cb();
				console.info("Schedule updated on (" + (new Date()) + "): \n"+schedule.message);
			}
			else{
				console.info("Schedule up to date");
			}

		}, function(data){
			//show
			console.error("Error getting schedule: "+data);
		});
	}

	////////////////////////
	// Navigation
	////////////////////////

	//Sets 'selected' class in binded elements
	function updateBindings(newView){
		var elements = document.querySelectorAll("[data-bind-view]");
		for(var i = 0; i < elements.length; i++){
			if(elements[i].dataset.bindView == newView)
				elements[i].classList.add(CONST.SELECTED_CLASS);
			else
				elements[i].classList.remove(CONST.SELECTED_CLASS);
		}
	}

	//Changes the hash, which triggers a route change event
	function goTo(route){
		window.location.hash ="/"+route;
	}

	function onRouteChange(){
		if(window.location.hash && window.location.hash.indexOf("/") != -1){
			var route = window.location.hash.slice(window.location.hash.indexOf("/") + 1);
			if(!!views[route]){
				updateBindings(route);
				showView(route);
			}
			else{
				console.warn("View '"+ route +"' doesn't exist."+
					" Showing default ("+CONST.DEFAULT_VIEW+").");
				goTo(CONST.DEFAULT_VIEW);
			}
		}
		else{
			goTo(CONST.DEFAULT_VIEW);
		}

		closeAsideMenu();

	}

	function changeView(view){
		for(var i = 0; i < viewElements.length; i++){
			viewElements[i].classList.remove(CONST.ACTIVE_CLASS);
		}

		document.getElementById(view).classList.add(CONST.ACTIVE_CLASS);
	}
	function toggleFullscreen(){
		if(itsFullscreen){
			hideFullscreen();
			itsFullscreen = false;
		}
		else{
			showFullscreen();
			itsFullscreen = true;
		}
	}

	function hideFullscreen(){
		Util.fadeOut(body, function(){
			Util.show(header);
			Util.show(smallHeader);
			changeView(
				window.location.hash.slice(window.location.hash.indexOf("/") + 1)
			);
			Util.fadeIn(body);
		});
	}

	function showFullscreen(){
		Util.fadeOut(body, function(){
			Util.hide(header);
			Util.hide(smallHeader);
			changeView(views.fullscreen);
			Util.fadeIn(body);
		});
	}


	function showView(view){

		Util.fadeOut(main, function(){
			changeView(view);
			Util.fadeIn(main);
		});
	}

	function notify(msg, title, icon, cb){
		var ntitle = title || CONST.DEFAULT_NOTIFICATION_TITLE;
		var notification = new Notification(ntitle, {
			body: msg,
			icon: icon || CONST.DEFAULT_NOTIFICATION_ICON
		});

		notification.onclick = function(){
			if(typeof cb == "function")
					cb();

			notification.close.bind(notification);
		};

		setTimeout(function(){
			notification.close.bind(notification);
		}, CONST.NOTIFICATION_TIMEOUT);
	}

	function openAsideMenu(){
		//Prevent seeing under veil
		//(for some reason veil is shorter than body)
		document.body.scrollTop=0;

		Util.blockScroll(body);
		aside.classList.remove("hidden");
		//Force dom repaint
		setTimeout(function(){
			aside.classList.remove("closed");
		},1);
		Util.veil(body);
	}

	function closeAsideMenu(){
		Util.unveil(body);
		aside.classList.add("closed");
		setTimeout(function(){
			aside.classList.add("hidden");
			Util.releaseScroll(body);
		}, CONST.ASIDE_OPEN_TIME);
	}

	////////////////////////
	// Initialization
	////////////////////////
	function browserIsCompatible(){
		return 'content' in document.createElement('template');
	}

	function initNotifications(){
		if(!("Notification" in window)){
			console.warn("This browser does not support desktop notification");
		}
		else{
			if(Notification.permission !== 'denied'){
				Notification.requestPermission(function(permission){
					if(permission === "granted")
						canNotify = true;
				});
			}
		}
	}

	function init(){
		body = document.body;
		main = document.getElementsByTagName("main")[0];
		header = document.getElementById("header-nav-bar");
		smallHeader = document.getElementById("header-small");
		aside = document.getElementById("aside-small-menu");
		viewElements = document.querySelectorAll("body main > article");

		window.addEventListener("hashchange", onRouteChange);
		document.addEventListener("keypress", function(ev){
			var key = ev.which;
			if(String.fromCharCode(key) == 'f')
				toggleFullscreen();
			
		});
		document.getElementById("countdown-li").addEventListener("click",function(){
			goTo(views.live);
		});

		document.getElementById("open-aside-btn").addEventListener("click", function(){
			openAsideMenu();
		});
		document.getElementById("close-aside-btn").addEventListener("click", function(){
			closeAsideMenu();
		});
	}

	document.addEventListener("DOMContentLoaded", function(event){

		if(!browserIsCompatible()){
			alert("Please update your browser");
			return;
		}

		updateSchedule(function(){
			init();
			paintSchedule();
			updateChronologicalElements();
			updateCountdown();
			//Load current view
			onRouteChange();

			initNotifications();

			//Keep polling the schedule
			setInterval(function(){
				updateSchedule(function(){
					notify(schedule.message, "Schedule changed!", icons.logo, function(){
						goTo(views.schedule);
					});

					Util.fadeOut(main, function(){
						paintSchedule();
						updateChronologicalElements();
						setTimeout(function(){
							Util.fadeIn(main);
						},CONST.FADE_TIME*1.2);
					});
				});
			}, CONST.SCHEDULE_REFRESH_INTERVAL);

			setInterval(function(){
				updateCountdown();
			}, 1000);

			setInterval(function(){
				updateChronologicalElements();
			}, 60000);

		});


	});

}(CONST, Util));


