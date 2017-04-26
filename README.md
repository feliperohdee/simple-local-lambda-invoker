# Simple AWS Local Lambda Invoker

## Usage

		const {
			load,
			invoke
		} = require('smallorange-local-lambda-invoker');

		load({
			connect: '../connect-lambda/index.js'
		});

		invoke({
				FunctionName: 'myFunctionName',
				Payload: JSON.stringify({
					key: 'value'
				})
			}, (err, result) => console.log);
