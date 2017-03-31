const express = require('express');
const router = express.Router();
const jsonschema = require('jsonschema');
const util = require('util');

const config = require('../config');
const httpcode = require('../http-code');
const code = require('../code/code');
const Code = code.Code;
const NodeModule = require('../code/nodeModule').NodeModule;
const logger = require('../logger').logger;

router.post('/code', runCode);

const schema = {
    type: 'object',
    required: ['code', 'context', 'language'],
    properties: {
        code: {
            type: 'string'
        },
        context: {
            type: 'object'
        },
        modules: {
            type: 'array'
        },
        language: {
            enum: config.languages
                .map((language) => { return language.name; })
        }
    }
};

function runCode(request, response) {
    const validatorResult = jsonschema.validate(request.body, schema);
    if (validatorResult.errors.length > 0) {
        let message = validatorResult.errors.map((error) => {
            return error.stack;
        });

        return response.status(httpcode.BAD_REQUEST).json({
            name: 'ValidationError',
            message: message, stack: null
        });
    }

    const language = config.languages.find((supportedLanguage) => {
        return supportedLanguage.name === request.body.language;
    });

    if (!language.enabled) {
        return response.status(httpcode.BAD_REQUEST).json({
            name: 'LanguageError',
            message: `${request.body.name} is not enabled`,
            stack: null
        });
    }

    const modulesToImport = request.body.modules
        .map((moduleName) => {
            if (config.MODULES.has(moduleName)) {
                return new NodeModule(
                    config.MODULES.get(moduleName).path,
                    config.MODULES.get(moduleName).alias
                );
            }
        })
        .filter((module) => {
            return !Object.is(module, undefined);
        });

    try {
        const code = new Code(
            request.body.code,
            request.body.language,
            request.body.context,
            modulesToImport
        );

        const context = code.run(
            language.transpilerOptions,
            config.VM_SCRIPT_OPTIONS,
            config.VM_RUN_IN_CONTEXT_OPTIONS
        );

        logger.info(({code: code, context: context}));
        return response.json({context: context});
    } catch (error) {
        return response.status(httpcode.BAD_REQUEST).json({
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
}

exports.router = router;