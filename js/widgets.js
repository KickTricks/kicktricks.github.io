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
      group: 'channel'
    },{
      name: 'scale',
      type: 'text',
      description: 'Scale',
      default: '1',
      required: true,
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
    version: '1.0.0',
    changelog: {
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
    version: '1.0.0',
    changelog: {
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
      {
        command: '!kt/subathon-set-start-time',
        example: '!kt/subathon-set-start-time 1:30',
        description: 'Sets the timer to 1 hour and 30 minutes',
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
}