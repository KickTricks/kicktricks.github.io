export const ModelFactory = {
  Kick : {
    Event: {
      ChatMessageEvent: ({
        chatroom_id = 0,
        content = '',
        created_at = '',
        id = '',
        metadata = null,
        sender = {},
        type = 'message',
      }) => {
        return {
          chatroom_id,
          content,
          created_at,
          id,
          metadata,
          sender: ModelFactory.Kick.Sender(sender),
          type,
        }
      },
      PinnedMessageCreatedEvent: ({ duration = 20, message = {} }) => {
        return {
          duration,
          message: ModelFactory.Kick.Event.ChatMessageEvent(message),
        }
      },
      SubscriptionEvent: ({ chatroom_id = 0, username = '', months = 0 }) => {
        return {
          chatroom_id,
          username,
          months,
        }
      },
      GiftedSubscriptionsEvent: ({
        chatroom_id = 0,
        gifted_usernames = [],
        gifter_username = '',
      }) => {
        return {
          chatroom_id,
          gifted_usernames,
          gifter_username,
        }
      },
      MessageDeletedEvent: ({ id = '', message = {} }) => {
        return {
          id,
          message: {
            id: message.id,
          },
        }
      },
      UserBannedEvent: ({ banned_by = {}, expires_at = new Date(), id = '', user = {} }) => {
        return {
          banned_by: ModelFactory.Kick.User(banned_by),
          expires_at,
          id,
          user: ModelFactory.Kick.User(user),
        }
      },
      StreamHostEvent: ({
        chatroom_id = 0,
        host_username = '',
        number_viewers = 0,
        optional_message = '',
      }) => {
        return {
          chatroom_id,
          host_username,
          number_viewers,
          optional_message,
        }
      },
    },
    Sender: ({ id = 0, identity = {}, slug = '', username = '' }) => {
      return {
        id,
        identity: ModelFactory.Kick.Identity(identity),
        slug,
        username,
      }
    },
    Identity: ({ badges = [], color = '' }) => {
      return {
        badges: badges.map((badge) => ModelFactory.Kick.Badge(badge)),
        color,
      }
    },
    Badge: ({ type = '', text = '', count = undefined }) => {
      return {
        type,
        text,
        count,
      }
    },
    User: ({ id = 0, username = '', slug = '' }) => {
      return {
        id,
        username,
        slug,
      }
    },
  }
}

export const Events = {
  Kick: {
    ChatMessageEvent: 'App\\Events\\ChatMessageEvent',
    MessageDeletedEvent: 'App\\Events\\MessageDeletedEvent',
    PinnedMessageCreatedEvent: 'App\\Events\\PinnedMessageCreatedEvent',
    PinnedMessageDeletedEvent: 'App\\Events\\PinnedMessageDeletedEvent',
    UserBannedEvent: 'App\\Events\\UserBannedEvent',
    SubscriptionEvent: 'App\\Events\\SubscriptionEvent',
    GiftedSubscriptionsEvent: 'App\\Events\\GiftedSubscriptionsEvent',
    StreamHostEvent: 'App\\Events\\StreamHostEvent',
    ChatroomClearEvent: 'App\\Events\\ChatroomClearEvent',
  }
}

export const UserTypes = {
  Kick: {
    Broadcaster: 'broadcaster',
    Moderator: 'moderator'
  }
}