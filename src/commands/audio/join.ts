import { Command } from '@sapphire/framework';
import { type GuildMember, type Message, type VoiceBasedChannel } from 'discord.js';

export class JoinCommand extends Command {
	constructor(context: Command.LoaderContext) {
		super(context, {
			aliases: ['join', 'connect'],
			description: 'Joins your voice channel'
		});
	}

	public async messageRun(message: Message) {
		const member = message.member as GuildMember | null;

		if (!member || !member.voice.channel) {
			return message.reply('> You must be in a voice channel to use this command');
		}

		const channel = member.voice.channel as VoiceBasedChannel;
		const guild = message.guild;
		const perms = channel.permissionsFor(guild!.members.me!);

		if (!perms?.has('Connect')) {
			return message.reply("> I don't have permission to connect to your voice channel");
		}

		if (!perms?.has('Speak')) {
			return message.reply("> I don't have permission to speak in your voice channel");
		}

		const currentVoice = guild!.voiceStates.cache.get(guild!.members.me!.id)?.channel;

		if (currentVoice && currentVoice.id === channel.id) {
			return message.reply('> I am already connected to your voice channel');
		}

		if (channel.type === 13) {
			return message.reply('> You must be in a standard voice channel to use this command');
		}

		try {
			const player = this.container.lavalink.createPlayer({
				guildId: guild!.id,
				voiceChannelId: channel.id,
				textChannelId: message.channel.id,
				selfDeaf: true
			});

			await player.connect();

			return message.reply(`> Joined **${channel.name}**`);
		} catch (error) {
			this.container.logger.error(`Error joining voice channel: ${(error as Error).message}`);

			return message.reply('> An error occurred while trying to join your voice channel');
		}
	}
}
