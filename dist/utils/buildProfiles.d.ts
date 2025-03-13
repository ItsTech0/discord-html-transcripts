import { type Message } from 'discord.js';
import { ReactElement } from 'react';
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
export declare function buildProfiles(messages: Message[]): Promise<Record<string, Profile>>;
interface ExtendedMessage extends Message {
    profile?: Profile;
}
interface DiscordMessageProps {
    message: ExtendedMessage;
}
export declare function DiscordMessage({ message }: DiscordMessageProps): ReactElement;
export {};
