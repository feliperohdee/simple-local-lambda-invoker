const stackParser = require('error-stack-parser');
const lambdas = {};

exports.load = files => {
	for (name in files) {
		const file = files[name];

		if (!file) {
			return;
		}

		lambdas[name] = require(file);
	}
}

exports.invoke = (params, callback) => {
	let {
		FunctionName,
		Payload = {}
	} = params;

	if (!callback) {
		return;
	}

	if (!lambdas[FunctionName]) {
		return callback(new Error(`Function '${FunctionName}' doesn't exists.`));
	}

	if (typeof Payload === 'string') {
		Payload = JSON.parse(Payload);
	}

	lambdas[FunctionName].handler(Payload, {}, (err, data) => {
		if (err) {
			return callback(null, {
				StatusCode: 200,
				FunctionError: 'Handled',
				Payload: JSON.stringify({
					errorMessage: err.message,
					errorType: 'Error',
					stackTrace: stackParser.parse(err)
				})
			});
		}

		callback(null, {
			StatusCode: 200,
			Payload: JSON.stringify(data)
		});
	});
}
