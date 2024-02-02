import { url } from '../../helpers/url.js'
import SubathonTimerViewModel from './subathon-timer.viewmodel.js'

/** Params */
const [text, textColor, textOutlineColor, font] = url.getParams(['text', 'textcolor', 'textoutlinecolor', 'font'])
const [scale, secondsAddedPerSub, maxTime] = url.getFloatParams(['scale', 'secondsaddedpersub', 'maxtime'])
const [startHour, startMinute] = url.getIntParams(['starthour', 'startminute'])
const [textThickness] = url.getIntParams(['textthickness'])
const [modComs] = url.getBoolParams(['modcoms'])

SubathonTimerViewModel.initialize(secondsAddedPerSub, maxTime, startHour, startMinute, modComs)

/** HTML DOM */
const subathonContainer = document.querySelector('.subathon p.timer')
const subathonMessageContainer = document.querySelector('.subathon p.message')
const hourSpan = subathonContainer.querySelector('.hour')
const minuteSpan = subathonContainer.querySelector('.minute')
const secondSpan = subathonContainer.querySelector('.second')


/** Methods */

const updateClock = () => {
  const currentTime = SubathonTimerViewModel.getTime()
  if(currentTime < 0) {
    subathonMessageContainer.textContent = text
    subathonContainer.classList.add('hide')
    subathonMessageContainer.classList.remove('hide')
    return
  }
  let timeLeft = currentTime
  const hours = Math.floor(timeLeft / 60 / 60)
  timeLeft -= (hours * 60 * 60)
  const minutes = Math.floor(timeLeft / 60)
  timeLeft -= (minutes * 60)
  const seconds = Math.floor(timeLeft)
  hourSpan.textContent = SubathonTimerViewModel.zeroFill(hours)
  minuteSpan.textContent = SubathonTimerViewModel.zeroFill(minutes)
  secondSpan.textContent = SubathonTimerViewModel.zeroFill(seconds)
  subathonMessageContainer.classList.add('hide')
  subathonContainer.classList.remove('hide')
}

setInterval(updateClock, 1000)
updateClock()

/** Initialize */
if (scale > 0) {
  document.querySelector('html').style.fontSize = `${14 * scale}px`
}
subathonContainer.style.fontFamily = font
subathonContainer.style.color = textColor
subathonContainer.style.fontWeight = (textThickness * 100)
subathonContainer.style.textShadow = `1px 2px 4px ${textOutlineColor}`
subathonMessageContainer.style.fontFamily = font
subathonMessageContainer.style.color = textColor
subathonMessageContainer.style.fontWeight = (textThickness * 100)
subathonMessageContainer.style.textShadow = `1px 2px 4px ${textOutlineColor}`
