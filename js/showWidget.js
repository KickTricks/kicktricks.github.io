import { Availabilities } from './availabilities.js'
import { Widgets } from './widgets.js'
export const ShowWidget = (selectedWidget) => {

  const SelectedWidget = Widgets[Object.keys(Widgets).find(x => Widgets[x].type === selectedWidget)]

  const container = document.querySelector('.container')
  const row = document.querySelector('.row.main-info')
  const cardWidget = document.querySelector('.card-widget')
  const newRow = row.cloneNode()
  const newCard = cardWidget.cloneNode(true)


  const generateFileField = (parameter) => {
    const parentDiv = document.createElement('div')
    const buttonDiv = document.createElement('div')
    const fileWrapperDiv = document.createElement('div')
    const span = document.createElement('span')
    const fileInput = document.createElement('input')
    const filePathInput = document.createElement('input')
    parentDiv.classList.add('file-field')
    buttonDiv.classList.add('btn')
    span.innerHTML = parameter.description
    fileInput.setAttribute('type', 'color')
    fileInput.setAttribute('value', parameter.default)
    fileInput.addEventListener('input', (evt) => {
      filePathInput.setAttribute('value', evt.target.value)
      buttonDiv.style.backgroundColor = evt.target.value
    })
    fileWrapperDiv.classList.add('file-path-wrapper')
    filePathInput.classList.add('file-path', 'validate')
    filePathInput.setAttribute('id', parameter.name)
    filePathInput.setAttribute('type', 'text')
    filePathInput.setAttribute('value', parameter.default)
    buttonDiv.addEventListener('click', () => {
      buttonDiv.querySelector('input').click()
    })
    buttonDiv.appendChild(span)
    buttonDiv.appendChild(fileInput)
    fileWrapperDiv.appendChild(filePathInput)
    parentDiv.appendChild(buttonDiv)
    parentDiv.appendChild(fileWrapperDiv)
    return parentDiv
  }
  const generateToggleField = (parameter) => {
    const switchContainer = document.createElement('div')
    const switchLabel = document.createElement('label')
    const offText = document.createTextNode('Off')
    const onText = document.createTextNode('On')
    const switchCheckbox = document.createElement('input')
    const lever = document.createElement('span')
    switchContainer.classList.add('switch')
    switchCheckbox.setAttribute('type', 'checkbox')
    switchCheckbox.setAttribute('id', parameter.name)
    lever.classList.add('lever')
    switchLabel.appendChild(offText)
    switchLabel.appendChild(switchCheckbox)
    switchLabel.appendChild(lever)
    switchLabel.appendChild(onText)
    switchContainer.appendChild(switchLabel)
    return switchContainer
  }
  const generateRangeField = (parameter) => {
    const rangeContainer = document.createElement('p')
    const rangeLabel = document.createElement('label')
    const rangeInput = document.createElement('input')
    const rangeValue = document.createElement('input')
    rangeContainer.classList.add('range-field')
    rangeInput.setAttribute('type', 'range')
    rangeInput.setAttribute('min', 0)
    rangeInput.setAttribute('max', 255)
    rangeInput.setAttribute('value', parameter.default.toString(16))
    rangeValue.setAttribute('type', 'hidden')
    rangeValue.setAttribute('id', parameter.name)
    rangeValue.setAttribute('value', parameter.default.toString(16))
    rangeInput.addEventListener('input', (e) => { rangeValue.value = (e.target.value * 1).toString(16).length > 1 ? (e.target.value * 1).toString(16) : '0' + (e.target.value * 1).toString(16)})
    rangeLabel.appendChild(rangeInput)
    rangeLabel.appendChild(rangeValue)
    rangeContainer.appendChild(rangeLabel)
    return rangeContainer
  }
  const generateLinkListener = (evt) => {
    evt.preventDefault()
    const modal = document.querySelector('#set-up-widget-modal')
    const parameters = new URLSearchParams()
    modal.querySelectorAll('input').forEach(input => {
      if(input.getAttribute('id')) {
        if(input.type === 'checkbox') {
          parameters.append(input.getAttribute('id'), input.checked)
        } else if(input.value) {
          parameters.append(input.getAttribute('id'), input.value.trim())
        }
      }
    })
    navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/widgets/${SelectedWidget.url}?${parameters.toString()}`).then(() => {
      // eslint-disable-next-line no-undef
      M.toast({html: 'Link copied to clipboard', classes: 'center'})
    },() => {
      // eslint-disable-next-line no-undef
      M.toast({html: 'Failed copying link to clipboard', classes: 'center'})
    })
  }
  const chatCommandsContainer = newCard.querySelector('.chat-commands')
  if (SelectedWidget.chatCommands.length === 0) {
    chatCommandsContainer.parentNode.removeChild(chatCommandsContainer)
  } else {
    const tableBody = chatCommandsContainer.querySelector('table tbody')
    const tableRow = tableBody.querySelector('tr')
    const newTableRow = tableRow.cloneNode(true)
    tableBody.removeChild(tableRow)
    SelectedWidget.chatCommands.forEach(chatCommand => {
      const newTr = newTableRow.cloneNode(true)
      newTr.querySelector('td:nth-child(1)').innerHTML = chatCommand.command
      newTr.querySelector('td:nth-child(2)').innerHTML = chatCommand.example
      newTr.querySelector('td:nth-child(3)').innerHTML = chatCommand.description
      newTr.querySelector('td:nth-child(4)').innerHTML = `${chatCommand.availability.filter(x => x.availability !== Availabilities.unavailable).map(availability => `<abbr title="${availability.role.name} (${availability.availability})"><span class="material-icons">${availability.role.icon}</span></abbr>`).join('')}</ul>`
      tableBody.appendChild(newTr)
    })
  }
  newCard.querySelector('.card-title').innerHTML = `${SelectedWidget.name}`
  newCard.querySelector(
    '.card-content p'
  ).innerHTML = `${SelectedWidget.description}`
  newCard.querySelector('.card-content img').setAttribute('src', `/images/${SelectedWidget.image}`)
  newCard.querySelector('.version-number').innerHTML = SelectedWidget.version
  newCard.querySelector('.supported-platforms').innerHTML = SelectedWidget.supports.map(support => support.name)
  newCard.querySelectorAll('.modal-trigger').forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-target')
      const modal = document.querySelector(`#${modalId}`).cloneNode(true)
      modal.querySelector('form').removeEventListener('submit', generateLinkListener)
      modal.querySelector('form').addEventListener('submit', generateLinkListener)
      const modalRow = modal.querySelector('.row').cloneNode()
      modalRow.innerHTML = ''
      const inputField = modal.querySelector('.input-field').cloneNode(true)
      const modalContainer = modal.querySelector('.set-up-widget-modal-container')
      modalContainer.innerHTML = ''
      SelectedWidget.parameters.forEach(parameter => {
        const newInputField = inputField.cloneNode(true)
        if(parameter.type === 'color') {
          newInputField.innerHTML = ''
          newInputField.appendChild(generateFileField(parameter))
          modalRow.appendChild(newInputField)
          modalContainer.appendChild(modalRow)
        } else if (parameter.type === 'toggle') {
          const labelField = newInputField.querySelector('label').cloneNode(true)
          labelField.setAttribute('for', parameter.name)
          labelField.innerHTML = parameter.description
          newInputField.innerHTML = ''
          newInputField.appendChild(labelField)
          newInputField.classList.remove('input-field')
          newInputField.appendChild(generateToggleField(parameter))
          modalRow.appendChild(newInputField)
          modalContainer.appendChild(modalRow)
        } else if (parameter.type === 'range') {
          const labelField = newInputField.querySelector('label').cloneNode(true)
          labelField.setAttribute('for', parameter.name)
          labelField.innerHTML = parameter.description
          newInputField.innerHTML = ''
          newInputField.appendChild(labelField)
          newInputField.classList.remove('input-field')
          newInputField.appendChild(generateRangeField(parameter))
          modalRow.appendChild(newInputField)
          modalContainer.appendChild(modalRow)
        } else {
          newInputField.querySelector('input').setAttribute('id', parameter.name)
          if(parameter.required) {
            newInputField.querySelector('input').setAttribute('required', parameter.required)
          }
          newInputField.querySelector('input').setAttribute('placeholder', parameter.default)
          newInputField.querySelector('input').setAttribute('type', parameter.type)
          newInputField.querySelector('input').value = parameter.default
          if(parameter.group) {
            newInputField.querySelector('input').classList.add(parameter.group)
            newInputField.querySelector('input').addEventListener('input', (evt) => {
              if(evt.target.value && evt.target.value.trim() !== '') {
                document.querySelectorAll(`.${parameter.group}`).forEach(input => {
                  input.removeAttribute('required')
                })
              } else {
                let hasInputValue = false
                document.querySelectorAll(`.${parameter.group}`).forEach(input => {
                  if(input.value && input.value.trim() !== '') {
                    hasInputValue = true
                  }
                })
                if(!hasInputValue) {
                  document.querySelectorAll(`.${parameter.group}`).forEach(input => {
                    input.setAttribute('required', 'required')
                  })
                }
              }
            })
          }
          newInputField.querySelector('label').setAttribute('for', parameter.name)
          if(parameter.required) {
            newInputField.querySelector('label').innerHTML = `${parameter.description}*`
          } else {
            newInputField.querySelector('label').innerHTML = parameter.description
          }
          modalRow.appendChild(newInputField)
          modalContainer.appendChild(modalRow)
        }
      })
      modal.querySelectorAll('.modal-trigger-close').forEach(button => {
        button.addEventListener('click', () => {
          document.querySelector(`#${button.getAttribute('data-target')}`).classList.add('hidden')
        })
      })
      document.body.style.overflow = 'hidden'
      modal.classList.remove('hidden')
      const modalOriginal = document.querySelector(`#${modalId}`)
      modalOriginal.parentNode.replaceChild(modal, modalOriginal)
      // eslint-disable-next-line no-undef
      M.updateTextFields()
    })
  })
  newRow.appendChild(newCard)
  container.appendChild(newRow)
}
