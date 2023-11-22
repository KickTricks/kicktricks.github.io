export const channelName = {
  kickChannel: new URLSearchParams(window.location.search).get('kickchannel'),
  twitchChannel: new URLSearchParams(window.location.search).get('twitchchannel'),
  tiktokChannel: new URLSearchParams(window.location.search).get('tiktokchannel'),
  youtubeChannel: new URLSearchParams(window.location.search).get('youtubechannel'),
  toString() {
    return this.kickChannel ?? this.twitchChannel ?? this.tiktokChannel ?? this.youtubeChannel
  }
}