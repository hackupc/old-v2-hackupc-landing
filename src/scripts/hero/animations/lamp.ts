const lampOnElem = document.getElementById('lamp-on')
if (lampOnElem) {
  let lampIsOn = true
  lampOnElem.addEventListener('mousedown', () => {
    lampIsOn = !lampIsOn
    lampOnElem.style.opacity = lampIsOn ? '1' : '0'
  })
}
