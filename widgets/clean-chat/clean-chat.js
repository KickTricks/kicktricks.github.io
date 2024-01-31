import { ModelFactory, Events } from '/helpers/models.js'
import { Badges } from '/helpers/badges.js'
import { Emotes } from '/helpers/emotes.js'
import { WSConn } from '/helpers/ws.js'
import { channelName } from '/helpers/channelName.js'
import { APIEndpoints } from '/helpers/api-endpoints.js'
import { url } from '/helpers/url.js'

/** Params */
const [scale] = url.getFloatParams(['scale'])
const [ignoreCommands, ignoreReplies, emoteMessageAsEmpty] = url.getBoolParams(['ignorecommands', 'ignorereplies', 'emotemessageasempty'])
const [hostMessage, subscriberMessage, giftMessage, ignoreUsers, backgroundOpacity] = url.getParams(['hostmessage', 'subscribermessage', 'giftmessage', 'ignoreusers', 'bgopacity'])
let subscriberBadges, ignoredUsers

/** HTML DOM */
const chatContainer = document.querySelector('.clean-chat-container')
const messageTemplate = document.querySelector('.clean-chat-template-message p')
const eventTemplate = document.querySelector('.clean-chat-event-template-message p')

/** Methods */
const writeMessage = (message) => {
  const template = messageTemplate.cloneNode(true)
  const badgesSpan = template.querySelector('.badges')
  const usernameSpan = template.querySelector('.username')
  const messageSpan = template.querySelector('.message')
  template.classList.add(`user-${message.sender.slug}`)
  template.classList.add(`message-${message.id}`)
  const content = Emotes.Kick.parse(message.content)
  badgesSpan.innerHTML = message.sender.identity.badges.map((badge) =>
    Badges.Kick.getBadge(subscriberBadges, badge.type, badge.count)
  ).join('')
  usernameSpan.style.color = message.sender.identity.color
  usernameSpan.innerHTML = message.sender.username
  messageSpan.innerHTML = ` ${content}`
  chatContainer.appendChild(template)
  while(window.innerWidth > document.documentElement.clientWidth) {
    chatContainer.removeChild(chatContainer.firstChild)
  }
}
const writeHostMessage = (message) => {
  const hostMessageElement = eventTemplate.cloneNode(true)
  const messageSpan = hostMessageElement.querySelector('.highlight-message')
  let outputMessage = hostMessage.replace('{raider}', message.host_username)
  outputMessage = outputMessage.replace('{raiderCount}', message.number_viewers)
  messageSpan.innerHTML = outputMessage
  chatContainer.appendChild(hostMessageElement)
  while(window.innerWidth > document.documentElement.clientWidth) {
    chatContainer.removeChild(chatContainer.firstChild)
  }
}
const writeSubscriberMessage = (message) => {
  const subscriberMessageElement = eventTemplate.cloneNode(true)
  const messageSpan = subscriberMessageElement.querySelector('.highlight-message')
  let outputMessage = subscriberMessage.replace('{chatter}', message.username)
  outputMessage = outputMessage.replace('{monthCount}', message.months)
  messageSpan.innerHTML = outputMessage
  chatContainer.appendChild(subscriberMessageElement)
  while(window.innerWidth > document.documentElement.clientWidth) {
    chatContainer.removeChild(chatContainer.firstChild)
  }
}
const writeGiftMessage = (message) => {
  const giftMessageElement = eventTemplate.cloneNode(true)
  const messageSpan = giftMessageElement.querySelector('.highlight-message')
  let outputMessage = giftMessage.replace('{chatter}', message.gifter_username)
  outputMessage = outputMessage.replace('{giftCount}', message.gifted_usernames.length)
  messageSpan.innerHTML = outputMessage
  chatContainer.appendChild(giftMessageElement)
  while(window.innerWidth > document.documentElement.clientWidth) {
    chatContainer.removeChild(chatContainer.firstChild)
  }
}
/** Initialize */
if (scale > 0) {
  document.querySelector('html').style.fontSize = `${14 * scale}px`
  ignoredUsers = (ignoreUsers && ignoreUsers !== '') ? ignoreUsers.split(',').map(user => user.toLowerCase().trim()) : []
  if(backgroundOpacity) {
    chatContainer.style.backgroundColor = '#24272c' + backgroundOpacity
  }
}

/** Kick listener */
if(channelName.kickChannel) {
  APIEndpoints.Kick.getChannelData().then((data) => {
    const chatroomId = data.chatroom.id
    subscriberBadges = data.subscriber_badges
    const connection = WSConn.Kick
    connection.onOpen = [
      WSConn.Kick.connectChatroom({ chatroomId })
    ]
    connection.onMessage = (data) => {
      if (data.event === Events.Kick.ChatMessageEvent) {
        const message = ModelFactory.Kick.Event.ChatMessageEvent(JSON.parse(data.data))
        if(ignoreCommands && message.content[0] === '!') return
        if(ignoreReplies && message.type === 'reply') return
        if(ignoredUsers.length && ignoredUsers.includes(message.sender.slug)) return
        if(emoteMessageAsEmpty && Emotes.Kick.removeAll(message.content).trim() === '') return
        writeMessage(message)
      } else if (data.event === Events.Kick.UserBannedEvent) {
        const deletedMessage = ModelFactory.Kick.Event.UserBannedEvent(JSON.parse(data.data))
        const chatMessages = chatContainer.querySelectorAll(`p.user-${deletedMessage.user.slug}`)
        if(chatMessages.length > 0) {
          chatMessages.forEach(chatMessage => {
            chatContainer.removeChild(chatMessage)
          })
        }
      } else if (data.event === Events.Kick.MessageDeletedEvent) {
        const deletedMessage = ModelFactory.Kick.Event.MessageDeletedEvent(JSON.parse(data.data))
        const chatMessage = chatContainer.querySelector(`p.message-${deletedMessage.message.id}`)
        if(chatMessage) {
          chatContainer.removeChild(chatMessage)
        }
      } else if (data.event === Events.Kick.StreamHostEvent) {
        const hostMessage = ModelFactory.Kick.Event.StreamHostEvent(JSON.parse(data.data))
        writeHostMessage(hostMessage)
      } else if (data.event === Events.Kick.SubscriptionEvent) {
        const subscriberMessage = ModelFactory.Kick.Event.SubscriptionEvent(JSON.parse(data.data))
        writeSubscriberMessage(subscriberMessage)
      } else if (data.event === Events.Kick.GiftedSubscriptionsEvent) {
        const giftMessage = ModelFactory.Kick.Event.GiftedSubscriptionsEvent(JSON.parse(data.data))
        writeGiftMessage(giftMessage)
      } else if (data.event === Events.Kick.ChatroomClearEvent) {
        chatContainer.innerHTML = ''
      }
    }
    connection.connect()
  })
}