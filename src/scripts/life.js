var canvas = document.getElementById('lolcanvas')
var ctx = canvas.getContext('2d')

window.addEventListener('resize', resizeCanvas, false)

function resizeCanvas () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  area = canvas.width * canvas.height
  len = parseInt(Math.sqrt(area / 8000) + 0.5)
  if (len < 6) len = 6

  start(len)
}

var bWidth, bHeight, bLen
var b, bOld
var started = false

function start (len) {
  if (!started) {
    setInterval(tick, 100)
    started = true
  }
  bWidth = parseInt(canvas.width / len + 1)
  bHeight = parseInt(canvas.height / len + 1)
  bLen = len
  b = Array(bWidth * bHeight)
  bOld = Array(bWidth * bHeight)
  var i
  for (i = 0; i < bWidth * bHeight; i++) {
    b[i] = Math.random() < 0.1
  }
  render(true)
}

function tick () {
  var tmp = b
  b = bOld
  bOld = tmp

  var l = bWidth * bHeight
  for (i = 0; i < l; i++) {
    var ct = 0
    if (bOld[(i - 1 - bWidth + l) % l]) ct++
    if (bOld[(i - 1 + l) % l]) ct++
    if (bOld[(i - bWidth + l) % l]) ct++
    if (bOld[(i + 1 - bWidth + l) % l]) ct++
    if (bOld[(i + bWidth) % l]) ct++
    if (bOld[(i + 1) % l]) ct++
    if (bOld[(i + 1 + bWidth) % l]) ct++
    if (bOld[(i - 1 + bWidth + l) % l]) ct++

    if (bOld[i])
      b[i] = ct == 2 || ct == 3
    else
            b[i] = ct == 3
  }

  render(false)
}

function render (always) {
  var x, y
  for (y = 0; y < bHeight; y++) {
    for (x = 0; x < bWidth; x++) {
      var i = x + y * bWidth
      if (!always && b[i] == bOld[i]) continue

      if (b[i])
        ctx.fillStyle = '#ddd'
      else
                ctx.fillStyle = '#fff'
      ctx.fillRect(x * bLen, y * bLen, bLen, bLen)
    }
  }
}

resizeCanvas()
