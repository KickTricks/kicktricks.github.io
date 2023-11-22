import { Widgets } from './widgets.js'
export const ShowWidgets = (selectedCategory) => {
  const container = document.querySelector('.container')
  const row = document.querySelector('.row')
  const cardCol = document.querySelector('.card-col')
  const newRow = row.cloneNode()
  Object.keys(Widgets).filter(x => Widgets[x].category.type === selectedCategory).forEach((key) => {
    const newCard = cardCol.cloneNode(true)
    newCard.querySelector(
      '.card-image img'
    ).src = `./images/${Widgets[key].image}`
    newCard.querySelector('.card-title').innerHTML = `${Widgets[key].name}`
    newCard.querySelector(
      '.card-content'
    ).innerHTML = `${Widgets[key].shortDescription}`
    newCard.querySelector(
      '.card-action a'
    ).href = `#widget:${Widgets[key].type}`
    newRow.appendChild(newCard)
  })
  container.appendChild(newRow)
}