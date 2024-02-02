import { Availabilities } from './availabilities.js'
import { Categories } from './categories.js'
import { Roles } from './roles.js'
import { Supports } from './supports.js'
export const Widgets = {
  PinnedMessages: {
    name: 'Show pinned message on screen',
    type: 'show-pinned-message-on-screen',
    image: 'sample-1.jpg',
    shortDescription: 'Show the currently pinned chat message on screen',
    description: 'Show the currently pinned chat message on screen',
    category: Categories.PinnedMessages,
    url: 'get-pinned-message/get-pinned-message.html',
    version: '1.0.0',
    changelog: {
      '1.1.1': ['Added ping-pong mechanices'],
      '1.1.0': ['Added chat commands to permanently pin message on screen, and remove the pinned message from the screen'],
      '1.0.0': ['Initial release']
    },
    supports: [
      Supports.Kick,
    ],
    chatCommands: [
      {
        command: '!kt/permanent-pin',
        example: '!kt/permanent-pin',
        description: 'Permanently pins the current pinned message',
        availability: [{
          role: Roles.broadcaster,
          availability: Availabilities.mandatory
        },{
          role: Roles.moderator,
          availability: Availabilities.optional
        },{
          role: Roles.subscriber,
          availability: Availabilities.unavailable
        },{
          role: Roles.viewer,
          availability: Availabilities.unavailable
        },
        ]
      },{
        command: '!kt/remove-pin',
        example: '!kt/remove-pin',
        description: 'Removes the currently pinned message',
        availability: [{
          role: Roles.broadcaster,
          availability: Availabilities.mandatory
        },{
          role: Roles.moderator,
          availability: Availabilities.optional
        },{
          role: Roles.subscriber,
          availability: Availabilities.unavailable
        },{
          role: Roles.viewer,
          availability: Availabilities.unavailable
        },
        ]
      },
    ],
    parameters: [{
      name: 'kickchannel',
      type: 'text',
      description: 'Kick Channel Name',
      default: '',
      required: true,
      group: 'channel'
    },{
      name: 'scale',
      type: 'text',
      description: 'Scale',
      default: '1',
      required: true,
    },{
      name: 'modcoms',
      type: 'toggle',
      description: 'Allow moderators to use chat commands',
      default: false,
    }]
  },
  SubscriberCounters: {
    name: 'Subscriber Goal & Counter',
    type: 'subscriber-goal-and-counter',
    image: 'sample-1.jpg',
    shortDescription: 'A basic subscriber counter with automatic subscriber goal update',
    description: 'Automatically updates the subscriber count and persist the count until it is manually reset. Subscriber goal is automatically updated as well when the goal is reached, unless the increment value is 0',
    category: Categories.SubscriberCounters,
    url: 'persistent-sub-goal/persistent-sub-goal.html',
    version: '1.0.2',
    changelog: {
      '1.0.2': ['Added reset command'],
      '1.0.1': ['Added ping-pong mechanices'],
      '1.0.0': ['Initial release']
    },
    supports: [
      Supports.Kick,
    ],
    chatCommands: [
      {
        command: '!kt/set-persistent-subs',
        example: '!kt/set-persistent-subs 16',
        description: 'Sets the current subscriber number',
        availability: [{
          role: Roles.broadcaster,
          availability: Availabilities.mandatory
        },{
          role: Roles.moderator,
          availability: Availabilities.optional
        },{
          role: Roles.subscriber,
          availability: Availabilities.unavailable
        },{
          role: Roles.viewer,
          availability: Availabilities.unavailable
        },
        ]
      },
      {
        command: '!kt/persistent-subs-reset',
        example: '!kt/persistent-subs-reset',
        description: 'Resets the counter to 0',
        availability: [{
          role: Roles.broadcaster,
          availability: Availabilities.mandatory
        },{
          role: Roles.moderator,
          availability: Availabilities.optional
        },{
          role: Roles.subscriber,
          availability: Availabilities.unavailable
        },{
          role: Roles.viewer,
          availability: Availabilities.unavailable
        },
        ]
      }
    ],
    parameters: [{
      name: 'kickchannel',
      type: 'text',
      description: 'Kick Channel Name',
      default: '',
      required: true,
    },{
      name: 'scale',
      type: 'text',
      description: 'Scale',
      default: '1',
      required: true,
    },{
      name: 'goal',
      type: 'tel',
      description: 'Inital subscriber goal',
      default: '10',
      required: true,
    },{
      name: 'increment',
      type: 'tel',
      description: 'Goal increments by',
      default: '10',
      required: true,
    },{
      name: 'text',
      type: 'text',
      description: 'Text',
      default: 'Sub goal: {subs}/{subGoal}',
      required: true,
    },{
      name: 'textcolor',
      type: 'color',
      description: 'Text Color',
      default: '#ffffff',
      required: true,
    },{
      name: 'textoutlinecolor',
      type: 'color',
      description: 'Text Outline Color',
      default: '#aaaaaa',
      required: true,
    },{
      name: 'textthickness',
      type: 'text',
      description: 'Text Thickness (1-9)',
      default: '4',
      required: true,
    },{
      name: 'font',
      type: 'text',
      description: 'Font Name',
      default: 'Inter',
      required: true,
    },{
      name: 'modcoms',
      type: 'toggle',
      description: 'Allow moderators to use chat commands',
      default: false,
    }]
  },
  SubathonTimer: {
    name: 'Subathon Timer',
    type: 'subathon-timer',
    image: 'sample-1.jpg',
    shortDescription: 'A basic countdown for your subathon',
    description: 'A basic timer to add to your subathon that counts down from a given time to 0, and displays a text when the countdown is over. Subs will add time to the timer, and the timer can be controlled by you and your mods through the chat.',
    category: Categories.Subathons,
    url: 'subathon-timer/subathon-timer.html',
    version: '1.1.2',
    changelog: {
      '1.1.2': ['Backend changes, removed set time command and added reset command'],
      '1.1.1': ['Added ping-pong mechanices'],
      '1.1.0': ['Added max time'],
      '1.0.0': ['Initial release']
    },
    supports: [
      Supports.Kick,
    ],
    chatCommands: [
      {
        command: '!kt/subathon-add-subs',
        example: '!kt/subathon-add-subs 16',
        description: 'Adds 16 subs to the timer',
        availability: [{
          role: Roles.broadcaster,
          availability: Availabilities.mandatory
        },{
          role: Roles.moderator,
          availability: Availabilities.optional
        },{
          role: Roles.subscriber,
          availability: Availabilities.unavailable
        },{
          role: Roles.viewer,
          availability: Availabilities.unavailable
        },
        ]
      },
      {
        command: '!kt/subathon-remove-subs',
        example: '!kt/subathon-remove-subs 21',
        description: 'Removes 21 subs from the timer',
        availability: [{
          role: Roles.broadcaster,
          availability: Availabilities.mandatory
        },{
          role: Roles.moderator,
          availability: Availabilities.optional
        },{
          role: Roles.subscriber,
          availability: Availabilities.unavailable
        },{
          role: Roles.viewer,
          availability: Availabilities.unavailable
        },
        ]
      },
      {
        command: '!kt/subathon-add-seconds',
        example: '!kt/subathon-add-seconds 30',
        description: 'Adds 30 seconds to the timer',
        availability: [{
          role: Roles.broadcaster,
          availability: Availabilities.mandatory
        },{
          role: Roles.moderator,
          availability: Availabilities.optional
        },{
          role: Roles.subscriber,
          availability: Availabilities.unavailable
        },{
          role: Roles.viewer,
          availability: Availabilities.unavailable
        },
        ]
      },
      {
        command: '!kt/subathon-remove-seconds',
        example: '!kt/subathon-remove-seconds 42',
        description: 'Removes 42 seconds from the timer',
        availability: [{
          role: Roles.broadcaster,
          availability: Availabilities.mandatory
        },{
          role: Roles.moderator,
          availability: Availabilities.optional
        },{
          role: Roles.subscriber,
          availability: Availabilities.unavailable
        },{
          role: Roles.viewer,
          availability: Availabilities.unavailable
        },
        ]
      },
    ],
    parameters: [{
      name: 'kickchannel',
      type: 'text',
      description: 'Kick Channel Name',
      default: '',
      required: true,
    },{
      name: 'scale',
      type: 'text',
      description: 'Scale',
      default: '1',
      required: true,
    },{
      name: 'starthour',
      type: 'tel',
      description: 'Hours to start with',
      default: '6',
      required: true,
    },{
      name: 'startminute',
      type: 'tel',
      description: 'Minutes to start with',
      default: '00',
      required: true,
    },{
      name: 'secondsaddedpersub',
      type: 'tel',
      description: 'Seconds added per sub',
      default: '10',
      required: true,
    },{
      name: 'maxtime',
      type: 'tel',
      description: 'Max duration in hours, use 0 for unlimited',
      default: '24',
      required: true,
    },{
      name: 'text',
      type: 'text',
      description: 'Text for when the countdown has ended',
      default: '00:00:00',
      required: true,
    },{
      name: 'textcolor',
      type: 'color',
      description: 'Text Color',
      default: '#ffffff',
      required: true,
    },{
      name: 'textoutlinecolor',
      type: 'color',
      description: 'Text Outline Color',
      default: '#aaaaaa',
      required: true,
    },{
      name: 'textthickness',
      type: 'text',
      description: 'Text Thickness (1-9)',
      default: '4',
      required: true,
    },{
      name: 'font',
      type: 'text',
      description: 'Font Name',
      default: 'Inter',
      required: true,
    },{
      name: 'modcoms',
      type: 'toggle',
      description: 'Allow moderators to use chat commands',
      default: false,
    }]
  },
  CleanChat: {
    name: 'Clean Chat',
    type: 'clean-chat',
    image: 'sample-1.jpg',
    shortDescription: 'A cleanable chat',
    description: 'Chat integration with ability to filter users, command messages, replies and emote-only messages',
    category: Categories.Chat,
    url: 'clean-chat/clean-chat.html',
    version: '1.0.0',
    changelog: {
      '1.0.1': ['Added ping-pong mechanices'],
      '1.0.0': ['Initial release']
    },
    supports: [
      Supports.Kick,
    ],
    chatCommands: [],
    parameters: [{
      name: 'kickchannel',
      type: 'text',
      description: 'Kick Channel Name',
      default: '',
      required: true,
    },{
      name: 'scale',
      type: 'text',
      description: 'Scale',
      default: '1',
      required: true,
    },{
      name: 'ignorecommands',
      type: 'toggle',
      description: 'Ignore messages that start with !',
      default: false,
    },{
      name: 'ignorereplies',
      type: 'toggle',
      description: 'Ignore messages that are a reply to another message',
      default: false,
    },{
      name: 'emotemessageasempty',
      type: 'toggle',
      description: 'Ignore messages that or just emotes/emojis',
      default: false,
    },{
      name: 'bgopacity',
      type: 'range',
      description: 'Background opacity',
      default: 127,
      required: true,
    },{
      name: 'hostmessage',
      type: 'text',
      description: 'Text to show in chat when you get raided',
      default: '{raider} is hosting with {raiderCount} viewers!',
      required: true,
    },{
      name: 'subscribermessage',
      type: 'text',
      description: 'Text to show in chat when someone subscribes',
      default: '{chatter} has subscribed! They have been subscribed for a total of {monthCount} month.',
      required: true,
    },{
      name: 'giftmessage',
      type: 'text',
      description: 'Text to show in chat when someone gift subscribers',
      default: '{chatter} just gifted {giftCount} subscriptions to the community!',
      required: true,
    },{
      name: 'ignoreusers',
      type: 'text',
      description: 'Comma separated list of chatters to ignore',
      default: '',
    }]
  },
}