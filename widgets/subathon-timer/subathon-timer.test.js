import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals'
import { WSConn } from '../../helpers/ws'
import { Server } from 'mock-socket'
import { Events } from '../../helpers/models'
import SubathonTimerViewModel from './subathon-timer.viewmodel'

jest.mock('../../helpers/api-endpoints.js')
jest.mock('../../helpers/channelName.js')

/**
 * Gifted event
 * {"event":"App\\Events\\GiftedSubscriptionsEvent","data":"{\"chatroom_id\":59156,\"gifted_usernames\":[\"Patient2\",\"MayorMair44\",\"MercenarySaint\",\"MikeOcasio\",\"Str8HoodOutlawz\",\"MTH6\",\"RyanFatich\",\"ArrontinSpins\",\"MattLapidge\",\"Scraniel\",\"MiuEPbItl\",\"RHlSMoDsKy\",\"22applesauce\"],\"gifter_username\":\"swannyy18\"}","channel":"chatrooms.59156.v2"}
 */
describe('Connect to Kick Websocket', () => {
  let mockServer
  beforeEach(() => {
    mockServer = new Server('ws://localhost:3000')

    WSConn.Kick.onOpen = [
      WSConn.Kick.connectChatroom({ chatroomId: '1' })
    ]
    WSConn.Kick.onMessage = (data) => {
      if (data.event === Events.Kick.SubscriptionEvent) {
        return true
      }
    }
    // Create an instance of your WebSocketModule
  })
  afterEach(() => {
    mockServer.stop()
  })
  test('WebSocket test server runs successfully', () => {
    mockServer.on('open', (socket) => {
      expect(socket.readyState).toBe(WebSocket.OPEN)
    })
  })
  test('WebSocket test server should receive a message', (done) => {
    mockServer.on('connection', (socket) => {
      socket.on('message', (evt) => {
        if(evt === JSON.stringify({
          event: 'pusher:subscribe',
          data: { auth: '', channel: 'chatrooms.1.v2' },
        })) {
          done()
        } else {
          done(new Error())
        }
      })
    })
    WSConn.Kick.connect('ws://localhost:3000')
  })
  test('Subathon timer initial setup', async (done) => {
    mockServer.on('connection', (socket) => {
      socket.on('message', (evt) => {
        if(evt === JSON.stringify({
          event: 'pusher:subscribe',
          data: { auth: '', channel: 'chatrooms.1.v2' },
        })) {
          done()
        } else {
          done(new Error())
        }
      })
    })
    
    const { APIEndpoints } = await import('../../helpers/api-endpoints.js')
    const secondsAddedPerSub = 180
    const maxTime = 1
    const startHour = 1
    const startMinute = 5
    const modComs = true
    jest.spyOn(APIEndpoints.Kick, 'getChannelData').mockReturnValue({ data: { chatroom: '1'}})

    SubathonTimerViewModel.initialize(secondsAddedPerSub, maxTime, startHour, startMinute, modComs, 'ws://localhost:3000')

    // expect(SubathonTimerViewModel.getTime()).toBe(startHour * 60 * 60 + startMinute * 60)
  })
})