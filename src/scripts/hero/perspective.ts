const heroElem = document.querySelector<HTMLDivElement>('.hero-3d-space')
const applyElem = document.querySelector<HTMLAnchorElement>('.apply-button')
let mouseX = 0.5
let mouseY = 0.5

let alpha = 0.5
let beta = 0.5
let gamma = 0.5

let alphaOrig = 0.5
let betaOrig = 0.5
let gammaOrig = 0.5

let perspectiveX = window.innerWidth / 2
let perspectiveY = window.innerHeight * 0.125

let translateZ = false

let heroWaitingRefresh = false

window.addEventListener('scroll', updateHeroPerspective, { passive: true })
window.addEventListener('mousemove', updateHeroPerspective)
window.addEventListener('resize', updateHeroPerspective)
updateHeroPerspective()

/*
// iOS 13+ device orientation requestPermission
if (
  window.DeviceOrientationEvent &&
  typeof window.DeviceOrientationEvent.requestPermission === 'function'
) {
  heroElem?.addEventListener('click', (event) => {
    if (event.currentTarget !== applyElem) {
      window.DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            window.addEventListener(
              'deviceorientation',
              updateHeroPerspective,
              false
            )
          }
        })
        .catch(console.error)
    }
  })
} else {
  window.addEventListener('deviceorientation', updateHeroPerspective, false)
}
*/

document.addEventListener('visibilitychange', () => {
  alphaOrig = 0.5
  betaOrig = 0.5
  gammaOrig = 0.5
})

function updateHeroPerspective(
  event?:
    | WindowEventMap['mousemove']
    | WindowEventMap['scroll']
    | WindowEventMap['resize']
    | WindowEventMap['deviceorientation']
) {
  if (window.pageYOffset <= window.innerHeight && !heroWaitingRefresh) {
    if (event) {
      // alpha [0,360]  -->[0,1]
      // beta  [-180,180]-->[0,1]
      // gamma [-90,90] -->[0,1]

      const newMouseX =
        'clientX' in event ? mod(event.clientX / window.innerWidth) : mouseX
      const newMouseY =
        'clientY' in event ? mod(event.clientY / window.innerHeight) : mouseY
      const newAlpha =
        'alpha' in event ? mod(event.alpha ?? 0 / 360 + 0.5) : alpha
      const newBeta =
        'beta' in event ? mod((event.beta ?? 0 + 180) / 360 - 0.125) : beta
      const newGamma =
        'gamma' in event ? mod((event.gamma ?? 0 + 90) / 180) : gamma

      mouseX = smooth(newMouseX, mouseX)
      mouseY = smooth(newMouseY, mouseY)
      alpha = smooth(newAlpha, alpha)
      beta = smooth(newBeta, beta)
      gamma = smooth(newGamma, gamma)

      if (!isNaN(newAlpha) && alphaOrig === 0.5) {
        alpha = newAlpha
        alphaOrig = newAlpha
      }
      if (!isNaN(newBeta) && betaOrig === 0.5) {
        beta = newBeta
        betaOrig = newBeta
      }
      if (!isNaN(newGamma) && gammaOrig === 0.5) {
        gamma = newGamma
        gammaOrig = newGamma
      }
    }

    heroWaitingRefresh = true
    window.requestAnimationFrame(() => {
      perspectiveX =
        0 +
        window.innerWidth / 2 +
        250 * magnet((mod(alpha - alphaOrig + 0.5) - 0.5) * 2) +
        250 * magnet((mod(gamma - gammaOrig + 0.5) - 0.5) * 2) +
        (-window.innerWidth / 40) * magnet((mouseX - 0.5) * 2)

      const height = Math.min(900, window.innerHeight)
      perspectiveY =
        0 +
        window.pageYOffset +
        height * 0.125 +
        500 * magnet((mod(beta - betaOrig + 0.5) - 0.5) * 2) +
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
// function smooth(final: number, initial = 0): number {
//   const dif = final - initial
//   if (dif < 0.01 && dif > -0.01) return initial
//   else return initial + dif
// }
// function smooth(final: number, initial = 0): number {
//   let dif = final - initial
//   dif = Math.min(dif, 0.1)
//   dif = Math.max(dif, -0.1)
//   return initial + dif
// }
// function smooth(final: number, initial = 0): number {
//   return (initial + final) / 2
// }
// function smooth(final: number, initial = 0): number {
//   return final
// }
