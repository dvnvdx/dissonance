import { Args, Command } from '@sapphire/framework';
import { type GuildMember, type Message } from 'discord.js';

export class PlayCommand extends Command {
	constructor(context: Command.LoaderContext) {
		super(context, {
			aliases: ['p'],
			name: 'play',
			description: 'Play a song or playlist'
		});
	}

	public override async messageRun(message: Message, args: Args) {
		const member = message.member as GuildMember | null;
		if (!member || !member.voice.channel) {
			return await message.reply('> You must be in a voice channel to use this command');
		}

		const query = (await args.rest('string')).toString();
		if (!query) {
			return await message.reply('> Please provide something to play.\n> **Example:** `!play never gonna give you up`');
		}

		const channel = member.voice.channel;
		const guild = message.guild!;
		const perms = channel.permissionsFor(guild.members.me!);

		if (!perms?.has('Connect')) {
			return await message.reply("> I don't have permission to connect to your voice channel");
		}

		if (!perms?.has('Speak')) {
			return await message.reply("> I don't have permission to speak in your voice channel");
		}

		let player = this.container.lavalink.players.get(guild.id);

		if (!player) {
			player = this.container.lavalink.createPlayer({
				guildId: guild.id,
				voiceChannelId: channel.id,
				textChannelId: message.channel.id,
				selfDeaf: true
			});
		}

		if (!player.connected) await player.connect();

		if (player.voiceChannelId !== channel.id) {
			return await message.reply('> You must be in the same voice channel as the bot to play music');
		}

		const search = await player.search({ query: `ytsearch:${query}`, source: 'yt' }, message.author);

		console.log(search);
		if (!search || !search.tracks.length) {
			return await message.reply('> No results found for that search');
		}

		if (search.loadType === 'playlist') {
			player.queue.add(search.tracks);
			await message.reply(`> ✅ Added **${search.tracks.length} tracks** from playlist: **${search.playlist!.title}**`);
		} else {
			const track = search.tracks[0];
			player.queue.add(track!);
			await message.reply(`> ✅ Added: **${track!.info.title}**`);
		}

		if (!player.playing && !player.paused) {
			await player.play();
		}
	}
}
