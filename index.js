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

	lambdas[FunctionName].handler(Payload, null, callback);
}
