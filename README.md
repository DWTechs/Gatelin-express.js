
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/gatelin-express.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fgatelin-express.svg)](https://www.npmjs.com/package/@dwtechs/gatelin-express)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Gatelin-express.js)](https://www.npmjs.com/package/@dwtechs/gatelin-express)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-100%25-brightgreen.svg)


- [Synopsis](#synopsis)
- [Support](#support)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Logs](#logs)
- [Contributors](#contributors)
- [Stack](#stack)


## Synopsis

**[Gatelin-express.js](https://github.com/DWTechs/Gatelin-express.js)** is an open source Gatelin gateway toolset for Express.js.  

- 🪶 Very lightweight
- 🧪 Thoroughly tested
- 🚚 Shipped as ECMAScript Express module
- 📝 Written in TypeScript


## Support

- node: 22

This is the oldest targeted version.  


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
// Get items and returns Json
router.get("/search", getConsumer, ...);

// Add new items
router.post("/", getConsumer, ...);

```

The `getConsumer` middleware extracts and validates consumer information from request headers.
It stores the validated consumer information in **res.locals.consumer** (`{ id, nickname }`) for use by subsequent middleware in the request pipeline.
It must be called whenever the route is protected and requires consumer information.


## API Reference


```typescript

/**
 * Middleware to extract and validate consumer information from request headers.
 * Retrieves consumer ID from 'x-consumer-id' header and consumer nickname from 
 * 'x-consumer-nickname' header.
 * Validates that the ID is a valid integer between 1 and 999999999, and the 
 * nickname has at least 5 characters.
 * Stores the validated consumer information in res.locals.consumer ({ id, nickname })
 * for use by subsequent middleware in the request pipeline.
 *
 * @param {Request} req - The Express request object containing consumer headers 
 *        (x-consumer-id and x-consumer-nickname).
 * @param {Response} res - The Express response object where consumer data will
 *        be stored in res.locals.consumer.
 * @param {NextFunction} next - The next middleware function in the Express.js 
 *        request-response cycle.
 *
 * @returns {void} Calls the next middleware function with an error if consumer 
 *          validation fails, otherwise proceeds to the next middleware function.
 * 
 */
function getConsumer(req: Request, res: Response, next: NextFunction): void {}


```

The `Consumer` interface is exported and can be used to type `res.locals.consumer` in downstream middleware or route handlers:

```typescript

import type { Consumer } from "@dwtechs/gatelin-express";

// Type res.locals.consumer in downstream middleware
const consumer = res.locals.consumer as Consumer;
// consumer.id       → number
// consumer.nickname → string

```


## Logs

**Gatelin-express.js** uses **[@dwtechs/Winstan](https://www.npmjs.com/package/@dwtechs/winstan)** library for logging.
All logs are in debug mode. Meaning they should not appear in production mode.


## Stack

| Purpose         |                    Choice                    |                                                     Motivation |
| :-------------- | :------------------------------------------: | -------------------------------------------------------------: |
| repository      |        [Github](https://github.com/)         |     hosting for software development version control using Git |
| package manager |     [npm](https://www.npmjs.com/get-npm)     |                                default node.js package manager |
| language        | [TypeScript](https://www.typescriptlang.org) | static type checking along with the latest ECMAScript features |
| module bundler  |      [Rollup](https://rollupjs.org)          |                        advanced module bundler for ES6 modules |
| unit testing    |          [Jest](https://jestjs.io/)          |                  delightful testing with a focus on simplicity |
