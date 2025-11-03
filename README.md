
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/gatelin-express.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fgatelin-express.svg)](https://www.npmjs.com/package/@dwtechs/gatelin-express)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Gatelin-express.js)](https://www.npmjs.com/package/@dwtechs/gatelin-express)


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

**[Gatelin-express.js](https://github.com/DWTechs/Gatelin-express.js)** is an open source Gatelin gateway toolset for Express.js.  

- 🪶 Very lightweight
- 🧪 Thoroughly tested
- 🚚 Shipped as EcmaScrypt Express module
- 📝 Written in Typescript


## Support

- node: 22

This is the oldest targeted versions.  


## Installation

```bash
$ npm i @dwtechs/gatelin-express
```


## Usage


```javascript

// @ts-check
import express from "express";
const router = express.Router();

import getConsumer from "@dwtechs/gatelin-express";

// Routes
// Get users and returns Json
router.get("/search", getConsumer, ...);

// Add new users
router.post("/", getConsumer, ...);

```


## API Reference


```typescript

/**
 * Middleware to extract and validate consumer information from request headers.
 * Retrieves consumer ID from 'x-consumer-id' header and consumer name from 'x-consumer-name' header.
 * Validates that the ID is a valid number between 1 and 999999999, and the name has at least 5 characters.
 * Stores the validated consumer information in res.locals.consumerId and res.locals.consumerName 
 * for use by subsequent middleware in the request pipeline.
 *
 * @param {Request} req - The request object containing the decoded access token or user ID. Where the new tokens will be added
 * @param {Response} res - The response object where the new tokens will be added.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 *
 * @returns {void} Calls the next middleware function with an error if the issuer is invalid,
 *          otherwise proceeds to the next middleware function.
 * 
 */
function getConsumer(req: Request, res: Response, next: NextFunction): void {}


```


## Logs

**Gatelin-express.js** uses **[@dwtechs/Winstan](https://www.npmjs.com/package/@dwtechs/winstan)** library for logging.
All logs are in debug mode. Meaning they should not appear in production mode.

## Contributors

**Gatelin-express.js** is still in development and we would be glad to get all the help you can provide.
To contribute please read **[contributor.md](https://github.com/DWTechs/Gatelin-express.js/blob/main/contributor.md)** for detailed installation guide.


## Stack

| Purpose         |                    Choice                    |                                                     Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup](https://rollupjs.org)          |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
