export const ModelFactory = {
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
        sender: ModelFactory.Sender(sender),
        type,
      }
    },
    PinnedMessageCreatedEvent: ({ duration = 20, message = {} }) => {
      return {
        duration,
        message: ModelFactory.Event.ChatMessageEvent(message),
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
        meessage: {
          id: message.id,
        },
      }
    },
    UserBannedEvent: ({ banned_by = {}, id = '', user = {} }) => {
      return {
        banned_by: ModelFactory.User(banned_by),
        id,
        user: ModelFactory.User(user),
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
      identity: ModelFactory.Identity(identity),
      slug,
      username,
    }
  },
  Identity: ({ badges = [], color = '' }) => {
    return {
      badges: badges.map((badge) => ModelFactory.Badge(badge)),
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

export const Events = {
  ChatMessageEvent: 'App\\Events\\ChatMessageEvent',
  MessageDeletedEvent: 'App\\Events\\MessageDeletedEvent',
  PinnedMessageCreatedEvent: 'App\\Events\\PinnedMessageCreatedEvent',
  PinnedMessageDeletedEvent: 'App\\Events\\PinnedMessageDeletedEvent',
  UserBannedEvent: 'App\\Events\\UserBannedEvent',
  SubscriptionEvent: 'App\\Events\\SubscriptionEvent',
  GiftedSubscriptionsEvent: 'App\\Events\\GiftedSubscriptionsEvent',
  StreamHostEvent: 'App\\Events\\StreamHostEvent',
}

export const UserTypes = {
  broadcaster: 'broadcaster',
  moderator: 'moderator'
}