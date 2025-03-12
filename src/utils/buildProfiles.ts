import { type GuildMember, type Message, type User, UserFlags, type Role } from 'discord.js';

export type Profile = {
  author: string; // Author name with role badge (if applicable)
  avatar?: string; // Author's avatar URL
  roleColor?: string; // Color of the highest displayed role
  roleIcon?: string; // Icon of the highest displayed role (if available)
  roleName?: string; // Name of the highest displayed role

  bot?: boolean; // Whether the user is a bot
  verified?: boolean; // Whether the user is a verified bot
};

// Builds user profiles from messages
export async function buildProfiles(messages: Message[]): Promise<Record<string, Profile>> {
  const profiles: Record<string, Profile> = {};

  for (const message of messages) {
    const author = message.author;
    
    // Ensure the author has a profile
    if (!profiles[author.id]) {
      profiles[author.id] = buildProfile(message.member, author);
    }

    // If the message was from an interaction, process the interaction user
    if (message.interaction) {
      const user = message.interaction.user;
      if (!profiles[user.id]) {
        profiles[user.id] = buildProfile(null, user);
      }
    }

    // If the message was part of a thread, process the thread's last message author
    if (message.thread && message.thread.lastMessage) {
      profiles[message.thread.lastMessage.author.id] = buildProfile(
        message.thread.lastMessage.member,
        message.thread.lastMessage.author
      );
    }
  }

  return profiles;
}

// Creates a profile for a user, including role badge if applicable
function buildProfile(member: GuildMember | null, author: User): Profile {
  let highestDisplayedRole: Role | undefined;

  // If member exists, extract the highest displayed role
  if (member) {
    highestDisplayedRole = member.roles.cache
      .filter(role => role.hoist) // Only select displayed roles
      .sort((a, b) => b.position - a.position) // Get the highest role
      .first();
  }

  return {
    author: highestDisplayedRole
      ? `<span style="background-color:${highestDisplayedRole.hexColor}; color:#fff; padding:2px 6px; border-radius:4px; font-size:12px;">${highestDisplayedRole.name}</span> ${member?.nickname ?? author.displayName ?? author.username}`
      : member?.nickname ?? author.displayName ?? author.username,
    avatar: member?.displayAvatarURL({ size: 64 }) ?? author.displayAvatarURL({ size: 64 }),
    roleColor: highestDisplayedRole?.hexColor ?? undefined,
    roleIcon: highestDisplayedRole?.iconURL() ?? undefined,
    roleName: highestDisplayedRole?.name ?? undefined,
    bot: author.bot,
    verified: author.flags?.has(UserFlags.VerifiedBot),
  };
}
