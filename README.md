# Object Model

*Fluent AJV object model validator for Node applications*

---

## Usage

```js
const ObjectModel = require('@unplgtc/object-model'),
      SCHEMA = ObjectModel.SCHEMA,
      UserSchema = require('./path/to/schema/UserSchema')
      userService = require('./path/to/userService');

ObjectModel.addSchema(UserSchema.key, UserSchema);

const user = await userService.get('<user_identifier>');

ObjectModel
    .schema(SCHEMA.USER)
    .v1()
    .validate(user)
```

## Adding new Schemata

- Create a new JS file for your schema (Example: `UserSchema.js` for a 'User' schema)
- In your schema file:
    - Export an object with a `key` property that you'd like to be the schema's unique identifier (Example: `key: 'USER'`)
    - Include a function on the object named `v1()` (assuming this is the first version) which returns a call to `ObjectModel.buildValidator()`
    - Pass your JSON schema to the `buildValidator()` function
- Call `ObjectModel.addSchema(schema.key, schema)` to register your new schema into the ObjectModel instance
- That's it! You can now validate against your newly added schema

Example schema file for a `User` schema:

```js
const ObjectModel = require('@unplgtc/object-model');

const UserSchema = {
    key: 'USER',

    v1() {
        return ObjectModel.buildValidator(
            {
                title: 'User',
                version: '1',
                description: 'User Schema',
                type: 'object',
                properties: {
                    uid: {
                        description: 'Unique identifier for this user',
                        type: 'string'
                    },
                    username: {
                        description: 'Username for this user',
                        type: 'string'
                    },
                    email: {
                        description: 'Email for this user',
                        type: 'string'
                    }
                },
                required: [ 'uid', 'username', 'displayName', 'email' ]
            }
        );
    }
}

module.exports = UserSchema;
```

## Upgrading Schemata

If you make changes to a domain object then its schema needs to be updated, but making that update at the same time across all of your code bases isn't always feasible. ObjectModel allows you to add a new version function to your schema file, then you can selectively validate with the new version where you need to while older code continues using the older version. In the example above, just add a `v2()` function and then validate against it using the following:

```js
ObjectModel
    .schema(SCHEMA.USER)
    .v2()
    .validate(user)
```

## Adding AJV Keywords

ObjectModel allows you to add custom AJV keywords through the `addKeyword()` function. Just pick a name for your keyword and define a validation function for it according to the [AJV custom keyword specs](https://ajv.js.org/custom.html), then add it to ObjectModel with `ObjectModel.addKeyword(name, validationFunction)`

## Built-In Custom Keywords

ObjectModel ships with one custom keyword built-in: `is`

The `is` keyword first checks if its input data is prototype-linked to the given schema type via `schemaType.isPrototypeOf(data)`. If that is false then the keyword performs a second check: `data instanceof schemaType`. If the data is either prototype-linked or an instance of the defined schema type then the keyword returns true, otherwise false. The `is` keyword supports schema defining a single type or an array of possible types. For arrays, if the input data matches any of the listed types then the keyword will return true.

Out of the box, the `is` keyword will match against the following types: `Object`, `Array`, `Function`, `Number`, `String`, `Date`, `RegExp`, `Buffer`, `Promise`

You can easily add custom types to the keyword as well using the `addType()` or `addTypes()` functions.

Here's an example of the `is` keyword in action using a custom type:

```js
const ObjectModel = require('@unplgtc/object-model');

const Username = {
    setName(name) {
        this.name = name;

        return this;
    }
}

const UserSchema = {
    key: 'USER',

    v1() {
        return ObjectModel.buildValidator(
            {
                title: 'User',
                type: 'object',
                properties: {
                    username: {
                        type: 'object',
                        is: 'Username'
                    }
                }
            }
        );
    }
}

ObjectModel.addSchema(UserSchema.key, UserSchema);
ObjectModel.addType('Username', Username);

const username = Object.create(Username).setName('some-username');

const user = {
    username: username
}

ObjectModel
    .schema(SCHEMA.USER)
    .v1()
    .validate(user); // True
```

To add multiple types at once, just call `ObjectModel.addTypes()` with an Object whose keys are the names of your types and whose values are the types themselves:

```js
const types = {
    Username: Username
}

ObjectModel.addTypes(types);
```

## Suggested Architecture

The above steps are all you need to use this package, but we've found the below architecture a nice way to include some common attributes across all schema that you build.

Package your schemata in a `/schemata` (or similarly named) directory, or at least package `index.js` and `common.js` files in such a directory. `/schemata/index.js` should export an Object whose keys are your schema keys and whose values are your schema Objects. `/schemata/common.js` should export an Object which contains functions to generate schemata with common values (such as the JSON Schema draft version that you're using) and validate schemata using `ObjectModel`'s validator function.

Example `/schemata/index.js` file:

```js
'use strict';

const UserSchema = require('./UserSchema');

const schemata = {
    [UserSchema.key]: UserSchema
}

module.exports = schemata;
```

Example `/schemata/common.js` file:

```js
'use strict';

const ObjectModel = require('@unplgtc/object-model');

const common = {
    validator: (version, schema) => ObjectModel.buildValidator(
        Object.assign(version(schema.title), schema)
    ),

    v1(schemaTitle) {
        return {
            '$schema': 'http://json-schema.org/draft-07/schema#',
            '$id': `https://github.com/username/repo/blob/master/src/schemata/${schemaTitle}Schema.js`
        }
    }
}

module.exports = common;
```

Example `/schemata/UserSchema.js` file which uses `common.js`:

```js
const common = require('./common');

const UserSchema = {
    key: 'USER',

    v1() {
        return common.validator(common.v1, // Pass common's own `v1` function as the validator's first argument
            {
                title: 'User',
                version: '1',
                description: 'User Schema',
                type: 'object',
                properties: {
                    uid: {
                        description: 'Unique identifier for this user',
                        type: 'string'
                    },
                    username: {
                        description: 'Username for this user',
                        type: 'string'
                    },
                    email: {
                        description: 'Email for this user',
                        type: 'string'
                    }
                },
                required: [ 'uid', 'username', 'displayName', 'email' ]
            }
        );
    }
}

module.exports = UserSchema;
```

Validate using the above architecture in essentially the same way as before:

```js
const ObjectModel = require('@unplgtc/object-model'),
      SCHEMA = ObjectModel.SCHEMA,
      schemata = require('./path/to/schemata')
      userService = require('./path/to/userService');

ObjectModel.addSchemata(schemata);

const user = await userService.get('<user_identifier>');

ObjectModel
    .schema(SCHEMA.USER)
    .v1()
    .validate(user)
```

That example only used one schema, but the main advantage of the above architecture is that you can implement many different schema files, include common values in all of them, and import them all into your ObjectModel instance at once via the `index.js` file. In time if you need to upgrade to a newer version of the JSON Schema standard, just add a `v2()` function to your `common` Object and slowly upgrade individual schemata by adjusting them to pass `common.v2` to the validator instead of `common.v1`.
