import { type GuildMember, type Message, type User, UserFlags, type Role } from 'discord.js';

export type Profile = {
  author: string; // author of the message
  avatar?: string; // avatar of the author
  roleColor?: string; // role color of the author
  roleIcon?: string; // role icon of the author
  roleName?: string; // role name of the author

  bot?: boolean; // is the author a bot
  verified?: boolean; // is the author verified
};

export async function buildProfiles(messages: Message[]) {
  const profiles: Record<string, Profile> = {};

  // loop through messages
  for (const message of messages) {
    // add all users
    const author = message.author;
      // add profile
    if (!profiles[author.id]) {
      profiles[author.id] = buildProfile(message.member, author);
    }

    // add interaction users
    if (message.interaction) {
      const user = message.interaction.user;
      if (!profiles[user.id]) {
        profiles[user.id] = buildProfile(null, user);
      }
    }

    // threads
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
      .filter(role => role.hoist) // Select only roles that are "displayed"
      .sort((a, b) => b.position - a.position) // Get the highest role
      .first();
  }

  return {
    author: highestDisplayedRole
      ? `<span style="background-color:${highestDisplayedRole.hexColor}; color:#fff; padding:2px 6px; border-radius:4px; font-size:12px;">${highestDisplayedRole.name}</span> ${member?.nickname ?? author.displayName ?? author.username}`
      : member?.nickname ?? author.displayName ?? author.username,
    avatar: member?.displayAvatarURL({ size: 64 }) ?? author.displayAvatarURL({ size: 64 }),
    roleColor: highestDisplayedRole?.hexColor,
    roleIcon: highestDisplayedRole?.iconURL() ?? undefined,
    roleName: highestDisplayedRole?.name ?? undefined,
    bot: author.bot,
    verified: author.flags?.has(UserFlags.VerifiedBot),
  };
}