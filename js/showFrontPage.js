import { Categories } from './categories.js'
export const ShowFrontPage = () => {
  const container = document.querySelector('.container')
  const row = document.querySelector('.row')
  const cardCol = document.querySelector('.card-col')
  const newRow = row.cloneNode()
  Object.keys(Categories).forEach((key) => {
    const newCard = cardCol.cloneNode(true)
    newCard.querySelector(
      '.card-image img'
    ).src = `./images/${Categories[key].image}`
    newCard.querySelector('.card-title').innerHTML = `${Categories[key].name}`
    newCard.querySelector(
      '.card-content'
    ).innerHTML = `${Categories[key].description}`
    newCard.querySelector(
      '.card-action a'
    ).href = `#category:${Categories[key].type}`
    newRow.appendChild(newCard)
  })
  container.appendChild(newRow)
}