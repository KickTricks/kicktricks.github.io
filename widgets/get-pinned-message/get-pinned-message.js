import { ModelFactory, Events } from '/helpers/models.js'
import { Badges } from '/helpers/badges.js'
import { Emotes } from '/helpers/emotes.js'
import { WSConn } from '/helpers/ws.js'
import { channelName } from '/helpers/channelName.js'
import { APIEndpoints } from '/helpers/api-endpoints.js'
import { url } from '/helpers/url.js'

/** Params */
const [scale] = url.getFloatParams(['scale'])
let subscriberBadges, pinnedMessagePendingDeletionTimeout

/** HTML DOM */
const pinnedMessageContainer = document.querySelector('.pinned-message')
const badgesSpan = document.querySelector('.badges')
const usernameSpan = document.querySelector('.username')
const messageSpan = document.querySelector('.message')

/** Methods */
const pinMessage = ({ duration, message }) => {
  const content = Emotes.parse(message.content)
  const createdAt = new Date(message.created_at)
  const finishesAt = new Date(message.created_at)
  finishesAt.setMinutes(createdAt.getMinutes() + duration)
  const timeOutDuration = finishesAt.getTime() - createdAt.getTime()
  badgesSpan.innerHTML = message.sender.identity.badges.map((badge) =>
    Badges.getBadge(subscriberBadges, badge.type, badge.count)
  ).join('')
  usernameSpan.style.color = message.sender.identity.color
  usernameSpan.innerHTML = message.sender.username
  messageSpan.innerHTML = ` ${content}`
  pinnedMessageContainer.classList.remove('hidden')
  window.clearTimeout(pinnedMessagePendingDeletionTimeout)
  pinnedMessagePendingDeletionTimeout = window.setTimeout(() => {
    pinnedMessageContainer.classList.add('hidden')
  }, timeOutDuration)
}

/** Initialize */
if (scale > 0) {
  document.querySelector('html').style.fontSize = `${14 * scale}px`
}

/** Kick listener */
if(channelName.kickChannel) {
  APIEndpoints.kick.getChannelData().then((data) => {
    const chatroomId = data.chatroom.id
    const channelId = data.chatroom.channel_id
    subscriberBadges = data.subscriber_badges
    APIEndpoints.kick.getPinnedMessage({ channelId }).then(data => {
      if(data) {
        pinMessage(data)
      }
    })
    const connection = WSConn.connect()
    connection.onopen = () => {
      connection.send(WSConn.connectChatroom({ chatroomId }))
    }
    connection.onmessage = (evt) => {
      const data = JSON.parse(evt.data)
      if (data.event === Events.PinnedMessageCreatedEvent) {
        pinMessage(ModelFactory.Event.PinnedMessageCreatedEvent(JSON.parse(data.data)))
      } else if (data.event === Events.PinnedMessageDeletedEvent) {
        window.clearTimeout(pinnedMessagePendingDeletionTimeout)
        pinnedMessageContainer.classList.add('hidden')
      }
    }
  })
}