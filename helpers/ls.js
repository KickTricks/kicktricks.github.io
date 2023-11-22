import { channelName } from './channelName.js'
export const LS = {
  getItem: (name) => {
    return window.localStorage.getItem(`${channelName}/${name}`)
  },
  getInt: (name) => {
    return Number.parseInt(window.localStorage.getItem(`${channelName}/${name}`), 10)
  },
  setItem: (name, value) => {
    return window.localStorage.setItem(`${channelName}/${name}`, value)
  },
  keys: {
    persistentSubCount: 'persistent-sub-count',
  },
}
