const circleElem: SVGCircleElement | null = document.querySelector('#circle')
const heroBgElem: HTMLElement | null = document.querySelector('.hero-bg')

if (circleElem && heroBgElem) {
  heroBgElem.addEventListener('mousemove', (event) => {
    const heroBgRect = heroBgElem.getBoundingClientRect()

    circleElem.style.display = 'block'
    circleElem.transform.baseVal
      .getItem(0)
      .setTranslate(
        Math.floor(event.clientX - heroBgRect.left),
        Math.floor(event.clientY - heroBgRect.top)
      )
  })

  heroBgElem.addEventListener('mouseout', () => {
    circleElem.style.display = 'none'
  })
}
