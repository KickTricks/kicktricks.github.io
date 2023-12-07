import { channelName } from './channelName.js'
import { ModelFactory } from './models.js'
export const APIEndpoints = {
  Kick: {
    getChannelData: () => {
      return fetch(`https://kick.com/api/v2/channels/${channelName.kickChannel}`).then((res) => res.json()).then(data => {
        const result = data
        result.subscriber_badges.sort((a, b) => a.months < b.months ? 1 : -1)
        return result
      })
    },
    getPinnedMessage: ({ channelId }) => {
      return fetch(`https://kick.com/api/v2/channels/${channelId}/messages`).then((res) =>
        res.json()
      ).then(data => 
        data.data.pinned_message ? ModelFactory.Kick.Event.PinnedMessageCreatedEvent(data.data.pinned_message) : null
      )
    }
  }
}
