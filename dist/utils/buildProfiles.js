"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProfiles = buildProfiles;
exports.DiscordMessage = DiscordMessage;
const discord_js_1 = require("discord.js");
const react_1 = __importDefault(require("react"));
async function buildProfiles(messages) {
    var _a;
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
        if ((_a = message.thread) === null || _a === void 0 ? void 0 : _a.lastMessage) {
            profiles[message.thread.lastMessage.author.id] = buildProfile(message.thread.lastMessage.member, message.thread.lastMessage.author);
        }
    }
    return profiles;
}
function buildProfile(member, author) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let highestDisplayedRole;
    if (member) {
        highestDisplayedRole = member.roles.cache
            .filter((role) => role.hoist)
            .sort((a, b) => b.position - a.position)
            .first();
    }
    return {
        author: (_b = (_a = member === null || member === void 0 ? void 0 : member.nickname) !== null && _a !== void 0 ? _a : author.globalName) !== null && _b !== void 0 ? _b : author.username,
        avatar: (_c = member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 64 })) !== null && _c !== void 0 ? _c : author.displayAvatarURL({ size: 64 }),
        roleColor: highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.hexColor,
        roleIcon: (_d = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.iconURL()) !== null && _d !== void 0 ? _d : undefined,
        roleName: (_e = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.name) !== null && _e !== void 0 ? _e : undefined,
        bot: author.bot,
        verified: (_g = (_f = author.flags) === null || _f === void 0 ? void 0 : _f.has(discord_js_1.UserFlags.VerifiedBot)) !== null && _g !== void 0 ? _g : false,
        roleTag: (_h = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.name) !== null && _h !== void 0 ? _h : '',
    };
}
function DiscordMessage({ message }) {
    var _a, _b;
    return react_1.default.createElement('div', { className: 'discord-message' }, ((_a = message.profile) === null || _a === void 0 ? void 0 : _a.roleTag)
        ? react_1.default.createElement('span', {
            className: 'role-badge',
            style: {
                backgroundColor: message.profile.roleColor || 'transparent',
                color: 'white',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: '12px',
            },
        }, message.profile.roleTag)
        : null, react_1.default.createElement('span', { className: 'author' }, (_b = message.profile) === null || _b === void 0 ? void 0 : _b.author), react_1.default.createElement('div', { className: 'content' }, message.content));
}
//# sourceMappingURL=buildProfiles.js.map