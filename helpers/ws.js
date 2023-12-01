import { channelName } from './channelName.js'

export const WSConn = {
  Kick: {
    connect: () => {
      const baseUrl = 'wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c'
      const urlParams = new URLSearchParams({
        protocol: '7',
        client: 'js',
        version: '7.6.0',
        flash: false,
      })
      const url = `${baseUrl}?${urlParams.toString()}`
      return new WebSocket(url)
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
