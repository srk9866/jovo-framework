import { FileDb } from 'jovo-db-filedb';
import { App } from 'jovo-framework';
import { CorePlatform } from 'jovo-platform-core';

import { JovoDebugger } from 'jovo-plugin-debugger';
import { AmazonCredentials, LexSlu } from 'jovo-slu-lex';
import { PollyTts } from 'jovo-tts-polly';

const app = new App();

const corePlatform = new CorePlatform();
const credentials: AmazonCredentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	secretAccessKey: process.env.AWS_SECRET_KEY!,
	region: process.env.AWS_REGION!
};

corePlatform.use(
	new LexSlu({
		credentials,
		botAlias: 'WebTest',
		botName: 'WebAssistantTest'
	})
	// new PollyTts({
	// 	credentials
	// })
);

app.use(corePlatform, new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.$corePlatformApp!.$actions.addQuickReplies({
			delay: 2000,
			replies: ['John', 'Jack', 'Joe']
		});
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
	DefaultFallbackIntent() {
		this.tell('Good Bye!');
	}
});

export { app };
