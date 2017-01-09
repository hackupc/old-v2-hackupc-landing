/// <reference path="typings/pixi.js/pixi.js.d.ts"/>
var MAX_OPACITY = .9;
var MIN_OPACITY = .03;
var Leaves = (function () {
    function Leaves(constantOpacity) {
        var _this = this;
        this.constantOpacity = constantOpacity;
        this.constOpacity = false;
        this.startTime = null;
        this.renderer = null;
        this.leaves = [];
        this.stage = null;
        this.maximumLeaves = 40;
        this.maxSize = 40;
        this.minSize = 20;
        this.angle = 0;
        this.paused = false;
        //Nearest interpolation when scaling (for all sprites)
        PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
        this.loadLeaves();
        this.renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x03a9b5, antialias: false });
        this.constOpacity = constantOpacity;
        this.renderer.view.style.opacity = MAX_OPACITY;
        if (!constantOpacity) {
            window.onscroll = function (e) { return _this.onScrollChangeOpacity(e); };
        }
        this.renderer.autoResize = true;
        this.stage = new PIXI.Container();
        document.body.insertBefore(this.renderer.view, document.body.childNodes[0]);
        this.resizeCanvas();
        window.addEventListener('resize', function () { return _this.resizeCanvas(); }, false);
    }
    Leaves.prototype.start = function () {
        var _this = this;
        requestAnimationFrame(function (ts) { return _this.mainLoop(ts); });
    };
    Leaves.prototype.stop = function () {
        this.renderer.destroy(true);
        this.paused = true;
    };
    Leaves.prototype.drawLeaves = function () {
        this.renderer.render(this.stage);
    };
    Leaves.prototype.onScrollChangeOpacity = function (e) {
        var factor = Math.max(Math.min(window.pageYOffset / 500, 1), 0);
        this.renderer.view.style.opacity = MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * (1 - factor);
    };
    Leaves.prototype.update = function (dt) {
        this.angle += 0.6 * dt;
        var W = this.renderer.view.width;
        var H = this.renderer.view.height;
        var sinInc = Math.sin(this.angle) * 120 * dt;
        for (var i = 0; i < this.maximumLeaves; i++) {
            var leave = this.leaves[i];
            if (leave != undefined) {
                leave.y += (Math.cos(this.angle + leave.weight) + 1 + leave.width / 25) * 60 * dt;
                leave.x += sinInc;
                // Sending flakes back from the top when it exits
                // Lets make it a bit more organic and let flakes enter from the left and right also.
                if (leave.x > W + this.maxSize * 2 || leave.x < -this.maxSize * 2 || leave.y > H) {
                    if (i % 3 > 0) {
                        this.leaves[i].x = Math.random() * W;
                        this.leaves[i].y = -this.maxSize * 2;
                    }
                    else {
                        // If the flake is exitting from the right
                        if (Math.sin(this.angle) > 0) {
                            this.leaves[i].x = -this.maxSize * 2;
                            this.leaves[i].y = Math.random() * H;
                        }
                        else {
                            this.leaves[i].x = W + this.maxSize * 2;
                            this.leaves[i].y = Math.random() * H;
                        }
                    }
                }
            }
        }
    };
    Leaves.prototype.mainLoop = function (timestamp) {
        var _this = this;
        requestAnimationFrame(function (ts) { return _this.mainLoop(ts); });
        if (this.startTime == null)
            this.startTime = timestamp;
        var dt = (timestamp - this.startTime) / 700;
        this.startTime = timestamp;
        if (this.paused == false) {
            this.drawLeaves();
            this.update(dt);
        }
    };
    Leaves.prototype.loadLeaves = function () {
        var _this = this;
        for (var i = 0; i < 13; ++i) {
            PIXI.loader.add("flake" + i, "assets/img/flake" + i + ".png");
        }
        PIXI.loader.load(function () { return _this.createLeaves(); });
    };
    Leaves.prototype.createLeaves = function () {
        for (var i = 0; i < this.maximumLeaves; i++) {
            var flakeId = Math.floor(Math.random() * 13);
            var posX = Math.random() * this.renderer.view.width;
            var posY = Math.random() * this.renderer.view.height;
            var radius = this.minSize + Math.random() * this.maxSize + 1;
            this.leaves[i] = new PIXI.Sprite(PIXI.loader.resources[("flake" + flakeId)].texture);
            this.leaves[i].position.set(posX, posY);
            this.leaves[i].width = radius;
            this.leaves[i].height = radius;
            this.leaves[i].weight = Math.random() * this.maximumLeaves;
            this.stage.addChild(this.leaves[i]);
        }
    };
    Leaves.prototype.resizeCanvas = function () {
        this.renderer.resize(window.innerWidth, window.innerHeight);
    };
    return Leaves;
}());
