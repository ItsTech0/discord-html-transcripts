import { type GuildMember, type Message, type User, UserFlags, Role } from 'discord.js';
import React, { ReactElement } from 'react';

export type Profile = {
  author: string;
  avatar?: string;
  roleColor?: string;
  roleIcon?: string;
  roleName?: string;
  roleTag?: string;
  bot?: boolean;
  verified?: boolean;
};

export async function buildProfiles(messages: Message[]) {
  const profiles: Record<string, Profile> = {};

  for (const message of messages) {
    const author = message.author;
    if (!profiles[author.id]) {
      profiles[author.id] = buildProfile(message.member, author);
    }

    if (message.interaction) {
      const user = message.interaction.user;
      if (!profiles[user.id]) {
        profiles[user.id] = buildProfile(null, user);
      }
    }

    if (message.thread?.lastMessage) {
      profiles[message.thread.lastMessage.author.id] = buildProfile(
        message.thread.lastMessage.member,
        message.thread.lastMessage.author
      );
    }
  }

  return profiles;
}

function buildProfile(member: GuildMember | null, author: User): Profile {
  let highestDisplayedRole: Role | undefined;

  if (member) {
    highestDisplayedRole = member.roles.cache
      .filter((role) => role.hoist)
      .sort((a, b) => b.position - a.position)
      .first();
  }

  return {
    author: member?.nickname ?? author.globalName ?? author.username,
    avatar: member?.displayAvatarURL({ size: 64 }) ?? author.displayAvatarURL({ size: 64 }),
    roleColor: highestDisplayedRole?.hexColor,
    roleIcon: highestDisplayedRole?.iconURL() ?? undefined,
    roleName: highestDisplayedRole?.name ?? undefined,
    bot: author.bot,
    verified: author.flags?.has(UserFlags.VerifiedBot) ?? false,
    roleTag: highestDisplayedRole?.name ?? '',
  };
}

interface ExtendedMessage extends Message {
  profile?: Profile;
}

interface DiscordMessageProps {
  message: ExtendedMessage;
}

export function DiscordMessage({ message }: DiscordMessageProps): ReactElement {
  return React.createElement(
    'div',
    { className: 'discord-message', style: { display: 'flex', alignItems: 'center' } },
    message.profile?.roleTag
      ? React.createElement(
          'span',
          {
            className: 'role-badge',
            style: {
              backgroundColor: message.profile.roleColor || 'transparent',
              color: 'white',
              padding: '3px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              marginRight: '8px',
            },
          },
          message.profile.roleTag
        )
      : null,
    React.createElement('span', { className: 'author' }, message.profile?.author),
    React.createElement('div', { className: 'content', style: { marginLeft: '8px' } }, message.content)
  );
}
