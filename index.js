const _ = require('lodash');
const stackParser = require('error-stack-parser');

const functions = {};
const load = files => {
    _.forEach(files, (file, name) => {
        if (!file) {
            return;
        }

        functions[name] = require(file);
    });
};

const invoke = (params, callback) => {
    const promise = new Promise((resolve, reject) => {
        let {
            FunctionName,
            InvocationType,
            Payload = {}
        } = params;

        if (!functions[FunctionName]) {
            return reject(new Error(`Function '${FunctionName}' doesn't exists.`));
        }

        if (typeof Payload === 'string') {
            Payload = JSON.parse(Payload);
        }

        const formatAndResolve = (err, data) => {
            if (err && !_.isError(err)) {
                err = new Error(err);
            }

            return resolve(err ? {
                StatusCode: 200,
                FunctionError: 'Handled',
                Payload: JSON.stringify({
                    errorType: 'Error',
                    errorMessage: err.message,
                    trace: stackParser.parse(err)
                })
            } : (data ? {
                StatusCode: 200,
                ExecutedVersion: '$LATEST',
                Payload: _.isString(data) ? data : JSON.stringify(data)
            } : {
                StatusCode: 200
            }));
        };

        if(InvocationType === 'Event') {
            setTimeout(formatAndResolve);
        }

        const lambdaResult = functions[FunctionName].handler(Payload, {}, formatAndResolve);

        // handle promisified lambda
        if (lambdaResult && lambdaResult.then) {
            lambdaResult.then(data => {
                    formatAndResolve(null, data);
                })
                .catch(err => {
                    formatAndResolve(err);
                });
        }
    });

    if (callback) {
        promise.then(data => {
                callback(null, data);
            })
            .catch(err => {
                callback(err);
            });
    }

    return {
        promise: () => promise
    };
};

module.exports = {
	functions,
    load,
    invoke
};