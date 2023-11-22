import { WSConn } from '/helpers/ws.js'
import { APIEndpoints } from '/helpers/api-endpoints.js'
import { channelName } from '/helpers/channelName.js'

/** Kick listener */
if(channelName.kickChannel) {
  APIEndpoints.getChannelData().then((data) => {
    const chatroomId = data.chatroom.id
    const channelId = data.chatroom.channel_id
    APIEndpoints.getPinnedMessage({ channelId }).then(data => {
      console.log('Pinned message response: ', data)
    })
    console.log(data)
    const connection = WSConn.connect()
    connection.onopen = () => {
      connection.send(WSConn.connectChatroom({ chatroomId }))
      connection.send(WSConn.connectChannel({ channelId }))
    }
    connection.onmessage = (evt) => {
      const data = JSON.parse(evt.data)
      console.log(data)
    }
  })
}