import { Router } from './js/router.js'
document.addEventListener('DOMContentLoaded', () => {
  Router(window.location.hash.slice(1))
  document.querySelectorAll('.modal-trigger-close').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        document.body.style.overflow = 'auto'
        modal.classList.add('hidden')
      })
    })
  })
  document.querySelectorAll('footer a').forEach(link => {
    link.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      window.open(evt.target.href)
    })
  })
})
window.addEventListener('hashchange', () => {
  Router(window.location.hash.slice(1))
})
