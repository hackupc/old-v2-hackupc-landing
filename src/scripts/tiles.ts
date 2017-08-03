class Tile{
	container: Element;
	constructor(){
		this.container = document.createElement("div");
		this.container.classList.add("tile");
	}

	paint(c: TileColors, timeout: number = 2500){
		let cssClass: string = "";
		
		switch(c) {
			case TileColors.Red:
				cssClass = "red";
				break;
			case TileColors.Yellow:
				cssClass = "yellow";
				break;
			case TileColors.Green:
				cssClass = "green";
				break;
			case TileColors.Orange:
				cssClass = "orange";
				break;
		}
		this.container.classList.add(cssClass);
		setTimeout(() => {

			this.container.classList.remove(cssClass);
		}, timeout);
	}

	clear(){
		this.container.classList.remove ("red");
		this.container.classList.remove ("yellow");
		this.container.classList.remove ("green");
		this.container.classList.remove ("orange");
	}

	remove(){
		this.container.parentElement.removeChild(this.container);
	}


}

class TileRow{
	container: Element;
	private _tiles: Array<Tile>;

	constructor(){
		this._tiles = new Array();
		this.container = document.createElement("div");
		this.container.classList.add("tiles-row");
	}

	add(t: Tile){
		this.container.appendChild(t.container);
		this._tiles.push(t);
	}

	paint(c: TileColors, timeout: number = 2500){
		for(let tile of this._tiles) {
			tile.paint(c, timeout);
		}
	}

	clear(){
		for(let tile of this._tiles) {
			tile.clear();
		}
	}
	getTile(i: number){
		return this._tiles[i];
	}
	remove(){
		this.container.parentNode.removeChild(this.container);
	}
	removeLastTile(){
		let tile = this._tiles.pop();
		tile.remove();
	}
}

enum TileGridState{
	Static,
	Random
};

enum TileColors{
	Yellow,
	Red,
	Green,
	Orange
};

class TileGrid {
	container: Element;
	readonly tickDelay: number = 200;
	private _rows: Array<TileRow>;
	private _currentState: TileGridState;
	private _lastState: TileGridState;

	//Number of horizontal rows
	private _n: number;
	//Tiles per row
	private _m: number;
	private _tileWidth: number;

	//Tiles are squares, so we only need the width
	constructor(windowWidth: number, windowHeight: number, 
				tileWidth: number = 120, 
				containerSelector: string = "#background")	{
		
		this._rows = new Array();
		this._currentState = TileGridState.Random;
		
		this._tileWidth = tileWidth;
		this._n = Math.ceil(window.innerHeight / tileWidth * 2) + 1;
		this._m = Math.ceil(window.innerWidth / tileWidth) + 1;
		this.container = document.querySelector(containerSelector);

		for (let i = 0; i < this._n; i++) {
			let row = new TileRow();
			
			for (let j = 0; j < this._m; j++) {
				let tile = new Tile();
				row.add(tile);
			}

			this.container.appendChild (row.container);
			this._rows.push(row);
		}
		var that = this;
		setInterval(() => this.tick(), this.tickDelay);
	}

	resize(windowWidth: number, windowHeight: number){
		let new_n = Math.ceil(window.innerHeight / this._tileWidth * 2) + 1;
		let new_m = Math.ceil(window.innerWidth / this._tileWidth) + 1;
		//Bigger width, add cols
		if(new_m > this._m)
		{
			let difference = new_m - this._m;
			for (let i = 0; i < this._n; i++) {
				let row = this._rows[i];
				
				for (let j = 0; j < difference; j++) {
					let tile = new Tile();
					row.add(tile);
				}
			}
		}
		//Smaller width, remove cols from the end
		else if(new_m < this._m)
		{
			let difference =  this._m - new_m;
			for (let i = 0; i < this._n; i++) {
				let row = this._rows[i];
				
				for (let j = 1; j <= difference; j++) {
					row.removeLastTile();
				}
			}
		}

		this._m = new_m;

		//Bigger height, add rows
		if(new_n > this._n)
		{
			let difference = new_n - this._n;
			for (let i = 0; i < difference; i++) {
				let row = new TileRow();
				
				for (let j = 0; j < this._m; j++) {
					let tile = new Tile();
					row.add(tile);
				}

				this.container.appendChild (row.container);
				this._rows.push(row);
			}	
		}
		//Smaller height, remove rows from the end
		else if(new_n < this._n)
		{
			let difference = this._n - new_n;
			for (let i = 0; i < difference; i++) {
				let row = this._rows.pop();
				row.remove();
			}	
		}
		
		this._n = new_n;
	}

	tick(){

        if (this._lastState != this._currentState) {
            this.clear();
        }
        if (this._currentState == TileGridState.Random) {
            this._lastState = TileGridState.Random;
            
            let i = Math.floor (Math.random() * this._n);
            let j = Math.floor (Math.random() * this._m);

            let randNum = Math.random();

            if (randNum < 0.25) {
                this._rows[i].getTile(j).paint(TileColors.Yellow);
            }
            else if (randNum < 0.5) {
				this._rows[i].getTile(j).paint(TileColors.Red);
			}
			else if (randNum < 0.75) {
				this._rows[i].getTile(j).paint(TileColors.Green);
			}
			else
			{
				this._rows[i].getTile(j).paint(TileColors.Orange);	
			}
        }
        else if (this._currentState == TileGridState.Static) {
            this._lastState = TileGridState.Static;

            for (let row in this._rows) {
            	let i = Number(row);
                if(i < this._n * 0.25)
					this._rows[i].paint(TileColors.Yellow);
                else if(i > this._n * 0.75)
					this._rows[i].paint(TileColors.Red);
                
            }
        }
	}

	changeState(){
		this._currentState = (this._currentState + 1) % 2;
	}

	clear(){
		for(let row of this._rows) {
			row.clear();
		}
	}
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// source: https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate?) {

	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

document.addEventListener ("DOMContentLoaded", function () {
    let tg = new TileGrid(window.innerWidth, window.innerHeight);
    
    document.body.addEventListener ("click", function () {
         tg.changeState();
    });


    window.addEventListener('resize',
    	debounce(function(){
    		tg.resize(window.innerWidth, window.innerHeight);
    	}, 300)
    );

});