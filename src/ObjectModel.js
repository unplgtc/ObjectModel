const enumerate = require('./utilities').enumerate,
      errors = require('./errors'),
      schemaService = require('./services/schemaService'),
      validationService = require('./services/validationService');

const ObjectModel = {
    get SCHEMA() {
    	return enumerate(schemaService.schemas)
    },

    ERRORS: errors,

    buildValidator: validationService.buildValidator
}

Object.setPrototypeOf(ObjectModel, schemaService);
module.exports = ObjectModel;
