"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProfiles = buildProfiles;
const discord_js_1 = require("discord.js");
// Builds user profiles from messages
async function buildProfiles(messages) {
    const profiles = {};
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
            profiles[message.thread.lastMessage.author.id] = buildProfile(message.thread.lastMessage.member, message.thread.lastMessage.author);
        }
    }
    return profiles;
}
// Creates a profile for a user, including role badge if applicable
function buildProfile(member, author) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    let highestDisplayedRole;
    // If member exists, extract the highest displayed role
    if (member) {
        highestDisplayedRole = member.roles.cache
            .filter(role => role.hoist) // Only select displayed roles
            .sort((a, b) => b.position - a.position) // Get the highest role
            .first();
    }
    return {
        author: highestDisplayedRole
            ? `<span style="background-color:${highestDisplayedRole.hexColor}; color:#fff; padding:2px 6px; border-radius:4px; font-size:12px;">${highestDisplayedRole.name}</span> ${(_b = (_a = member === null || member === void 0 ? void 0 : member.nickname) !== null && _a !== void 0 ? _a : author.displayName) !== null && _b !== void 0 ? _b : author.username}`
            : (_d = (_c = member === null || member === void 0 ? void 0 : member.nickname) !== null && _c !== void 0 ? _c : author.displayName) !== null && _d !== void 0 ? _d : author.username,
        avatar: (_e = member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 64 })) !== null && _e !== void 0 ? _e : author.displayAvatarURL({ size: 64 }),
        roleColor: (_f = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.hexColor) !== null && _f !== void 0 ? _f : undefined,
        roleIcon: (_g = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.iconURL()) !== null && _g !== void 0 ? _g : undefined,
        roleName: (_h = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.name) !== null && _h !== void 0 ? _h : undefined,
        bot: author.bot,
        verified: (_j = author.flags) === null || _j === void 0 ? void 0 : _j.has(discord_js_1.UserFlags.VerifiedBot),
    };
}
//# sourceMappingURL=buildProfiles.js.map