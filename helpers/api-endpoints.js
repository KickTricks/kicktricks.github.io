import { channelName } from './channelName.js'
export const APIEndpoints = {
  getChannelData: () => {
    return fetch(`https://kick.com/api/v2/channels/${channelName.kickChannel}`).then((res) =>
      res.json()
    )
  }
}
