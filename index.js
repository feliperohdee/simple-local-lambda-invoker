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
		throw new Error('callback is missing.');
	}

	if (!lambdas[FunctionName]) {
		throw new Error(`Function '${FunctionName}' doesn't exists.`);
	}

	if (typeof Payload === 'string') {
		Payload = JSON.parse(Payload);
	}

	lambdas[FunctionName].handler(Payload, null, (err, data) => {
		if (err) {
			return callback({
				StatusCode: 200,
				FunctionError: 'Handled',
				Payload: JSON.stringify({
					errorMessage: err.message
				})
			});
		}

		callback(null, {
			StatusCode: 200,
			Payload: JSON.stringify(data)
		});
	});
}
