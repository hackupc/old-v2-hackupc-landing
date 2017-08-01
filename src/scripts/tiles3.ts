let state: number = 1;
let lastState: number = 0;
let TILE_WIDTH: number = 100;
let matrix: Array<Array<any>> = [];

function clear () {
	for (let row of matrix) {
		for (let tile of row) {
            tile.classList.remove ("red");
            tile.classList.remove ("yellow");
		}
	}
}

document.addEventListener ("DOMContentLoaded", function () {
    document.body.addEventListener ("click", function () {
        state = (state + 1) % 2;
    });

    let container = document.getElementById ("background");
    let n = window.innerHeight / TILE_WIDTH * 2 + 1;
    let m = window.innerWidth / TILE_WIDTH;
    for (let i = 0; i < n; i++) {
        let row = document.createElement ("div");
        row.classList.add ("tiles-row");
        matrix[i] = [];

        for (let j = 0; j < m; j++) {
            let tile = document.createElement ("div");
            tile.classList.add ("tile");
            let img = document.createElement ("img");
            img.src = "assets/img/mask.png";
            tile.appendChild (img);
            row.appendChild (tile);
            matrix[i][j] = tile;
        }

        container.appendChild (row);
    }

    setInterval (() => {
        if (lastState != state) {
            clear();
        }

        if (state === 0) {
            lastState = 0;
            let i = Math.floor (Math.random() * n);
            let j = Math.floor (Math.random() * m);

            if (Math.random() < 0.5) {
                matrix[i][j].classList.add ("yellow");

                setTimeout (() => {
                    matrix[i][j].classList.remove ("yellow");
                }, 2500);
            }
            else {
                matrix[i][j].classList.add ("red");
                setTimeout (() => {
                    matrix[i][j].classList.remove ("red");
                }, 2500);
            }
        }
        else if (state === 1) {
            lastState = 1;

            for (let i in matrix) {
                for (let tile of matrix[i]) {
					if (Number(i) < 4)
						tile.classList.add ("red");
					else if (Number(i) > 17)
						tile.classList.add ("yellow");
                }
            }
        }
    }, 200);
});