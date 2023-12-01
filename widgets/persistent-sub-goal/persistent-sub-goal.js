import { ModelFactory, Events, UserTypes } from '/helpers/models.js'
import { WSConn } from '/helpers/ws.js'
import { APIEndpoints } from '/helpers/api-endpoints.js'
import { LS } from '/helpers/ls.js'
import { channelName } from '/helpers/channelName.js'
import { url } from '../../helpers/url.js'

/** Params */
const [text, textColor, textOutlineColor, font] = url.getParams(['text', 'textcolor', 'textoutlinecolor', 'font'])
const [scale] = url.getFloatParams(['scale'])
let [subGoal] = url.getIntParams(['goal'])
const [increment, textThickness] = url.getIntParams(['increment', 'textthickness'])
const [modComs] = url.getBoolParams(['modcoms'])

/** HTML DOM */
const subgoalContainer = document.querySelector('.sub-goal p')

/** Methods */
const updateSubGoal = (addCount) => {
  const count = LS.getInt(LS.keys.persistentSubCount) + addCount
  while (count >= subGoal && increment !== 0) {
    subGoal = subGoal + increment
  }
  const replaceSub = text.replace('{subs}', count ?? 0)
  const replaceSubGoal = replaceSub.replace('{subGoal}', subGoal)
  subgoalContainer.innerHTML = replaceSubGoal
  LS.setItem(LS.keys.persistentSubCount, count)
}

/** Initialize */
if (scale > 0) {
  document.querySelector('html').style.fontSize = `${14 * scale}px`
}
subgoalContainer.style.fontFamily = font
subgoalContainer.style.color = textColor
subgoalContainer.style.fontWeight = (textThickness * 100)
subgoalContainer.style.textShadow = `1px 2px 4px ${textOutlineColor}`

if (!LS.getInt(LS.keys.persistentSubCount)) {
  LS.setItem(LS.keys.persistentSubCount, 0)
}
updateSubGoal(0)

/** Kick listener */
if(channelName.kickChannel) {
  APIEndpoints.Kick.getChannelData().then((data) => {
    const chatroomId = data.chatroom.id

    const connection = WSConn.Kick.connect()
    connection.onopen = () => {
      connection.send(WSConn.Kick.connectChatroom({ chatroomId }))
    }
    connection.onmessage = (evt) => {
      const data = JSON.parse(evt.data)
      if (data.event === Events.Kick.SubscriptionEvent) {
        updateSubGoal(1)
      } else if (data.event === Events.Kick.GiftedSubscriptionsEvent) {
        const giftedSubscriptionEvent = ModelFactory.Kick.Event.GiftedSubscriptionsEvent(JSON.parse(data.data))
        updateSubGoal(giftedSubscriptionEvent.gifted_usernames.length)
      } else if (data.event === Events.Kick.ChatMessageEvent) {
        const chatMessageEvent = ModelFactory.Kick.Event.ChatMessageEvent(JSON.parse(data.data))
        if (chatMessageEvent.sender.identity.badges.find((x) => x.type === UserTypes.Kick.Broadcaster || (modComs && x.type === UserTypes.Kick.Moderator))) {
          if (chatMessageEvent.content.match(/^!kt\/set-persistent-subs (\d+)$/gi)) {
            LS.setItem(LS.keys.persistentSubCount, chatMessageEvent.content.match(/\d+/g))
            subGoal = url.getIntParams('goal')
            updateSubGoal(0)
          }
        }
      }
    }
  })
}