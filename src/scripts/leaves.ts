/// <reference path="typings/pixi.js/pixi.js.d.ts"/>

class Leaves {
  constOpacity: boolean = false;

  startTime = null;
  renderer = null;
  leaves = [];
  stage = null;
  maximumLeaves = 40;
  maxSize = 60;
  minSize = 20;
  angle = 0;
  paused = false;

  constructor(public constantOpacity: boolean) {
    this.loadLeaves();
    this.renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0xfdf3e1, antialias: false});

    this.constOpacity = constantOpacity;
    if(constantOpacity) {
      this.renderer.view.style.opacity = 0.1;  
    } else {
      window.onscroll = (e) => this.onScrollChangeOpacity(e);
    }
    
    this.renderer.autoResize = true;

    this.stage = new PIXI.Container();
    document.body.insertBefore(this.renderer.view, document.body.childNodes[0]);

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas(), false)
  }

  start() {
    requestAnimationFrame((ts) => this.mainLoop(ts));
  }

  restart() {
    this.renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0xfdf3e1, antialias: false});
    if(this.constOpacity) {
      this.renderer.view.style.opacity = 0.1;  
    } else {
      window.onscroll = (e) => this.onScrollChangeOpacity(e);
    }

    document.body.insertBefore(this.renderer.view, document.body.childNodes[0]);
    this.resizeCanvas();

    this.paused = false;
  }

  stop() {
    this.renderer.destroy(true);
    this.paused = true;
  }

  private drawLeaves() {
    this.renderer.render(this.stage);
  }

  private onScrollChangeOpacity(e) {
    var factor = Math.max(Math.min(window.pageYOffset / 500, 1), 0);
    this.renderer.view.style.opacity = 0.1 + 0.8 * (1 - factor);
  }

  private update(dt) {
    this.angle += 0.6*dt;

    var W = this.renderer.view.width;
    var H = this.renderer.view.height;
    var sinInc = Math.sin(this.angle) * 120 * dt;

    for (var i = 0; i < this.maximumLeaves; i++) {
      var leave = this.leaves[i];

      if(leave != undefined) {
        leave.y += (Math.cos(this.angle + leave.weight) + 1 + leave.width / 25) * 60 * dt;
        leave.x += sinInc;

        // Sending flakes back from the top when it exits
        // Lets make it a bit more organic and let flakes enter from the left and right also.
        if (leave.x > W + this.maxSize * 2 || leave.x < -this.maxSize * 2 || leave.y > H) {
          if (i % 3 > 0) /* 66.67% of the flakes */ {
            this.leaves[i].x = Math.random() * W;
            this.leaves[i].y = -this.maxSize * 2;
          } else {
            // If the flake is exitting from the right
            if (Math.sin(this.angle) > 0) {
              this.leaves[i].x = -this.maxSize * 2;
              this.leaves[i].y = Math.random() * H;
            } else {
              this.leaves[i].x = W + this.maxSize * 2;
              this.leaves[i].y = Math.random() * H;
            }
          }
        }
      }
    }
  }

  private mainLoop(timestamp) {
    requestAnimationFrame((ts) => this.mainLoop(ts));

    if(this.startTime == null) this.startTime = timestamp;
    var dt: number = (timestamp - this.startTime)/700;
    this.startTime = timestamp;

    if(this.paused == false) {
      this.drawLeaves();
      this.update(dt);
    }
  }

  private loadLeaves() {
    PIXI.loader
      .add("leaf0", "assets/img/leaf0.png")
      .add("leaf1", "assets/img/leaf1.png")
      .add("leaf2", "assets/img/leaf2.png")
      .add("leaf3", "assets/img/leaf3.png")
      .load(() => this.createLeaves());
  }

  private createLeaves() {
    for(var i = 0; i < this.maximumLeaves; i++) {
      var leafIdx = Math.round(Math.random()*50) % 4;
      console.log(leafIdx);
      var posX = Math.random() * this.renderer.view.width;
      var posY = Math.random() * this.renderer.view.height;
      var radius = this.minSize + Math.random() * this.maxSize + 1;

      this.leaves[i] = new PIXI.Sprite(PIXI.loader.resources["leaf" + leafIdx].texture);
      this.leaves[i].position.set(posX, posY);
      this.leaves[i].width = radius;
      this.leaves[i].height = radius;
      this.leaves[i].weight = Math.random() * this.maximumLeaves;

      this.stage.addChild(this.leaves[i]);
    }
  }

  private resizeCanvas() {
    this.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
