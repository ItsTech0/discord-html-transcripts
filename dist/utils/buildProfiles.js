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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    let highestDisplayedRole;
    if (member) {
        highestDisplayedRole = member.roles.cache
            .filter((role) => role.hoist)
            .sort((a, b) => b.position - a.position)
            .first();
    }
    console.log(`User: ${author.username}, Role: ${(_a = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.name) !== null && _a !== void 0 ? _a : 'None'}`);
    return {
        author: (_c = (_b = member === null || member === void 0 ? void 0 : member.nickname) !== null && _b !== void 0 ? _b : author.globalName) !== null && _c !== void 0 ? _c : author.username,
        avatar: (_d = member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 64 })) !== null && _d !== void 0 ? _d : author.displayAvatarURL({ size: 64 }),
        roleColor: highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.hexColor,
        roleIcon: (_e = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.iconURL()) !== null && _e !== void 0 ? _e : undefined,
        roleName: (_f = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.name) !== null && _f !== void 0 ? _f : undefined,
        bot: author.bot,
        verified: (_h = (_g = author.flags) === null || _g === void 0 ? void 0 : _g.has(discord_js_1.UserFlags.VerifiedBot)) !== null && _h !== void 0 ? _h : false,
        roleTag: (_j = highestDisplayedRole === null || highestDisplayedRole === void 0 ? void 0 : highestDisplayedRole.name) !== null && _j !== void 0 ? _j : '',
    };
}
function DiscordMessage({ message }) {
    var _a, _b, _c, _d, _e;
    console.log(`Rendering message from ${(_a = message.profile) === null || _a === void 0 ? void 0 : _a.author}, Role Tag: ${(_b = message.profile) === null || _b === void 0 ? void 0 : _b.roleTag}`);
    return react_1.default.createElement('div', { className: 'discord-message', style: { display: 'flex', alignItems: 'center' } }, react_1.default.createElement('div', { className: 'author', style: { display: 'flex', alignItems: 'center', gap: '6px' } }, ((_c = message.profile) === null || _c === void 0 ? void 0 : _c.roleTag)
        ? react_1.default.createElement('span', {
            className: 'role-badge',
            style: {
                backgroundColor: message.profile.roleColor || '#5865F2',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
            },
        }, message.profile.roleTag)
        : null, react_1.default.createElement('span', { className: 'username', style: { color: ((_d = message.profile) === null || _d === void 0 ? void 0 : _d.roleColor) || '#fff', fontWeight: 'bold' } }, (_e = message.profile) === null || _e === void 0 ? void 0 : _e.author)), react_1.default.createElement('div', { className: 'content', style: { marginLeft: '8px' } }, message.content));
}
//# sourceMappingURL=buildProfiles.js.map