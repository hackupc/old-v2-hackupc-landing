/*
	Creates an animated background,
	controlled by the scroll position.
	The SVG file must match the definitions.
	Fallbacks to PNG without animations
	if SVG is not supported.

	Requires
		-chroma-js: handles colors
		-svg file

	Interesting read about color gradients:
	https://www.vis4.net/blog/2013/09/mastering-multi-hued-color-scales/
*/
declare var chroma:any;

class Util{
	/*
		Maps range value q from [a1, b1] to [a2, b2]
	*/
	static mapRange(a1, b1, a2, b2, q):number{
		return (q - a1) * (b2 - a2) / (b1 - a1) + a2;
	}
}

class Point{
	x : number;
	y : number;
	constructor(x: number, y: number){
		this.x = x;
		this.y = y;
	}

	toPx():string{
		return this.x + "px, " + this.y + "px";
	}
}

class Barcelona{
	containerId : string;
	sunColorInterp : any;
	skyColorInterp : any;
	sunDistance : number;
	stylesheet : CSSStyleSheet;
	private readonly _ssTitle : string = "bg";
	private readonly _sunStyleClass : string = ".st6";
	private readonly _sky1StyleClass : string = ".st0";
	private readonly _sky2StyleClass : string = ".st1";
	private readonly _sky3StyleClass : string = ".st2";
	private readonly _sky4StyleClass : string = ".st3";
	private readonly _sunId : string = "lluna";
	private readonly _skyId : string = "cel";
	private readonly _svgFileName : string = "assets/img/bg.svg";
	private readonly _pngFileName : string = "assets/img/bg.png";

	constructor(containerId : string, 
		sunColors : string[], sunDistance: number, 
		skyColors : string[]){
		let self = this;
		this.containerId = containerId;
		if(this.isBrowserSVGCapable())
		{
			this.loadSVG(function(){
				self.sunColorInterp = chroma.bezier(sunColors);
				self.skyColorInterp = chroma.bezier(skyColors);
				self.sunDistance = sunDistance;
				self.setListener();
				self.getStyleSheet();
			});
		}
		else
		{
			this.loadPNG();
		}
	};


	update = (e) => {
		//Get normalized scroll position
		let scrollTop : number = window.pageYOffset;
		let q : number = Util.mapRange(
			//From
			//0, document.body.scrollHeight, 
			0, window.innerHeight, 
			//To
			0, 1, 
			//Input
			scrollTop
		);

		//Set interpolated sun color
		let sunColor : string = this.sunColorInterp(q).hex();
		this.setFillColor(this._sunStyleClass, sunColor);

		//Set interpolated sky color
		let mainSkyColor : any = this.skyColorInterp(q);
		this.setFillColor(this._sky1StyleClass, mainSkyColor.hex());
		this.setFillColor(this._sky2StyleClass, mainSkyColor.darken(0.1).hex());
		this.setFillColor(this._sky3StyleClass, mainSkyColor.darken(0.2).hex());
		this.setFillColor(this._sky4StyleClass, mainSkyColor.darken(0.3).hex());
		//Apply also to page background
		document.getElementById("sky-extension").style.backgroundColor = mainSkyColor.hex();
		
		//Set interpolated sun position
		let d : number = Util.mapRange(0,1, 0,this.sunDistance, q);
		let p : Point = new Point(0, d);
		document.getElementById(this._sunId).style.transform = "translate("+p.toPx()+")";
		document.getElementById(this._skyId).style.transform = "translate("+p.toPx()+")";
	}
	/*
		Get a reference to the SVG's stylesheet
	*/
	getStyleSheet() : void{
		for(let i = 0; i < document.styleSheets.length; i++)
		{
			if(document.styleSheets[i].title == this._ssTitle)
			{
				this.stylesheet = <CSSStyleSheet>document.styleSheets[i];
				return;
			}
		}
	}

	/*
	 Changes the fill style for the class cls with color clr
	*/
	setFillColor(cls:string, clr:string) : void{
		for(let i = 0; i < this.stylesheet.cssRules.length; i++)
		{
			let rule = <CSSStyleRule>this.stylesheet.cssRules[i];
			if(rule.selectorText == cls)
			{
				rule.style.fill = clr;
			}
		}
	}
	setListener() : void{
		document.addEventListener('scroll', this.update);
	}

	isBrowserSVGCapable() : boolean{
		return typeof SVGRect !== "undefined";
	}

	loadSVG(cb) : void{
		let self = this;
		let xhr = new XMLHttpRequest();
		//Async request
		xhr.open("GET", this._svgFileName, true);
		xhr.overrideMimeType("image/svg+xml");
		xhr.onload = function (e) {
			if (xhr.readyState === 4) 
			{
				if (xhr.status === 200) 
				{
					document.getElementById(self.containerId)
						.appendChild(xhr.responseXML.documentElement);
					if (cb) cb();
				} 
				else 
				{
					console.error("Barcelona (loadSVG):"+xhr.statusText);
				}
			}
		};
		xhr.onerror = function (e) {
			console.error("Barcelona (loadSVG):"+xhr.statusText);
		};
		xhr.send(null);
		
	}

	loadPNG() : void{
		let img = new Image();
		img.src = this._pngFileName;
		document.getElementById(this.containerId)
			.appendChild(img);
	}


}

document.addEventListener("DOMContentLoaded", function(){
	let b = new Barcelona(
		'background',
		['#e2c02b', '#e22b57', '#ad0909'],
		1000,
		['#0E8C99', '#ffa1dd', '#231f6e'],
	);
});