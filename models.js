export const ModelFactory = {
    Event: {
        ChatMessageEvent: ({chatroom_id = 0, content = '', created_at = '', id = '', metadata = null, sender = {}, type = 'message'}) => {
            return {
                chatroom_id,
                content,
                created_at,
                id,
                metadata,
                sender: ModelFactory.Sender(sender),
                type
            }
        },
        PinnedMessageCreatedEvent: ({duration = 20, message = {}}) => {
            return {
                duration,
                message: ModelFactory.Event.ChatMessageEvent(message),
            }
        }
    },
    Sender: ({ id = 0, identity = {}, slug = '', username = '' }) => {
        return {
            id,
            identity: ModelFactory.Identity(identity),
            slug,
            username
        }
    },
    Identity: ({ badges = [], color = ''}) => {
        return {
            badges: badges.map(badge => ModelFactory.Badge(badge)),
            color,
        }
    },
    Badge: ({ type = '', text = '', count = undefined}) => {
        return {
            type,
            text,
            count
        }
    }
};
export const Events = {
    ChatMessageEvent: 'App\\Events\\ChatMessageEvent',
    PinnedMessageCreatedEvent: 'App\\Events\\PinnedMessageCreatedEvent',
    PinnedMessageDeletedEvent: 'App\\Events\\PinnedMessageDeletedEvent',
}
