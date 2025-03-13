import { type GuildMember, type Message, type User, UserFlags, Role } from 'discord.js';

export type Profile = {
  author: string; // Author of the message
  avatar?: string; // Avatar of the author
  roleColor?: string; // Role color of the author
  roleIcon?: string; // Role icon of the author
  roleName?: string; // Role name of the author
  roleTag?: string; // Role tag for display before the username
  bot?: boolean; // Whether the author is a bot
  verified?: boolean; // Whether the author is verified
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

    if (message.thread && message.thread.lastMessage) {
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
      .filter(role => role.hoist) // Only select roles that are "displayed separately"
      .sort((a, b) => b.position - a.position) // Sort by highest position
      .first();
  }

  return {
    author: member?.nickname ?? author.displayName ?? author.username,
    avatar: member?.displayAvatarURL({ size: 64 }) ?? author.displayAvatarURL({ size: 64 }),
    roleColor: highestDisplayedRole?.hexColor,
    roleIcon: highestDisplayedRole?.iconURL() ?? undefined,
    roleName: highestDisplayedRole?.name ?? undefined,
    bot: author.bot,
    verified: author.flags?.has(UserFlags.VerifiedBot),
    roleTag: highestDisplayedRole
      ? `<span style="background-color:${highestDisplayedRole.hexColor}; color:white; padding:3px 6px; border-radius:4px; font-size:12px;">${highestDisplayedRole.name}</span>`
      : ''
  };
}