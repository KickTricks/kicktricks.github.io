import { ShowWidgets } from './showWidgets.js'
import { ShowWidget } from './showWidget.js'
import { ShowFrontPage } from './showFrontPage.js'
export const Router = (path) => {
  document.querySelector('.container').innerHTML = ''

  const [page, pageName] = path.split(':')
  switch(page) {
  case 'category':
    ShowWidgets(pageName)
    break
  case 'widget':
    ShowWidget(pageName)
    break
  default:
    ShowFrontPage()
    break
  }
}