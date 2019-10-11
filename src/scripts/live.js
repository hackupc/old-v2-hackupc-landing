
(function (CONST, Util) {
	'use strict'

	/// /////////////////////
	// Globals
	/// /////////////////////
	var body
	var main
	var header
	var smallHeader
	var aside
	var viewElements
	// var countdown
	var schedule = { 'version': -1 }
	// eslint-disable-next-line no-unused-vars
	var canNotify = false
	let itsFullscreen = false
	// To add a view, add here the id of the new article
	var views = {
		'fullscreen': 'fullscreen',
		'live': 'live',
		'dayof': 'dayof',
		'rules': 'rules',
		'travel': 'travel',
		'streaming': 'streaming',
		'faq': 'faq',
		'schedule': 'schedule',
		'challenges': 'challenges',
		'map': 'map',
		'mentors': 'mentors'
	}

	let icons = {
		'logo': 'favicon.ico'
	}

	var actions = {
		/*
        * Updates progress bar and notifies if needed
        * requires data-event-id to check subscriptions
        */
		updateFancyEvent: function (element) {
			if (isEventSubscribed(element.dataset.eventId)) {
				var offset = element.dataset.startTimestamp - Util.getNowSeconds()
				if (offset <= CONST.EVENT_NOTIF_OFFSET && offset >= 0) {
					var event = getEvent(element.dataset.eventId)
					notify(event.description, 'Happening soon: ' + event.title)
					unsubscribeEvent(element.dataset.eventId)
				}
			}
		},
		// Removes the parent element
		removeParent: function (element) {
			if (element.parentElement.parentElement) { element.parentElement.parentElement.removeChild(element.parentElement) }
		},
		removeEmptyStep: function (element) {
			if (element.children.length === 0) {
				element.parentElement.removeChild(element)
			}
		},
		// Remove happened element and parent if empty
		removeEndedEvent: function (element) {
			var parent = element.parentElement
			parent.removeChild(element)
			if (parent.children.length === 0) {
				parent.parentElement.removeChild(parent)
			}
		}
	}

	/// /////////////////////
	// Main functions
	/// /////////////////////
	function malformedDataError () {
		// TODO: decide what to do if this happens
		console.error('New schedule data appears to be malformed. Please, try again refreshing the page. If the problem persists please contact us')
	}

	/*
  * pre: requires 'schedule' with timestamaps generated
  * Generates boring tabular schedule
  */
	function generateSchedule () {
		var container = document.createElement('div')
		schedule.days.forEach(function (day) {
			container.appendChild(
				Util.inflateWith('scheduleDay', day)
			)
			var lastDiv = container.children[container.children.length - 1]
			var dayTable = lastDiv.getElementsByTagName('table')[0]
			day.events.forEach(function (event) {
				dayTable.tBodies[0].appendChild(
					Util.inflateWith('scheduleRow', event)
				)
			})
		})

		return container
	}

	/*
  * Generates timestamps (UTC) inside 'schedule'
  */
	function generateTimestamps () {
		schedule.days.forEach(function (day) {
			day.startTmsp = Util.dateStringToSeconds(day.date) + parseInt(schedule.baseTimeOffset) * 60

			day.endTmsp = day.startTmsp + 24 * 60 * 60 + parseInt(schedule.baseTimeOffset) * 60

			day.events.forEach(function (event) {
				event.startTmsp = day.startTmsp + Util.hourStringToSeconds(event.startHour)
				if (!event.endHour) {
					event.endTmsp = event.startTmsp
				} else {
					event.endTmsp = day.startTmsp + Util.hourStringToSeconds(event.endHour)
				}
			})
		})
	}

	/*
  * pre: requires 'schedule' with timestamaps generated
  * Generates the list for 'live' and 'fullscreen'
  */
	function generateFancySchedule () {
		var list = document.createElement('ul')

		schedule.days.forEach(function (day) {
			// Adding day title element
			list.appendChild(
				Util.inflateWith('fancyTitle', day)
			)

			var eventIndex = 0
			var nextEventTmsp = day.events[eventIndex].startTmsp
			// Adding events for that day
			for (let i = day.startTmsp; i < day.startTmsp + 24 * 60 * 60; i += CONST.SCHEDULE_STEP) {
				// Add a list element for every step
				list.appendChild(
					Util.inflateWith('fancyItem', {
						'startTmsp': i,
						'endTmsp': i + CONST.SCHEDULE_STEP - 1
					})
				)
				var liEvent = list.children[list.children.length - 1]

				// I think this loop could be a lot simpler
				// I just don't know how right now
				// Add events that fit in this step
				while (nextEventTmsp < i + CONST.SCHEDULE_STEP && eventIndex < day.events.length) {
					liEvent.appendChild(
						Util.inflateWith('fancyEvent', day.events[eventIndex])
					)

					if (isEventSubscribed(day.events[eventIndex].id)) {
						var lastEvent = liEvent.children[liEvent.children.length - 1]
						lastEvent.classList.add('subscribed')
					}
					eventIndex++
					if (eventIndex < day.events.length) {
						nextEventTmsp = day.events[eventIndex].startTmsp
					}
				}
			}
		})

		return list
	}

	/*
  * Choronological elements store start(optional)
  * and end timestamps (in seconds)
  * A chronological element can have 3 states: none, happening, happened
  * An action callback can be specified
  */
	function updateChronologicalElements () {
		var elements = document.querySelectorAll('[data-end-timestamp]')
		var now = Util.getNowSeconds()
		for (let i = 0; i < elements.length; i++) {
			if (elements[i].dataset.endTimestamp < now) {
				elements[i].classList.add(CONST.HAPPENED_CLASS)
				// If end action callback defined
				if (elements[i].dataset.endAction && actions[elements[i].dataset.endAction]) {
					actions[elements[i].dataset.endAction](elements[i])
				}
			} else if (elements[i].dataset.startTimestamp < now) {
				elements[i].classList.add(CONST.HAPPENING_CLASS)
				// If start action callback defined
				if (elements[i].dataset.startAction && actions[elements[i].dataset.startAction]) {
					actions[elements[i].dataset.startAction](elements[i])
				}
			}

			// If update action callback defined
			if (elements[i].dataset.updateAction && actions[elements[i].dataset.updateAction]) {
				actions[elements[i].dataset.updateAction](elements[i])
			}
		}
	}

	/*
  * Gets all schedule dependent elements
  * and repaints
  */
	function paintSchedule () {
		var fancyElements = document.querySelectorAll('.events-fancy')
		var scheduleElement = document.getElementById(views.schedule).getElementsByClassName('container')[0]
		try {
			var fancySchedule = generateFancySchedule()
			for (let i = 0; i < fancyElements.length; i++) {
				// fancyElements[i].innerHTML = "<div class='hide-scroll-hack'></div>"
				fancyElements[i].appendChild(
					fancySchedule.cloneNode(true)
				)
			}

			var events = document.querySelectorAll('.events-fancy .event')
			for (let i = 0; i < events.length; i++) {
				(function (element) {
					element.addEventListener('click', function () {
						if (isEventSubscribed(element.dataset.eventId)) {
							unsubscribeEvent(element.dataset.eventId)
						} else {
							subscribeEvent(element.dataset.eventId)
						}
					})
				})(events[i])
			}

			scheduleElement.innerHTML = ''
			scheduleElement.appendChild(
				(generateSchedule()).cloneNode(true)
			)
		} catch (e) {
			console.error(e)
			malformedDataError()
		}
	}

	function updateCountdown () {
		var countdownStart = Util.dateStringToSeconds(schedule.countdownStart) + parseInt(schedule.baseTimeOffset) * 60
		// var running = false
		var obj = { hours: 0, minutes: 0, seconds: 0 }
		var elapsed = Util.getNowSeconds() - countdownStart
		var current = CONST.HACKATHON_DURATION - elapsed
		if (current > 0 && current < CONST.HACKATHON_DURATION) {
			obj = Util.getHumanTime(current)
			// running = true
		} else {
			if (current > CONST.HACKATHON_DURATION) {
				obj.hours = 36
			}
		}

		let hours = Util.pad(obj.hours)
		let minutes = Util.pad(obj.minutes)
		let seconds = Util.pad(obj.seconds)

		var countdownElements = document.querySelectorAll('.countdown-time')
		for (const elem of countdownElements) {
			let hoursElem = elem.getElementsByClassName('hours')[0]
			let minutesElem = elem.getElementsByClassName('minutes')[0]
			let secondsElem = elem.getElementsByClassName('seconds')[0]
			if (hoursElem && hoursElem.textContent !== hours) hoursElem.textContent = hours
			if (minutesElem && minutesElem.textContent !== minutes) minutesElem.textContent = minutes
			if (secondsElem && secondsElem.textContent !== seconds) secondsElem.textContent = seconds
		}
	}

	function prompt (title, message, acceptMsg, acceptCb, denyMsg, denyCb) {
		var p = Util.inflateWith('promptTemplate', {
			title: title,
			message: message,
			accept: acceptMsg || 'Ok',
			cancel: denyMsg || 'Cancel'

		})
		body.appendChild(p)

		var c = document.querySelector('.prompt')
		document.getElementById('promptAccept').addEventListener('click', function () {
			if (acceptCb) acceptCb()
			Util.unveil(main)
			Util.fadeOut(c, function () {
				body.removeChild(c)
			})
		})
		document.getElementById('promptCancel').addEventListener('click', function () {
			if (denyCb) denyCb()
			Util.unveil(main)
			Util.fadeOut(c, function () {
				body.removeChild(c)
			})
		})

		Util.veil(main)
		Util.show(c)
		// Dom repaint
		setTimeout(function () {
			Util.fadeIn(c)
		}, 1)
	}

	function subscribeEvent (id) {
		initNotifications()
		var refs = Util.storageGet('eventSubscriptions')
		if (refs && refs[id]) {
			refs[id].subscribed = true
			var element = document.querySelectorAll("[data-event-id='" + id + "']")
			if (element && element.length > 0) {
				for (let i = 0; i < element.length; i++) {
					element[i].classList.add('subscribed')
				}
			}
			Util.storagePut('eventSubscriptions', refs)
		}
	}
	function unsubscribeEvent (id) {
		var refs = Util.storageGet('eventSubscriptions')
		if (refs && refs[id]) {
			refs[id].subscribed = false
			var element = document.querySelectorAll("[data-event-id='" + id + "']")
			if (element && element.length > 0) {
				for (let i = 0; i < element.length; i++) {
					element[i].classList.remove('subscribed')
				}
			}
		}

		Util.storagePut('eventSubscriptions', refs)
	}
	function isEventSubscribed (id) {
		var refs = Util.storageGet('eventSubscriptions')
		return (refs && refs[id]) ? refs[id].subscribed : false
	}
	function subscribeAllEvents () {
		var refs = Util.storageGet('eventSubscriptions')
		for (var key in refs) {
			if (refs.hasOwnProperty(key)) {
				if (Util.getNowSeconds() - refs[key].startTmsp < 0) { subscribeEvent(key) }
			}
		}
	}
	function getEvent (id) {
		var refs = Util.storageGet('eventSubscriptions')
		return (refs && refs[id]) ? refs[id] : null
	}

	/*
  * Prompts the user if they want to subscribe to all events.
  * Result is stored in localStorage
  */
	function askSubscribeAll (cb) {
		prompt('Notifications for upcoming events',
			'<p>Do you want to subscribe to all the events? </p>' +
				'<p>You will receive a notification 2 minutes before something happens. </p>' +
				'<p><b>We won\'t spam you:</b> You can always choose to subscribe or unsubscribe by clicking individually on an event.</p>',
			'All right', function () { if (cb) cb() },
			'Nope', function () { /* Do nothing */ })
		Util.storagePut('askedSubscribeAll', true)
	}

	/*
  * Check if we asked the user
  */
	function checkSubscriptionQuestion () {
		if (!Util.storageGet('askedSubscribeAll')) {
			askSubscribeAll(function () {
				subscribeAllEvents()
			})
		}
	}

	/*
  * Generates events table to keep track of subscriptions (notifications)
  */
	function generateEventReferences () {
		var localSubs = Util.storageGet('eventSubscriptions')
		var eventSubscriptions = {}
		schedule.days.forEach(function (day) {
			day.events.forEach(function (event) {
				// Init to false
				eventSubscriptions[event.id] = event
				eventSubscriptions[event.id].subscribed = false
				if (localSubs && localSubs[event.id]) { eventSubscriptions[event.id].subscribed = localSubs[event.id].subscribed }
			})
		})
		Util.storagePut('eventSubscriptions', eventSubscriptions)
	}

	/*
  * Generates events table to keep track of subscriptions (notifications)
  */
	function generateScheduleCompositedFields () {
		schedule.days.forEach(function (day) {
			day.events.forEach(function (event) {
				event.title = (event.talk ? '[Talk] ' : '') +
					(event.author ? (event.author + ': ') : '') +
					(event.title || '')
			})
		})
	}

	/*
  * Loads the schedule in the global scope
  * and checks version.
  * If version is different from local
  * executes callback
  * Added actual datetime to avoid browser cached copies of schedule
  */
	function updateSchedule (cb) {
		Util.loadFile('/data/schedule.json?date=' + Util.getNowDate().getTime(), function (data) {
			var newSchedule = JSON.parse(data)

			if (!newSchedule.version) { malformedDataError() }

			// TODO: discuss, != or <
			if (schedule.version !== newSchedule.version) {
				schedule = newSchedule
				generateTimestamps()
				generateEventReferences()
				generateScheduleCompositedFields()
				if (typeof cb === 'function') { cb() }
				console.info('Schedule updated on (' + Util.getNowDate() + '): \n' + schedule.message)
			} else {
				console.info('Schedule up to date')
			}
		}, function (data) {
			// show
			console.error('Error getting schedule: ' + data)
		})
	}

	/// /////////////////////
	// Navigation
	/// /////////////////////

	// Sets 'selected' class in binded elements
	function updateBindings (newView) {
		var elements = document.querySelectorAll('[data-bind-view]')
		for (let i = 0; i < elements.length; i++) {
			if (elements[i].dataset.bindView === newView) { elements[i].classList.add(CONST.SELECTED_CLASS) } else { elements[i].classList.remove(CONST.SELECTED_CLASS) }
		}
	}

	// Changes the hash, which triggers a route change event
	function goTo (route) {
		window.location.hash = '/' + route
	}

	function onRouteChange () {
		if (window.location.hash && window.location.hash.indexOf('/') !== -1) {
			var route = window.location.hash.slice(window.location.hash.indexOf('/') + 1)
			var routeRoot = route.substring(0, route.indexOf('/')) || route
			if (views[routeRoot]) {
				updateBindings(routeRoot)
				showView(route)
			} else {
				console.warn("View '" + route + "' doesn't exist. Showing default (' + CONST.DEFAULT_VIEW + ').")
				goTo(CONST.DEFAULT_VIEW)
			}
		} else {
			goTo(CONST.DEFAULT_VIEW)
		}

		closeAsideMenu()
	}

	function changeView (view) {
		for (let i = 0; i < viewElements.length; i++) {
			viewElements[i].classList.remove(CONST.ACTIVE_CLASS)
		}

		let viewRoot = view.substring(0, view.indexOf('/')) || view
		document.getElementById(viewRoot).classList.add(CONST.ACTIVE_CLASS)

		if (viewRoot === 'map') changeMapView(view.substring(view.indexOf('/') + 1))
	}

	function changeMapView (locationId) {
		switch (locationId) {
		case 'indoors':
			document.getElementById('map-indoors').style.display = ''
			document.getElementById('map-campus').style.display = 'none'
			document.getElementById('map-judging').style.display = 'none'

			document.getElementById('map-legend-floors').style.display = ''

			document.getElementById('map-button-indoors').classList.add('disabled')
			document.getElementById('map-button-campus').classList.remove('disabled')
			document.getElementById('map-button-judging').classList.remove('disabled')
			break
		case 'campus':
			document.getElementById('map-indoors').style.display = 'none'
			document.getElementById('map-campus').style.display = ''
			document.getElementById('map-judging').style.display = 'none'

			document.getElementById('map-legend-floors').style.display = 'none'

			document.getElementById('map-button-indoors').classList.remove('disabled')
			document.getElementById('map-button-campus').classList.add('disabled')
			document.getElementById('map-button-judging').classList.remove('disabled')

			break
		case 'judging':
			document.getElementById('map-indoors').style.display = 'none'
			document.getElementById('map-campus').style.display = 'none'
			document.getElementById('map-judging').style.display = ''

			document.getElementById('map-legend-floors').style.display = ''

			document.getElementById('map-button-indoors').classList.remove('disabled')
			document.getElementById('map-button-campus').classList.remove('disabled')
			document.getElementById('map-button-judging').classList.add('disabled')
			break
		}
	}

	function toggleFullscreen () {
		if (itsFullscreen) {
			hideFullscreen()
			itsFullscreen = false
		} else {
			showFullscreen()
			itsFullscreen = true
		}
	}

	function hideFullscreen () {
		Util.fadeOut(body, function () {
			Util.show(header)
			Util.show(smallHeader)
			changeView(
				window.location.hash.slice(window.location.hash.indexOf('/') + 1)
			)
			Util.fadeIn(body, () => { document.exitFullscreen() })
		})
	}

	function showFullscreen () {
		Util.fadeOut(body, function () {
			Util.hide(header)
			Util.hide(smallHeader)
			changeView(views.fullscreen)
			Util.fadeIn(body, () => { document.documentElement.requestFullscreen() })
		})
	}

	function showView (view) {
		Util.fadeOut(main, function () {
			changeView(view)
			Util.fadeIn(main)
		})
	}

	function notify (msg, title, icon, cb) {
		var ntitle = title || CONST.DEFAULT_NOTIFICATION_TITLE
		var notification = new Notification(ntitle, {
			body: msg,
			icon: icon || CONST.DEFAULT_NOTIFICATION_ICON
		})

		notification.onclick = function () {
			if (typeof cb === 'function') { cb() }

			notification.close()
		}

		setTimeout(function () {
			notification.close()
		}, CONST.NOTIFICATION_TIMEOUT)
	}

	function openAsideMenu () {
		// Prevent seeing under veil
		// (for some reason veil is shorter than body)
		document.body.scrollTop = 0

		Util.blockScroll(body)
		aside.classList.remove('hidden')
		// Force dom repaint
		setTimeout(function () {
			aside.classList.remove('closed')
		}, 1)
		Util.veil(body)
	}

	function closeAsideMenu () {
		Util.unveil(body)
		aside.classList.add('closed')
		setTimeout(function () {
			aside.classList.add('hidden')
			Util.releaseScroll(body)
		}, CONST.ASIDE_OPEN_ANIMATION_DURATION)
	}

	/// /////////////////////
	// MLH Hardware Lab
	/// /////////////////////

	/* function buildHardwareLab(cb) {
    Util.loadFile('https://hardware.mlh.io/events/hackupc-winter.json?date='+Util.getNowDate().getTime(), function(data) {
      var hardElems = JSON.parse(data)['data']
      var hardList = document.getElementById("hardwareList")
      hardList.innerHTML=""
      hardElems.forEach(function(hardElem) {
        hardList.appendChild(
          Util.inflateWith("hardwareElem", hardElem)
        )
      })
    })
  } */

	/// /////////////////////
	// Initialization
	/// /////////////////////
	function browserIsCompatible () {
		return 'content' in document.createElement('template')
	}

	function initNotifications () {
		if ('Notification' in window) {
			if (Notification.permission !== 'granted') {
				Notification.requestPermission(function (permission) {
					if (permission === 'granted') canNotify = true
				})
			}
		} else {
			console.warn('This browser does not support desktop notification')
		}
	}

	function init () {
		body = document.body
		main = document.getElementsByTagName('main')[0]
		header = document.getElementById('header-nav-bar')
		smallHeader = document.getElementById('header-small')
		aside = document.getElementById('aside-small-menu')
		viewElements = document.querySelectorAll('body main > article')

		window.addEventListener('hashchange', onRouteChange)
		document.addEventListener('keypress', function (ev) {
			var key = String.fromCharCode(ev.which)
			if (key === 'p' || key === 'f' || key === ' ') { toggleFullscreen() }
		})
		document.getElementById('countdown-li').addEventListener('click', function () {
			toggleFullscreen()
		})
		document.getElementById('countdown-full').addEventListener('click', function () {
			toggleFullscreen()
		})

		document.getElementById('open-aside-btn').addEventListener('click', function () {
			openAsideMenu()
		})
		document.getElementById('close-aside-btn').addEventListener('click', function () {
			closeAsideMenu()
		})
	}

	// Try to be useful for incompatible browsers too
	function compatibiliyMode () {
		updateSchedule(function () {
			var htmlString = '<article  style="color:white" class="active" id="schedule">'
			schedule.days.forEach(function (day) {
				htmlString += `<h1>${day.name || ''}</h1><table><thead style="color:black;background-color:white"><tr><th>Location</th><th>Start</th><th>End</th><th>Title</th><th>Description</th></tr></thead>`
				day.events.forEach(function (event) {
					htmlString += `<tr><td>${event.locationName || ''}</td><td>${event.startHour || ''}</td><td>${event.endHour || ''}</td><td>${event.title || ''}</td><td>${event.description || ''}</td></tr>`
				})
				htmlString += '</table>'
			})
			htmlString += '</article>'
			document.body.innerHTML = htmlString
		})
	}

	document.addEventListener('DOMContentLoaded', function (event) {
		// buildHardwareLab()
		if (!browserIsCompatible()) {
			compatibiliyMode()
			alert('Please update your browser')
			return
		}

		updateSchedule(function () {
			init()
			paintSchedule()
			updateChronologicalElements()
			updateCountdown()
			// Load current view
			onRouteChange()

			// initNotifications() // now is asked when user clicks subscribe

			setTimeout(function () {
				checkSubscriptionQuestion()
			}, 1000)

			// Keep polling the schedule
			setInterval(function () {
				updateSchedule(function () {
					notify(schedule.message, 'Schedule changed!', icons.logo, function () {
						goTo(views.schedule)
					})

					Util.fadeOut(main, function () {
						paintSchedule()
						updateChronologicalElements()
						setTimeout(function () {
							Util.fadeIn(main)
							// we want the screen to actually disappear
						}, CONST.FADE_ANIMATION_DURATION * 1.2)
					})
				})
			}, CONST.SCHEDULE_REFRESH_INTERVAL)

			setInterval(function () {
				updateCountdown()
			}, 1000)

			setInterval(function () {
				updateChronologicalElements()
			}, 60000)
			// Testing
			// }, 1000)
		})

		// setInterval(function(){
		//   buildHardwareLab()
		// }, 60000)
	})
// eslint-disable-next-line no-undef
}(CONST, Util))
