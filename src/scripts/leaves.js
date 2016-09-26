/* globals Image, requestAnimationFrame */

// Leaves Script. by @casassg
// Made from http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect
// Using some inspiration from @dasilva Game of Life Script

// canvas init
var canvas = document.getElementById('lolcanvas')
var ctx = canvas.getContext('2d')
var imageSrcBase = 'assets/img/leaf'
var mp = 40 // max particles
var maxSize = 60
var minSize = 20
var particles = []
window.addEventListener('resize', resizeCanvas, false)

function resizeCanvas () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  draw()
}

function start () {
  for (var i = 0; i < mp; i++) {
    particles.push({
      x: Math.random() * canvas.width, // x-coordinate
      y: Math.random() * canvas.height, // y-coordinate
      r: minSize + Math.random() * maxSize + 1, // radius
      d: Math.random() * mp // density
    })
  }
}

var images = Array(4)
for(var i = 0; i < 4; i++) {
    var img = new Image()
    img.src = imageSrcBase + i + '.png'
    images[i] = img
}
// snowflake particles

var lastTime = new Date().getTime()

function mainLoop () {
  requestAnimationFrame(mainLoop)
  draw()
  update()
}

// Lets draw the flakes
function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (var i = 0; i < mp; i++) {
    var p = particles[i]
    if (p == null) continue
    ctx.drawImage(images[Math.round(p.r * 10) % 4], p.x, p.y, p.r, p.r)
  }
}

// Function to move the snowflakes
// angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
var angle = 0
function update () {
  var newTime = new Date().getTime()
  var dt = (newTime - lastTime) * 0.001
  lastTime = newTime

  angle += 0.6*dt
  var W = canvas.width
  var H = canvas.height
  var sinInc = Math.sin(angle) * 120 * dt

  for (var i = 0; i < mp; i++) {
    var p = particles[i]
    // Updating X and Y coordinates
    // We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
    // Every particle has its own density which can be used to make the downward movement different for each flake
    // Lets make it more random by adding in the radius
    p.y += (Math.cos(angle + p.d) + 1 + p.r / 25) * 60 * dt
    p.x += sinInc

    // Sending flakes back from the top when it exits
    // Lets make it a bit more organic and let flakes enter from the left and right also.
    if (p.x > W + maxSize * 2 || p.x < -maxSize * 2 || p.y > H) {
      if (i % 3 > 0) /* 66.67% of the flakes */ {
        particles[i] = {x: Math.random() * W, y: -maxSize * 2, r: p.r, d: p.d}
      } else {
        // If the flake is exitting from the right
        if (Math.sin(angle) > 0) {
          // Enter from the left
          particles[i] = {x: -maxSize * 2, y: Math.random() * H, r: p.r, d: p.d}
        } else {
          // Enter from the right
          particles[i] = {x: W + maxSize * 2, y: Math.random() * H, r: p.r, d: p.d}
        }
      }
    }
  }
}

resizeCanvas()
start()
mainLoop()

window.onscroll = function (e) {
  var factor = Math.max(Math.min(window.pageYOffset / 500, 1), 0)
  canvas.style.opacity = 0.1 + 0.8 * (1 - factor)
}
