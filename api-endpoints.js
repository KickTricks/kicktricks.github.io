export const APIEndpoints = {
    getChannelData: ({ channelName }) => fetch(`https://kick.com/api/v2/channels/${channelName}`).then(res => res.json()),
}
