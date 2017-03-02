

var Util = (function(CONST){
	'use strict';
	if(!CONST){
		console.error("CONST module not found at this point");
		return null;
	}

	var obj = {};
	/*
	* Loads a file asynchronously
	* if succesfull calls cb(response), 
	* else calls cberr(statusText)
	*/
	obj.loadFile = function (sURL, cb, cberr) {
		var oReq = new XMLHttpRequest();
		oReq.onload = function(){
			if (this.readyState === 4) {
				if (this.status === 200) {
					if(typeof cb == "function")
						cb(this.responseText);
				} else {
					if(typeof cb == "function")
						cberr(this.statusText);
				}
			}
		};
		oReq.onerror = function(){
			if(typeof cb == "function")
				cberr(this.statusText);
		};
		oReq.open("GET", sURL, true);
		oReq.timeout = CONST.REQ_TIMEOUT;
		oReq.send(null);
	};

	/*
	* Faded elements are rendered but not visible (opacity: 0)
	*/
	obj.fadeOut = function(element, cb){
		element.classList.add(CONST.FADE_CLASS);
		setTimeout(function(){
			if(typeof cb == "function")
				cb();
		}, CONST.FADE_TIME);
	};

	obj.fadeIn = function(element, cb){
		element.classList.remove(CONST.FADE_CLASS);
		setTimeout(function(){
			if(typeof cb == "function")
				cb();
		}, CONST.FADE_TIME);
	};

	/*
	* Hidden elements are not rendered (display: none)
	*/
	obj.hide = function(element){
		element.classList.add(CONST.HIDE_CLASS);
	};

	obj.show = function(element){
		element.classList.remove(CONST.HIDE_CLASS);
	};

	/*
	* Veiled objects are covered with a semi-transparent
	* color
	*/
	obj.veil = function(element, cb){
		element.classList.add(CONST.VEIL_CLASS);

		//Force dom repaint
		setTimeout(function(){
			element.classList.add(CONST.VEILED_CLASS);
		},1);
		setTimeout(function(){
			if(typeof cb == "function")
				cb();
		}, CONST.FADE_TIME);
	};
	obj.unveil = function(element, cb){
		element.classList.remove(CONST.VEILED_CLASS);
		setTimeout(function(){
			element.classList.remove(CONST.VEIL_CLASS);
			if(typeof cb == "function")
				cb();
		}, CONST.FADE_TIME);
	};

	/*
	* Sometimes we want to prevent scroll
	* in an element
	*/

	obj.blockScroll = function(element){
		element.style.overflow = "hidden";
	};

	obj.releaseScroll = function(element){
		element.style.overflow = "auto";
	};

	/*
	* Adds an optional 0 padding upfront
	* Useful for displaying hours
	*/
	obj.pad = function(number){
		return ("0" + number).slice(-2);
	};

	/*
	* HH:MM format hour to seconds (delta)
	*/
	obj.hourToSeconds = function(hour){
		var hp = hour.split(':');
		return hp[0]*60*60+hp[1]*60;
	};

	/*
	* Seconds passed between epoch and 'date'
	*/
	obj.dateToSeconds = function(d){
		var dateHour = d.split(" ");
		var hour = [0,0];
		var date = dateHour[0].split("/") || [0,0,0];

		if(dateHour.length > 1)
			hour = dateHour[1].split(":");

		return Date.UTC(date[2], date[1]-1, 
			date[0], hour[1], hour[0])/1000;
	};

	obj.getNowSeconds = function(){
		return Date.now()/1000;
		//Testing
		//return Date.UTC(2017,2,3,23,56)/1000;
	};

	obj.getHumanTime = function(s){
		return{ 
			seconds: parseInt(s%60), 
			minutes:parseInt(s/60 % 60), 
			hours:parseInt(s/(60*60))
		};
	};

	/* 
	* Given a template id, replaces '{key}' with 'data.key'
	* and returns a clone
	*/
	obj.inflateWith = function(templateId, data){
		var element = document.getElementById(templateId);
		var clone = element.cloneNode(true);
		clone.innerHTML = clone.innerHTML.replace(/\{(.+?)\}/g, function(full, label) { 
			return data[label] ? data[label] : "";
		});

		return document.importNode(clone.content, true);
	};

	obj.storageGet = function(key){
		var storage = JSON.parse(window.localStorage["appData"] || "{}");
		return storage[key] ? storage[key] : null;
	}

	obj.storagePut = function(key, value){
		var storage = JSON.parse(window.localStorage["appData"] || "{}");
		storage[key] = value;
		window.localStorage["appData"] = JSON.stringify(storage);
	}

	return obj;
})(CONST);