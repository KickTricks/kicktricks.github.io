export const Emotes = {
  Kick: {
    parse: (message) =>
      message.replace(
        /\[emote:(\d+):.+?\]/g,
        '<img src="https://files.kick.com/emotes/$1/fullsize"/>'
      ),
    getName: (message) => message.replace(
      /\[emote:\d+:(.+?)\]/g,
      '$1'
    ),
    removeAll: (message) => 
      message.replace(/(\[emote:\d+:\w+\])/g, '').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
  }
}
