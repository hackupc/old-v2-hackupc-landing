const rocketElem = document.querySelector('.object--rocket')
if (rocketElem) {
  rocketElem.addEventListener('click', () => {
    if (rocketElem.classList.contains('stop-animation')) {
      rocketElem.classList.remove('stop-animation')
      setTimeout(() => {
        rocketElem.classList.add('stop-animation')
      }, (4 + 3 + 1 + 1) * 1000)
    }
  })
}
