import { ModelFactory, Events, UserTypes } from '../../helpers/models.js'
import { WSConn } from '../../helpers/ws.js'
import { APIEndpoints } from '../../helpers/api-endpoints.js'
import { LS } from '../../helpers/ls.js'
import { channelName } from '../../helpers/channelName.js'

const SubathonTimerViewModel = {
  /** Params */
  secondsAddedPerSub: null,
  maxTime: null,
  startHour: null,
  startMinute: null,
  modComs: false,
  updateTimeInMillis: 1000,
  interval: null,
  /** Methods */
  initialize: (secondsAddedPerSub, maxTime, startHour, startMinute, modComs, kickWSUrl = 'wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c') => {
    SubathonTimerViewModel.secondsAddedPerSub = secondsAddedPerSub
    SubathonTimerViewModel.maxTime = maxTime
    SubathonTimerViewModel.startHour = startHour
    SubathonTimerViewModel.startMinute = startMinute
    SubathonTimerViewModel.modComs = modComs
    if (!LS.getInt(LS.keys.currentSubathonTime)) {
      LS.setItem(LS.keys.currentSubathonTime, (SubathonTimerViewModel.startHour * 60 * 60) + (SubathonTimerViewModel.startMinute * 60))
    }
    if (!LS.getInt(LS.keys.totalSubathonTime)) {
      const startHourToMinutes = (SubathonTimerViewModel.startHour === 0) ? 0 : SubathonTimerViewModel.startHour * 60
      const initialTime = startHourToMinutes + SubathonTimerViewModel.startMinute
      LS.setItem(LS.keys.totalSubathonTime, initialTime)
    }
    if(SubathonTimerViewModel.interval) {
      clearInterval(SubathonTimerViewModel.interval)
    }
    SubathonTimerViewModel.interval = setInterval(SubathonTimerViewModel.clockUpdater, SubathonTimerViewModel.updateTimeInMillis)
    SubathonTimerViewModel.kickConnect(kickWSUrl)
  },
  addSubscriberTime: (subsAmount) => {
    const timeLeft = SubathonTimerViewModel.getTime() - 1
    if(timeLeft >= -1) {
      const currentTotalTime = LS.getInt(LS.keys.totalSubathonTime)
      if(currentTotalTime < SubathonTimerViewModel.maxTime * 60 || SubathonTimerViewModel.maxTime === 0 || subsAmount < 0) {
        const currentTime = LS.getInt(LS.keys.currentSubathonTime)
        const newTime = currentTime + (subsAmount * SubathonTimerViewModel.secondsAddedPerSub)
        LS.setItem(LS.keys.currentSubathonTime, newTime)
        LS.setItem(LS.keys.totalSubathonTime, currentTotalTime + (subsAmount * SubathonTimerViewModel.secondsAddedPerSub / 60))
      }
    }
  },
  clockUpdater: () => {
    const timeLeft = LS.getInt(LS.keys.currentSubathonTime) - 1
    if(timeLeft >= -1) {
      LS.setItem(LS.keys.currentSubathonTime, LS.getInt(LS.keys.currentSubathonTime) - 1)
    } else {
      clearInterval(SubathonTimerViewModel.interval)
    }
  },
  reset: () => {
    if(SubathonTimerViewModel.interval) {
      clearInterval(SubathonTimerViewModel.interval)
    }
    SubathonTimerViewModel.interval = setInterval(SubathonTimerViewModel.clockUpdater, SubathonTimerViewModel.updateTimeInMillis)
    LS.setItem(LS.keys.currentSubathonTime, (SubathonTimerViewModel.startHour * 60 * 60) + (SubathonTimerViewModel.startMinute * 60))
    const startHourToMinutes = (SubathonTimerViewModel.startHour === 0) ? 0 : SubathonTimerViewModel.startHour * 60
    const initialTime = startHourToMinutes + SubathonTimerViewModel.startMinute
    LS.setItem(LS.keys.totalSubathonTime, initialTime)
  },
  getTime: () => LS.getInt(LS.keys.currentSubathonTime),
  /** Helpers */
  zeroFill: (number) => number < 10 ? `0${number}` : number,
  /** Kick Connection */
  kickConnect: () => {
    if(channelName.kickChannel) {
      APIEndpoints.Kick.getChannelData().then((data) => {
        const chatroomId = data.chatroom.id
        const connection = WSConn.Kick
        connection.onOpen = [
          WSConn.Kick.connectChatroom({ chatroomId })
        ]
        connection.onMessage = (data) => {
          if (data.event === Events.Kick.SubscriptionEvent) {
            SubathonTimerViewModel.addSubscriberTime(1)
          } else if (data.event === Events.Kick.GiftedSubscriptionsEvent) {
            const giftedSubscriptionEvent = ModelFactory.Kick.Event.GiftedSubscriptionsEvent(JSON.parse(data.data))
            for(let i = 0; i < giftedSubscriptionEvent.gifted_usernames.length; i++) {
              SubathonTimerViewModel.addSubscriberTime(1)
            }
          } else if (data.event === Events.Kick.ChatMessageEvent) {
            const chatMessageEvent = ModelFactory.Kick.Event.ChatMessageEvent(JSON.parse(data.data))
            if (chatMessageEvent.sender.identity.badges.find((x) => x.type === UserTypes.Kick.Broadcaster || (SubathonTimerViewModel.modComs && x.type === UserTypes.Kick.Moderator))) {
              if (chatMessageEvent.content.match(/^!kt\/subathon-add-subs (\d+)$/gi)) {
                for(let i = 0; i < chatMessageEvent.content.match(/\d+/g); i++) {
                  SubathonTimerViewModel.addSubscriberTime(1)
                }
              } else if (chatMessageEvent.content.match(/^!kt\/subathon-remove-subs (\d+)$/gi)) {
                for(let i = 0; i < chatMessageEvent.content.match(/\d+/g); i++) {
                  SubathonTimerViewModel.addSubscriberTime(-1)
                }
              } else if (chatMessageEvent.content.match(/^!kt\/subathon-add-seconds (\d+)$/gi)) {
                SubathonTimerViewModel.addSubscriberTime(chatMessageEvent.content.match(/\d+/g) / SubathonTimerViewModel.secondsAddedPerSub)
              } else if (chatMessageEvent.content.match(/^!kt\/subathon-remove-seconds (\d+)$/gi)) {
                SubathonTimerViewModel.addSubscriberTime(chatMessageEvent.content.match(/\d+/g) / -SubathonTimerViewModel.secondsAddedPerSub)
              } else if (chatMessageEvent.content.match(/^!kt\/subathon-reset$/gi)) {
                SubathonTimerViewModel.reset()
              }
            }
          }
        }
        connection.connect()
      })
    }
  }
}

export default SubathonTimerViewModel