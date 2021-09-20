const countdownNumElem = {
  day: document.querySelector<HTMLSpanElement>(
    '.countdown__cell[data-unit="day"] .countdown__number'
  ),
  hour: document.querySelector<HTMLSpanElement>(
    '.countdown__cell[data-unit="hour"] .countdown__number'
  ),
  minute: document.querySelector<HTMLSpanElement>(
    '.countdown__cell[data-unit="minute"] .countdown__number'
  ),
  second: document.querySelector<HTMLSpanElement>(
    '.countdown__cell[data-unit="second"] .countdown__number'
  ),
}
const countdownPluralElem = {
  day: document.querySelector<HTMLSpanElement>(
    '.countdown__cell[data-unit="day"] .countdown__label-plural'
  ),
  hour: document.querySelector<HTMLSpanElement>(
    '.countdown__cell[data-unit="hour"] .countdown__label-plural'
  ),
  minute: document.querySelector<HTMLSpanElement>(
    '.countdown__cell[data-unit="minute"] .countdown__label-plural'
  ),
  second: document.querySelector<HTMLSpanElement>(
    '.countdown__cell[data-unit="second"] .countdown__label-plural'
  ),
}

const countdownDate = new Date(2020, 9, 11, 19, 0, 0) // Notice: January is 0 and December 11
let secondsLeft = Math.floor(
  (countdownDate.getTime() - new Date().getTime()) / 1000
)

const countdownInterval = setInterval(updateCountdown, 1000)
updateCountdown()

function updateCountdown() {
  if (
    countdownNumElem.day &&
    countdownNumElem.hour &&
    countdownNumElem.minute &&
    countdownNumElem.second &&
    countdownPluralElem.day &&
    countdownPluralElem.hour &&
    countdownPluralElem.minute &&
    countdownPluralElem.second
  ) {
    if (secondsLeft > 0) {
      secondsLeft -= 1

      countdownNumElem.day.textContent = Math.floor(
        secondsLeft / 60 / 60 / 24
      ).toFixed()
      countdownNumElem.hour.textContent = (
        Math.floor(secondsLeft / 60 / 60) % 24
      ).toFixed()
      countdownNumElem.minute.textContent = (
        Math.floor(secondsLeft / 60) % 60
      ).toFixed()
      countdownNumElem.second.textContent = (
        Math.floor(secondsLeft) % 60
      ).toFixed()

      countdownPluralElem.day.style.display =
        countdownNumElem.day.textContent === '1' ? 'none' : 'inline-block'
      countdownPluralElem.hour.style.display =
        countdownNumElem.hour.textContent === '1' ? 'none' : 'inline-block'
      countdownPluralElem.minute.style.display =
        countdownNumElem.minute.textContent === '1' ? 'none' : 'inline-block'
      countdownPluralElem.second.style.display =
        countdownNumElem.second.textContent === '1' ? 'none' : 'inline-block'
    } else {
      clearInterval(countdownInterval)
    }
  }
}
