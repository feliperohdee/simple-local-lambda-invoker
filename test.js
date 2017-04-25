const {
	load,
	invoke
} = require('./');

load({
	connect: '../connect-lambda/index.js'
});

invoke({
		FunctionName: 'connect',
		Payload: JSON.stringify({
			body: {
				requestString: '{users {items {id name}}}',
				auth: {
					agent: 'agent-0',
					namespace: 'spec',
					role: 'agent'
				}
			}
		})
	}, (err, result) => console.log);
