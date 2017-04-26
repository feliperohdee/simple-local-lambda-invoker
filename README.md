# Simple AWS Local Lambda Invoker

## Usage
		const path = require('path');
		const {
			load,
			invoke
		} = require('smallorange-local-lambda-invoker');

		load({
			connect: path.resolve('../my-function-path')
		});

		invoke({
				FunctionName: 'myFunctionName',
				Payload: JSON.stringify({
					key: 'value'
				})
			}, (err, result) => console.log);
