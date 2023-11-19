import { ModelFactory, Events } from './models.js'
import { Badges } from './badges.js';
import { Emotes } from './emotes.js';
import { WSConn } from './ws.js';
import { APIEndpoints } from './api-endpoints.js';

const channelName = new URLSearchParams(window.location.search).get('channel');
const scale = new URLSearchParams(window.location.search).get('scale');
const pinnedMessageContainer = document.querySelector('.pinned-message');

if(scale > 0) {
    document.querySelector('html').style.fontSize = `${14 * scale}px`;
}

APIEndpoints.getChannelData({ channelName }).then(data => {
    const chatroomId = data.chatroom.id;
    const subscriberBadges = data.subscriber_badges;
    let pinnedMessagePendingDeletionTimeout;

    const connection = WSConn.connect();
    connection.onopen = () => {
        connection.send(WSConn.connectChatroom({ chatroomId }));
    }
    connection.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        if(data.event === Events.PinnedMessageCreatedEvent) {
            const { duration, message } = ModelFactory.Event.PinnedMessageCreatedEvent(JSON.parse(data.data));
            const content = Emotes.parse(message.content);
            pinnedMessageContainer.innerHTML = `
            <p><span class="badges">${message.sender.identity.badges.map((badge) => Badges.getBadge(subscriberBadges, badge.type, badge.count)).join('')}</span> <span class="bold"><span style="color: ${message.sender.identity.color}">${message.sender.username}</span>:</span><span class="message"> ${content}</span></p>
            `;
            pinnedMessageContainer.classList.remove('hidden');
            window.clearTimeout(pinnedMessagePendingDeletionTimeout);
            pinnedMessagePendingDeletionTimeout = window.setTimeout(() => {
                pinnedMessageContainer.classList.add('hidden');
            }, duration * 60000);
        }
        else if(data.event === Events.PinnedMessageDeletedEvent) {
            window.clearTimeout(pinnedMessagePendingDeletionTimeout);
            pinnedMessageContainer.classList.add('hidden');
        }
    }
});
