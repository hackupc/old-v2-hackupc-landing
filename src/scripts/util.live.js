// eslint-disable-next-line no-unused-vars
var Util = (function (CONST) {
	'use strict'
	if (!CONST) {
		console.error('CONST module not found at this point')
		return null
	}

	var obj = {}
	/*
	* Loads a file asynchronously
	* if succesfull calls cb(response),
	* else calls cberr(statusText)
	*/
	obj.loadFile = function (sURL, cb, cberr) {
		var oReq = new XMLHttpRequest()
		oReq.onload = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
					if (typeof cb === 'function') cb(this.responseText)
				} else {
					if (typeof cberr === 'function') cberr(this.statusText)
				}
			}
		}
		oReq.onerror = function () {
			if (typeof cberr === 'function') cberr(this.statusText)
		}
		oReq.open('GET', sURL, true)
		oReq.timeout = CONST.REQ_TIMEOUT
		oReq.send(null)
	}

	/*
	* Faded elements are rendered but not visible (opacity: 0)
	*/
	obj.fadeOut = function (element, cb) {
		element.classList.add(CONST.FADE_CLASS)
		setTimeout(function () {
			if (typeof cb === 'function') cb()
		}, CONST.FADE_ANIMATION_DURATION)
	}

	obj.fadeIn = function (element, cb) {
		element.classList.remove(CONST.FADE_CLASS)
		setTimeout(function () {
			if (typeof cb === 'function') cb()
		}, CONST.FADE_ANIMATION_DURATION)
	}

	/*
	* Hidden elements are not rendered (display: none)
	*/
	obj.hide = function (element) {
		element.classList.add(CONST.HIDE_CLASS)
	}

	obj.show = function (element) {
		element.classList.remove(CONST.HIDE_CLASS)
	}

	/*
	* Veiled objects are covered with a semi-transparent
	* color
	*/
	obj.veil = function (element, cb) {
		element.classList.add(CONST.VEIL_CLASS)

		// Force dom repaint
		setTimeout(function () {
			element.classList.add(CONST.VEILED_CLASS)
		}, 1)
		setTimeout(function () {
			if (typeof cb === 'function') cb()
		}, CONST.FADE_ANIMATION_DURATION)
	}
	obj.unveil = function (element, cb) {
		element.classList.remove(CONST.VEILED_CLASS)
		setTimeout(function () {
			element.classList.remove(CONST.VEIL_CLASS)
			if (typeof cb === 'function') cb()
		}, CONST.FADE_ANIMATION_DURATION)
	}

	/*
	* Sometimes we want to prevent scroll
	* in an element
	*/

	obj.blockScroll = function (element) {
		element.style.overflow = 'hidden'
	}

	obj.releaseScroll = function (element) {
		element.style.overflow = 'auto'
	}

	/*
	* Adds an optional 0 padding upfront
	* Useful for displaying hours
	*/
	obj.pad = function (number) {
		return ('0' + number).slice(-2)
	}

	/*
	* HH:MM format hour to seconds (delta)
	*/
	obj.hourStringToSeconds = function (hour) {
		var hp = hour.split(':')
		return hp[0] * 60 * 60 + hp[1] * 60
	}

	/*
  * Seconds passed between epoch and 'date'
  */
	obj.dateStringToSeconds = function (d) {
		var dateFormat = /([0-3]?\d)\W([0-1]?\d)\W(\d{4})(\W([0-2]?\d)\W([0-5]?\d)\W?([0-5]?\d)?)?/
		var result = d.match(dateFormat)
		return Date.UTC(result[3], result[2] - 1, result[1],
			result[5] || 0, result[6] || 0, result[7] || 0) / 1000
	}

	var realStartDate = new Date()

	obj.getNowSeconds = function () {
		if (CONST.FAKE_DATE) { return (CONST.FAKE_DATE.getTime() + Date.now() - realStartDate.getTime()) / 1000 } else { return Date.now() / 1000 }
	}

	obj.getNowDate = function () {
		return new Date(obj.getNowSeconds() * 1000)
	}

	obj.getHumanTime = function (s) {
		return {
			seconds: parseInt(s % 60),
			minutes: parseInt(s / 60 % 60),
			hours: parseInt(s / (60 * 60))
		}
	}

	/*
	* Given a template id, replaces '{key}' with 'data.key'
	* and returns a clone
	*/
	obj.inflateWith = function (templateId, data) {
		var element = document.getElementById(templateId)
		var clone = element.cloneNode(true)
		clone.innerHTML = clone.innerHTML.replace(/\{(.+?)\}/g, function (full, label) {
			return data[label] === null || data[label] === undefined ? '' : data[label]
		})

		return document.importNode(clone.content, true)
	}

	obj.storageGet = function (key) {
		var storage = JSON.parse(window.localStorage['appData'] || '{}')
		return storage[key] ? storage[key] : null
	}

	obj.storagePut = function (key, value) {
		var storage = JSON.parse(window.localStorage['appData'] || '{}')
		storage[key] = value
		window.localStorage['appData'] = JSON.stringify(storage)
	}

	return obj
// eslint-disable-next-line no-undef
})(CONST)
