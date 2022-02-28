const heroElem = document.querySelector<HTMLDivElement>('.hero-3d-space')
let mouseX = 0.5
let mouseY = 0.5

let perspectiveX = window.innerWidth / 2
let perspectiveY = window.innerHeight * 0.125

let translateZ = false

let heroWaitingRefresh = false

window.addEventListener('scroll', updateHeroPerspective, { passive: true })
window.addEventListener('mousemove', updateHeroPerspective)
window.addEventListener('resize', updateHeroPerspective)
updateHeroPerspective()

function updateHeroPerspective(
  event?:
    | WindowEventMap['mousemove']
    | WindowEventMap['scroll']
    | WindowEventMap['resize']
): void {
  if (window.pageYOffset <= window.innerHeight && !heroWaitingRefresh) {
    if (event) {
      const newMouseX =
        'clientX' in event ? mod(event.clientX / window.innerWidth) : mouseX
      const newMouseY =
        'clientY' in event ? mod(event.clientY / window.innerHeight) : mouseY

      mouseX = smooth(newMouseX, mouseX)
      mouseY = smooth(newMouseY, mouseY)
    }

    heroWaitingRefresh = true
    window.requestAnimationFrame(() => {
      perspectiveX =
        0 +
        window.innerWidth / 2 +
        (-window.innerWidth / 40) * magnet((mouseX - 0.5) * 2)

      const height = Math.min(900, window.innerHeight)
      perspectiveY =
        0 +
        window.pageYOffset +
        height * 0.125 +
        (-height / 40) * magnet((mouseY - 0.6667) * 2)

      if (heroElem) {
        heroElem.style.perspectiveOrigin = `${perspectiveX}px ${perspectiveY}px`
        heroElem.style.transform = `translateZ(${translateZ ? 1 : 0}px)` // Fix firefox and safari
        translateZ = !translateZ
      }
      heroWaitingRefresh = false
    })
  }
}

function mod(n: number, m = 1): number {
  return ((n % m) + m) % m
}
function magnet(x = 0.5): number {
  return Math.sin((Math.PI / 2) * x)
}

function smooth(final: number, initial = 0): number {
  if (isNaN(final)) return initial

  const dif = final - initial
  const s = dif >= 0 ? +1 : -1
  return initial + s * dif ** 2
}
