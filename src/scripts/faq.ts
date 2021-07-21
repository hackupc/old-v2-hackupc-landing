const faqLinkElems: NodeListOf<HTMLElement> = document.querySelectorAll(
  '.faq__answer[aria-hidden="true"] a'
)
for (const linkElem of faqLinkElems) {
  linkElem.tabIndex = -1
}

const faqQuestionTitleElems: NodeListOf<HTMLElement> =
  document.querySelectorAll('.faq__title')
for (const faqQuestionTitleElem of faqQuestionTitleElems) {
  faqQuestionTitleElem.addEventListener('click', () => {
    const faqQuestionElem = faqQuestionTitleElem.closest('.faq__question')
    const faqAnswerElem: HTMLElement | null =
      faqQuestionElem?.querySelector('.faq__answer') ?? null
    // const faqLinksElems: NodeListOf<HTMLElement> = faqQuestionElem.querySelectorAll('a');

    if (faqQuestionElem && faqAnswerElem) {
      if (faqQuestionTitleElem.getAttribute('aria-expanded') === 'true') {
        faqQuestionElem.classList.remove('faq__question--expanded')
        faqQuestionTitleElem.setAttribute('aria-expanded', 'false')
        faqAnswerElem.setAttribute('aria-hidden', 'true')
        faqAnswerElem.style.maxHeight = ''

        faqAnswerElem.querySelectorAll('a').forEach((linkElem) => {
          linkElem.tabIndex = -1
        })
      } else {
        faqQuestionElem.classList.add('faq__question--expanded')
        faqAnswerElem.setAttribute('aria-hidden', 'false')
        faqQuestionTitleElem.setAttribute('aria-expanded', 'true')
        faqAnswerElem.style.maxHeight = `${faqAnswerElem.scrollHeight}px`

        faqAnswerElem.querySelectorAll('a').forEach((linkElem) => {
          linkElem.tabIndex = 0
        })
      }
    }
  })
}
