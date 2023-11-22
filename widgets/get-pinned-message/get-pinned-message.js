import { ModelFactory, Events } from '/helpers/models.js'
import { Badges } from '/helpers/badges.js'
import { Emotes } from '/helpers/emotes.js'
import { WSConn } from '/helpers/ws.js'
import { APIEndpoints } from '/helpers/api-endpoints.js'

const kickChannelName = new URLSearchParams(window.location.search).get('kickchannel')
const scale = new URLSearchParams(window.location.search).get('scale')
const pinnedMessageContainer = document.querySelector('.pinned-message')
let subscriberBadges, pinnedMessagePendingDeletionTimeout


if (scale > 0) {
  document.querySelector('html').style.fontSize = `${14 * scale}px`
}

const pinMessage = ({ duration, message }) => {
  const content = Emotes.parse(message.content)
  pinnedMessageContainer.innerHTML = `
        <p><span class="badges">${message.sender.identity.badges
    .map((badge) =>
      Badges.getBadge(subscriberBadges, badge.type, badge.count)
    )
    .join('')}</span> <span class="bold"><span style="color: ${
  message.sender.identity.color
}">${
  message.sender.username
}</span>:</span><span class="message"> ${content}</span></p>
        `
  pinnedMessageContainer.classList.remove('hidden')
  window.clearTimeout(pinnedMessagePendingDeletionTimeout)
  pinnedMessagePendingDeletionTimeout = window.setTimeout(() => {
    pinnedMessageContainer.classList.add('hidden')
  }, duration * 60000)
}

APIEndpoints.getChannelData({ kickChannelName }).then((data) => {
  const chatroomId = data.chatroom.id
  const channelId = data.chatroom.channel_id
  subscriberBadges = data.subscriber_badges
  APIEndpoints.getPinnedMessage({ channelId }).then(data => {
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
