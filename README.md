
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/gatlin-express.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fgatlin-express.svg)](https://www.npmjs.com/package/@dwtechs/gatlin-express)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Gatlin-express.js)](https://www.npmjs.com/package/@dwtechs/gatlin-express)


- [Synopsis](#synopsis)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
- [Environment variables](#environment-variables)
- [API Reference](#api-reference)
- [Logs](#logs)
- [Contributors](#contributors)
- [Stack](#stack)


## Synopsis

**[Gatlin-express.js](https://github.com/DWTechs/Gatlin-express.js)** is an open source Gatelin gateway toolset for Express.js.  

- 🪶 Very lightweight
- 🧪 Thoroughly tested
- 🚚 Shipped as EcmaScrypt Express module
- 📝 Written in Typescript


## Support

- node: 22

This is the oldest targeted versions.  


## Installation

```bash
$ npm i @dwtechs/gatlin-express
```


## Usage


```javascript

// @ts-check


```


## API Reference


```typescript

/**
 * Refreshes the JWT tokens for a user.
 *
 * This function generates new access and refresh tokens for a consumer based on the provided
 * decoded access token or user ID in the request body. It validates the issuer (iss) and
 * creates new tokens if the validation is successful. The new tokens are then added to the
 * response local and the request body objects.
 *
 * @param {Request} req - The request object containing the decoded access token or user ID. Where the new tokens will be added
 * @param {Response} res - The response object where the new tokens will be added.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 *
 * @returns {Promise<void>} Calls the next middleware function with an error if the issuer is invalid,
 *          otherwise proceeds to the next middleware function.
 * 
 * @throws {InvalidIssuerError} If the issuer (iss) is not a string or number (HTTP 400)
 * @throws {InvalidSecretsError} If the secrets array is empty or invalid (HTTP 500)
 * @throws {InvalidDurationError} If the duration is not a positive number (HTTP 400)
 * @throws {InvalidBase64Secret} If the secret cannot be decoded from base64 (HTTP 500)
 * @throws {Object} Will call next() with error object containing:
 *   - statusCode: 400 - When iss (issuer) is missing or invalid
 */
function refresh(req: Request, res: Response, next: NextFunction): void {}


```


## Logs

**Gatlin-express.js** uses **[@dwtechs/Winstan](https://www.npmjs.com/package/@dwtechs/winstan)** library for logging.
All logs are in debug mode. Meaning they should not appear in production mode.

## Contributors

**Gatlin-express.js** is still in development and we would be glad to get all the help you can provide.
To contribute please read **[contributor.md](https://github.com/DWTechs/Gatlin-express.js/blob/main/contributor.md)** for detailed installation guide.


## Stack

| Purpose         |                    Choice                    |                                                     Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup](https://rollupjs.org)          |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
