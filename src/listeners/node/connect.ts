import { Listener } from '@sapphire/framework';
import { container } from '@sapphire/pieces';

export class NodeConnectListener extends Listener {
	constructor(context: Listener.LoaderContext) {
		super(context, {
			once: true,
			event: 'connect',
			name: 'lavalinkNodeConnectListener',
			emitter: container.lavalink.nodeManager
		});
	}

	run() {
		this.container.logger.info('Connected to Lavalink');
	}
}
