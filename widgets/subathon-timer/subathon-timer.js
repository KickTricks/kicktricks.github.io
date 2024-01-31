import { ModelFactory, Events, UserTypes } from '/helpers/models.js'
import { WSConn } from '/helpers/ws.js'
import { APIEndpoints } from '/helpers/api-endpoints.js'
import { LS } from '/helpers/ls.js'
import { channelName } from '/helpers/channelName.js'
import { url } from '../../helpers/url.js'

/** Params */
const [text, textColor, textOutlineColor, font] = url.getParams(['text', 'textcolor', 'textoutlinecolor', 'font'])
const [scale, secondsAddedPerSub, maxTime] = url.getFloatParams(['scale', 'secondsaddedpersub', 'maxtime'])
const [startHour, startMinute] = url.getIntParams(['starthour', 'startminute'])
const [textThickness] = url.getIntParams(['textthickness'])
const [modComs] = url.getBoolParams(['modcoms'])
const updateTimeInMillis = 1000
let interval

/** HTML DOM */
const subathonContainer = document.querySelector('.subathon p.timer')
const subathonMessageContainer = document.querySelector('.subathon p.message')
const hourSpan = subathonContainer.querySelector('.hour')
const minuteSpan = subathonContainer.querySelector('.minute')
const secondSpan = subathonContainer.querySelector('.second')


/** Methods */

const zeroFill = (number) => number < 10 ? `0${number}` : number

const updateSubathon = (addCount) => {
  const currentTotalTime = LS.getInt(LS.keys.totalSubathonTime)
  if(currentTotalTime < maxTime * 60 * 60 || maxTime === 0) {
    const currentTime = LS.getInt(LS.keys.currentSubathonTime)
    if(currentTime < 0) {
      subathonMessageContainer.textContent = text
      subathonContainer.classList.add('hide')
      subathonMessageContainer.classList.remove('hide')
      return
    }
    const newTime = currentTime + (addCount * secondsAddedPerSub)
    LS.setItem(LS.keys.currentSubathonTime, newTime)
    let timeLeft = newTime
    const hours = Math.floor(timeLeft / 60 / 60)
    timeLeft -= (hours * 60 * 60)
    const minutes = Math.floor(timeLeft / 60)
    timeLeft -= (minutes * 60)
    const seconds = Math.floor(timeLeft)
    hourSpan.textContent = zeroFill(hours)
    minuteSpan.textContent = zeroFill(minutes)
    secondSpan.textContent = zeroFill(seconds)
    subathonMessageContainer.classList.add('hide')
    subathonContainer.classList.remove('hide')
    LS.setItem(LS.keys.totalSubathonTime, currentTotalTime + (addCount * secondsAddedPerSub / 60))
  } else {
    let timeLeft = currentTotalTime
    const hours = Math.floor(timeLeft / 60 / 60)
    timeLeft -= (hours * 60 * 60)
    const minutes = Math.floor(timeLeft / 60)
    timeLeft -= (minutes * 60)
    const seconds = Math.floor(timeLeft)
    hourSpan.textContent = zeroFill(hours)
    minuteSpan.textContent = zeroFill(minutes)
    secondSpan.textContent = zeroFill(seconds)
    subathonMessageContainer.classList.add('hide')
    subathonContainer.classList.remove('hide')
  }
}

const clockUpdater = () => {
  const timeLeft = LS.getInt(LS.keys.currentSubathonTime) - 1
  if(timeLeft >= -1) {
    LS.setItem(LS.keys.currentSubathonTime, LS.getInt(LS.keys.currentSubathonTime) - 1)
  } else {
    clearInterval(interval)
  }
  updateSubathon(0)
}

/** Initialize */
if (scale > 0) {
  document.querySelector('html').style.fontSize = `${14 * scale}px`
}
subathonContainer.style.fontFamily = font
subathonContainer.style.color = textColor
subathonContainer.style.fontWeight = (textThickness * 100)
subathonContainer.style.textShadow = `1px 2px 4px ${textOutlineColor}`

if (!LS.getInt(LS.keys.currentSubathonTime)) {
  LS.setItem(LS.keys.currentSubathonTime, (startHour * 60 * 60) + (startMinute * 60))
}
if (!LS.getInt(LS.keys.totalSubathonTime)) {
  const startHourToMinutes = (startHour === 0) ? 0 : startHour * 60
  const initialTime = startHourToMinutes + startMinute
  LS.setItem(LS.keys.totalSubathonTime, initialTime)
}

updateSubathon(0)

interval = setInterval(clockUpdater, updateTimeInMillis)

/** Kick listener */
if(channelName.kickChannel) {
  APIEndpoints.Kick.getChannelData().then((data) => {
    const chatroomId = data.chatroom.id

    const connection = WSConn.Kick
    connection.onOpen = [
      WSConn.Kick.connectChatroom({ chatroomId })
    ]
    connection.onMessage = (data) => {
      if (data.event === Events.Kick.SubscriptionEvent) {
        updateSubathon(1)
      } else if (data.event === Events.Kick.GiftedSubscriptionsEvent) {
        const giftedSubscriptionEvent = ModelFactory.Kick.Event.GiftedSubscriptionsEvent(JSON.parse(data.data))
        updateSubathon(giftedSubscriptionEvent.gifted_usernames.length)
      } else if (data.event === Events.Kick.ChatMessageEvent) {
        const chatMessageEvent = ModelFactory.Kick.Event.ChatMessageEvent(JSON.parse(data.data))
        if (chatMessageEvent.sender.identity.badges.find((x) => x.type === UserTypes.Kick.Broadcaster || (modComs && x.type === UserTypes.Kick.Moderator))) {
          if (chatMessageEvent.content.match(/^!kt\/subathon-add-subs (\d+)$/gi)) {
            updateSubathon(chatMessageEvent.content.match(/\d+/g))
          } else if (chatMessageEvent.content.match(/^!kt\/subathon-remove-subs (\d+)$/gi)) {
            updateSubathon(-chatMessageEvent.content.match(/\d+/g))
          } else if (chatMessageEvent.content.match(/^!kt\/subathon-add-seconds (\d+)$/gi)) {
            updateSubathon(chatMessageEvent.content.match(/\d+/g) / secondsAddedPerSub)
          } else if (chatMessageEvent.content.match(/^!kt\/subathon-remove-seconds (\d+)$/gi)) {
            updateSubathon(chatMessageEvent.content.match(/\d+/g) / -secondsAddedPerSub)
          } else if (chatMessageEvent.content.match(/^!kt\/subathon-set-start-time (\d+):(\d+)$/gi)) {
            clearInterval(interval)
            interval = setInterval(clockUpdater, updateTimeInMillis)
            const [startHour, startMinute] = chatMessageEvent.content.match(/(\d+):(\d+)/g)[0].split(':')
            LS.setItem(LS.keys.currentSubathonTime, (startHour * 60 * 60) + (startMinute * 60))
            updateSubathon(0)
          }
        }
      }
    }
    connection.connect()
  })
}