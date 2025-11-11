import { Listener } from '@sapphire/framework';

export class ClientReadyListener extends Listener {
	constructor(context: Listener.LoaderContext) {
		super(context, {
			once: true,
			event: 'clientReady',
			name: 'clientReadyListener'
		});
	}
	public run() {
		this.container.logger.info('Bot is online and ready!');
		this.container.lavalink.init({ ...this.container.client.user! });
	}
}
