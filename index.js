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

	lambdas[FunctionName].handler(Payload, null, (err, data) => {
		if (err) {
			return callback({
				errorMessage: err.message,
				errorType: 'Error',
				stackTrace: JSON.stringify(err.stack)
					.replace(/\"/g, '')
					.replace(/\t/g, '')
					.replace(/\s{2,}/g, '')
					.replace(/at\s/g, '')
					.replace(/\\n/g, '\n')
					.split('\n')
					.slice(1)
			});
		}

		callback(null, {
			StatusCode: 200,
			Payload: JSON.stringify(data)
		});
	});
}
