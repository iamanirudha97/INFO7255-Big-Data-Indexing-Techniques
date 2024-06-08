const { jsonSchema } = require('./jsonSchema');

var Validator = require('jsonschema').Validator;
var v = new Validator();

const validateJsonSchema = (inputPayload) => {
    const result = v.validate(inputPayload, jsonSchema)
    const isSchemaValid = result.valid
    return isSchemaValid
}

module.exports = {
    validateJsonSchema
}