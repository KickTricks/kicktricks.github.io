import { channelName } from './channelName.js'

export const WSConn = {
  Kick: {
    connection: null,
    connect: (baseUrl = 'wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c') => {
      const urlParams = new URLSearchParams({
        protocol: '7',
        client: 'js',
        version: '7.6.0',
        flash: false,
      })
      const url = `${baseUrl}?${urlParams.toString()}`
      WSConn.Kick.connection = new WebSocket(url)
      WSConn.Kick.connection.onopen = () => {
        if(WSConn.Kick.onOpen?.length) {
          WSConn.Kick.onOpen.forEach(open => {
            WSConn.Kick.connection.send(open)
          })
        }
      }
      WSConn.Kick.connection.onmessage = (evt) => {
        if(!evt?.data) return
        const data = JSON.parse(evt.data)
        WSConn.Kick.receiveMessage(data)
        WSConn.Kick.onMessage(data)
      }
    },
    connectChatroom: ({ chatroomId }) =>
      JSON.stringify({
        event: 'pusher:subscribe',
        data: { auth: '', channel: `chatrooms.${chatroomId}.v2` },
      }),
    connectChannel: ({ channelId }) =>
      JSON.stringify({
        event: 'pusher:subscribe',
        data: { auth: '', channel: `channel.${channelId}` },
      }),
    onOpen: null,
    onMessage: null,
    pingInterval: 120000, // 2 minutes
    pongTimeout: 10000, // 10 seconds
    pingTimer: null,
    reconnectTimer: null,
    start: () => {
      WSConn.Kick.pingTimer = setInterval(WSConn.Kick.sendPing, WSConn.Kick.pingInterval)
    },
    sendPing: () => {
      if (WSConn.Kick.connection.readyState === WebSocket.OPEN) {
        WSConn.Kick.connection.send(JSON.stringify({'event':'pusher:ping','data':{}}))
        WSConn.Kick.waitForPong()
      }
    },
    waitForPong: () => {
      WSConn.Kick.reconnectTimer = setTimeout(WSConn.Kick.reconnect, WSConn.Kick.pongTimeout)
    },
    reconnect: () => {
      WSConn.Kick.connect()
    },
    receiveMessage: (data) => {
      if (data.event === 'pusher:pong') {
        clearTimeout(WSConn.Kick.reconnectTimer)
      }
      clearInterval(WSConn.Kick.pingTimer)
      WSConn.Kick.pingTimer = setInterval(WSConn.Kick.sendPing, WSConn.Kick.pingInterval)
    }
  },
  Twitch: {
    connect: () => {
      const baseUrl = 'wss://irc-ws.chat.twitch.tv:443'
      const urlParams = new URLSearchParams({
        protocol: '7',
        client: 'js',
        version: '7.6.0',
        flash: false,
      })
      const url = `${baseUrl}?${urlParams.toString()}`
      return new WebSocket(url)
    },
    connectChatroom: () => ['CAP REQ :twitch.tv/tags twitch.tv/commands', 'PASS SCHMOOPIIE', 'NICK justinfan77960', 'USER justinfan77960 8 * :justinfan77960', `JOIN #${channelName.twitchChannel}`],
  },
}
