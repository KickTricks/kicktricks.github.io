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
    )
  }
}
