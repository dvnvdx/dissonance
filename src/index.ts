import { SapphireClient } from '@sapphire/framework';
import { LavalinkManager } from 'lavalink-client';
import { container } from '@sapphire/pieces';
import { Partials } from 'discord.js';
import mongoose from 'mongoose';

const bot = new SapphireClient({
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultPrefix: 'd?',
	loadMessageCommandListeners: true,
	loadApplicationCommandRegistriesStatusListeners: false,
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: false
	},
	intents: ['GuildMembers', 'GuildMessageReactions', 'GuildMessages', 'GuildVoiceStates', 'GuildWebhooks', 'Guilds', 'MessageContent'],
	partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction]
});

mongoose.connect(Bun.env.MONGODB_URI!);

container.lavalink = new LavalinkManager({
	nodes: [
		{
			authorization: Bun.env.LAVALINK_PASSWORD!,
			host: Bun.env.LAVALINK_ADDRESS!,
			secure: true,
			port: 443,
			id: 'Dissonance Node'
		}
	],
	sendToShard: (guildId, payload) => {
		const guild = bot.guilds.cache.get(guildId);
		if (guild) guild.shard.send(payload);
	},
	client: {
		id: Bun.env.CLIENT_ID!,
		username: 'Dissonance'
	},
	autoSkip: true
});

bot.login(Bun.env.DISCORD_TOKEN);

declare module '@sapphire/pieces' {
	interface Container {
		lavalink: LavalinkManager;
	}
}
