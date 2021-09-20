const duckElem = document.querySelector<HTMLDivElement>('.object--rubber-duck')
const duckSilhouetteElem = document.querySelector<HTMLImageElement>(
  '.wanted__duck-silhouette--missing'
)
const duckSignElem = document.querySelector<HTMLSpanElement>('.wanted__sign')
const duckListElem = document.querySelector<HTMLDivElement>('.wanted__list')
const duckImageElem =
  document.querySelector<HTMLImageElement>('.rubber-duck-img')
const cowsayImageElem =
  document.querySelector<HTMLImageElement>('.cowsay__image')

if (
  duckElem &&
  duckSilhouetteElem &&
  duckSignElem &&
  duckListElem &&
  duckImageElem &&
  cowsayImageElem
) {
  if (cowsayImageElem.complete) {
    // Only display duck if the screen infront is visible
    duckImageElem.style.display = 'block'
  } else {
    cowsayImageElem.addEventListener('load', () => {
      duckImageElem.style.display = 'block'
    })
  }

  duckElem.addEventListener('click', () => {
    duckElem.classList.add('duck-cliked')
    duckElem.style.pointerEvents = 'none'
    setTimeout(() => {
      duckSilhouetteElem.classList.remove('wanted__duck-silhouette--missing')
      duckSilhouetteElem.classList.add('wanted__duck-silhouette--found')
      duckListElem.style.pointerEvents = 'none'
      setTimeout(() => {
        duckSignElem.textContent = 'FOUND'
      }, 200)
    }, 1000)
  })
}
