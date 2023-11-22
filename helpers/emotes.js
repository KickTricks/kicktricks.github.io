export const Emotes = {
  parse: (message) =>
    message.replace(
      /\[emote:(\d+):.+?\]/g,
      '<img src="https://files.kick.com/emotes/$1/fullsize"/>'
    ),
}
