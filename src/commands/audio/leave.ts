import { Command } from '@sapphire/framework';
import { type Message } from 'discord.js';

export class LeaveCommand extends Command {
	constructor(context: Command.LoaderContext) {
		super(context, {
			aliases: ['disconnect', 'dc', 'leave'],
			description: 'Disconnects from the voice channel'
		});
	}

	public override async messageRun(message: Message) {
		const guild = message.guild;
		if (!guild) return;

		let player = this.container.lavalink.players.get(guild.id);

		if (!player) {
			const currentVoice = guild.voiceStates.cache.get(guild.members.me!.id)?.channel;

			if (!currentVoice) {
				return message.reply('> I am not connected to any voice channel');
			}

			player = this.container.lavalink.createPlayer({
				guildId: guild.id,
				voiceChannelId: currentVoice.id,
				textChannelId: message.channel.id,
				selfDeaf: true
			});
		}

		try {
			await player.disconnect();
			this.container.lavalink.players.delete(guild.id);

			return message.reply('> Disconnected from the voice channel');
		} catch (error) {
			this.container.logger.error(`Error disconnecting voice: ${(error as Error).message}`);

			return message.reply('> An error occurred while trying to disconnect');
		}
	}
}
