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
	sunPosInterp : any;
	private readonly _svgFileName : string = "assets/img/bg.svg";
	private readonly _pngFileName : string = "assets/img/bg.png";

	constructor(containerId : string, 
		sunColors : string[], sunPositions: Point[], 
		skyColors : string[]){
		let self = this;
		this.containerId = containerId;
		if(this.isBrowserSVGCapable())
		{
			this.loadSVG(function(){
				self.sunColorInterp = chroma.bezier(sunColors);
				self.skyColorInterp = chroma.bezier(skyColors);
				//yup, interpolating pos as if it were a color
				//TODO: do something better
				let c : any[] = [];
				for(let pos of sunPositions)
				{
					c.push("rgb(0,"+pos.x+", "+pos.y+")");
				}
				self.sunPosInterp = chroma.bezier(c);
				self.setListener();
			});
		}
		else
		{
			this.loadPNG();
		}
	};


	update = () => {
		//Get normalized scroll position
		let scrollTop : number = window.pageYOffset;
		let q : number = Util.mapRange(
			//From
			0, document.body.scrollHeight, 
			//To
			0, 1, 
			//Input
			scrollTop
		);
		//SVG stylesheet
		//TODO: check for compatibility and reliability
		let ss : CSSStyleSheet = <CSSStyleSheet>document.styleSheets[3];

		//Set interpolated sun color
		let sunColor : string = this.sunColorInterp(q).hex();
		(<CSSStyleRule>ss.cssRules[7]).style.fill = sunColor;

		//Set interpolated sky color
		let mainSkyColor : any = this.skyColorInterp(q);
		(<CSSStyleRule>ss.cssRules[3]).style.fill = mainSkyColor.hex();
		(<CSSStyleRule>ss.cssRules[2]).style.fill = mainSkyColor.darken(1).hex();
		(<CSSStyleRule>ss.cssRules[1]).style.fill = mainSkyColor.darken(2).hex();
		
		//Set interpolated sun position
		//TODO:do something better
		let posColor : any = this.sunPosInterp(q).rgb();
		let p : Point = new Point(0, posColor[2]);
		document.getElementById("LUNA").style.transform = "translate("+p.toPx()+")";
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
	console.log("helou");
	let b = new Barcelona(
		'background',
		['red', 'green', 'blue'],
		[
			new Point(0,0),
			new Point(0, 1000)
		],
		['blue', 'red', 'green'],
	);
});