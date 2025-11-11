import { Listener } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import type { LavalinkNode } from 'lavalink-client';

export class NodeErrorListener extends Listener {
	constructor(context: Listener.LoaderContext) {
		super(context, {
			event: 'error',
			name: 'lavalinkNodeErrorListener',
			emitter: container.lavalink.nodeManager
		});
	}

	run(node: LavalinkNode, error: Error) {
		this.container.logger.error(`"${node.id}" encountered an error: ${error.message}`);
	}
}
