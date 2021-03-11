const circleElem: HTMLElement | null = document.querySelector('#circle')
const heroBgElem: HTMLElement | null = document.querySelector('.hero-bg')

if (circleElem && heroBgElem) {
  const circleRadius = {
    x: circleElem.offsetWidth / 2,
    y: circleElem.offsetHeight / 2,
  }

  heroBgElem.addEventListener('mousemove', function (event) {
    const heroBgRect = heroBgElem.getBoundingClientRect()
    circleElem.style.display = 'block'
    circleElem.style.transform = `translate(${Math.floor(
      event.clientX - heroBgRect.left - circleRadius.x
    )}px, ${Math.floor(event.clientY - heroBgRect.top - circleRadius.y)}px)`
  })

  heroBgElem.addEventListener('mouseout', function () {
    circleElem.style.display = 'none'
  })
}
