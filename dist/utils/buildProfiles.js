"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProfiles = buildProfiles;
const discord_js_1 = require("discord.js");
async function buildProfiles(messages) {
    const profiles = {};
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
            profiles[message.thread.lastMessage.author.id] = buildProfile(message.thread.lastMessage.member, message.thread.lastMessage.author);
        }
    }
    return profiles;
}
function buildProfile(member, author) {
    var _a, _b, _c, _d, _e, _f;
    let highestDisplayedRole;
    if (member) {
        highestDisplayedRole = member.roles.cache
            .filter(role => role.hoist) // Only select roles that are "displayed separately"
            .sort((a, b) => b.position - a.position) // Sort by highest position
            .first();
    }
    return {
        author: (_b = (_a = member === null || member === void 0 ? void 0 : member.nickname) !== null && _a !== void 0 ? _a : author.displayName) !== null && _b !== void 0 ? _b : author.username,
        avatar: (_c = member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 64 })) !== null && _c !== void 0 ? _c : author.displayAvatarURL({ size: 64 }),
        roleColor: highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.hexColor,
        roleIcon: (_d = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.iconURL()) !== null && _d !== void 0 ? _d : undefined,
        roleName: (_e = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.name) !== null && _e !== void 0 ? _e : undefined,
        bot: author.bot,
        verified: (_f = author.flags) === null || _f === void 0 ? void 0 : _f.has(discord_js_1.UserFlags.VerifiedBot),
        roleTag: highestDisplayedRole
            ? `<span style="background-color:${highestDisplayedRole.hexColor}; color:white; padding:3px 6px; border-radius:4px; font-size:12px;">${highestDisplayedRole.name}</span>`
            : ''
    };
}
//# sourceMappingURL=buildProfiles.js.map