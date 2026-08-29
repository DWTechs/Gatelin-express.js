
[![License: MIT](https://img.shields.io/npm/l/@dwtechs/gatelin-express.svg?color=brightgreen)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40dwtechs%2Fgatelin-express.svg)](https://www.npmjs.com/package/@dwtechs/gatelin-express)
[![last version release date](https://img.shields.io/github/release-date/DWTechs/Gatelin-express.js)](https://www.npmjs.com/package/@dwtechs/gatelin-express)
![Jest:coverage](https://img.shields.io/badge/Jest:coverage-100%25-brightgreen.svg)


Open source Express.js middleware to extract and validate Gatelin consumer and ACL headers.  

- 🪶 Very lightweight
- 🧪 100% code coverage
- 🚚 Shipped as ESM
- 📝 Written in TypeScript
- 🔒 Strict input validation

## Installation

```bash
$ npm i @dwtechs/gatelin-express
```

## Usage

```javascript

// @ts-check
import express from "express";
const router = express.Router();

import { getConsumer, getAcl, stripUnallowedFields } from "@dwtechs/gatelin-express";

// Routes
// Add new items
router.post("/", getConsumer, getAcl, stripUnallowedFields, createItems);

```

Use `getConsumer` to read and validate the consumer headers injected by Gatelin into each request.
It stores the validated consumer information in **res.locals.consumer** (`{ userId, nickname }`) for use by subsequent middleware in the request pipeline.
Add it to any route that needs to identify the caller.

Use `getAcl` to read and validate the ACL headers injected by Gatelin into each request.
It stores the parsed ACL in **res.locals.acl** (`{ fields, conditions }`) for use by subsequent middleware in the request pipeline.
`getAcl` only validates the header shape (structure, size, allowed operators): it does not know your service's entity model, so each service must still check the returned field names and conditions against its own data before applying them.
Add it to any route that needs to enforce field- or row-level permissions forwarded by Gatelin.

Use `stripUnallowedFields` after `getAcl` to project `req.body.rows` onto the caller's field allow-list (`res.locals.acl.fields`), keeping only `id` and allowed keys on each row.
It is a no-op (rows passed through unchanged) when `res.locals.acl.fields` is `null` (unrestricted) or `req.body.rows` is not an array.
Add it to write routes (create/update) that need to silently drop fields the caller isn't allowed to set, rather than trusting your own entity validation alone.

## API Reference

```typescript

/**
 * Middleware to extract and validate consumer information from request headers.
 * Retrieves consumer ID from 'x-consumer-user-id' header and consumer nickname from 
 * 'x-consumer-name' header.
 * Validates that the ID is a valid integer between 1 and 999999999, and the nickname
 * is a string of 3 to 30 characters.
 * Stores the validated consumer information in res.locals.consumer ({ userId, nickname })
 * for use by subsequent middleware in the request pipeline.
 *
 * @param {Request} req - The Express request object containing consumer headers 
 *                  (x-consumer-user-id and x-consumer-name).
 * @param {Response} res - The Express response object where consumer data will be stored 
 *                   in res.locals.consumer.
 * @param {NextFunction} next - The next middleware function in the Express.js 
 *                       request-response cycle.
 *
 * @returns {void} Calls the next middleware function with an error if consumer validation
 *                 fails, otherwise proceeds to the next middleware function.
 * 
 */
function getConsumer(req: Request, res: Response, next: NextFunction): void {}

/**
 * Middleware to extract and validate ACL headers injected by Gatelin.
 * Retrieves the field allow-list from the 'x-acl-fields' header (comma-separated) and
 * the query conditions from the 'x-acl-conditions' header (JSON array of
 * { field, op, value }).
 * Only validates the header shape (structure, size, allowed operators): field names
 * are meaningless without a service's own entity metadata, so each service is
 * responsible for checking returned fields/conditions against its own data model.
 * Stores the parsed result in res.locals.acl ({ fields, conditions }) for use by
 * subsequent middleware in the request pipeline.
 *
 * @param {Request} req - The Express request object containing ACL headers
 *                  (x-acl-fields and x-acl-conditions).
 * @param {Response} res - The Express response object where the parsed ACL will be
 *                   stored in res.locals.acl.
 * @param {NextFunction} next - The next middleware function in the Express.js
 *                       request-response cycle.
 *
 * @returns {void} Calls the next middleware function with an error if a header is
 *                 malformed, otherwise proceeds to the next middleware function.
 *
 */
function getAcl(req: Request, res: Response, next: NextFunction): void {}

/**
 * Middleware that strips fields not on the allow-list parsed by getAcl
 * (res.locals.acl.fields) from req.body.rows, keeping only "id" and allowed keys on
 * each row. This is the Gatelin-contract part of field-level ACL enforcement: it only
 * knows about the { rows: [...] } write-payload shape, not any particular entity/ORM,
 * so services still validate field names against their own data model before calling
 * this.
 * Requires getAcl to have run first so res.locals.acl.fields is populated; treated as
 * unrestricted (rows passed through unchanged) when absent.
 *
 * @param {Request} req - The Express request object. req.body.rows is filtered in
 *                  place when it is an array; left untouched otherwise.
 * @param {Response} res - The Express response object holding res.locals.acl.fields.
 * @param {NextFunction} next - The next middleware function in the Express.js
 *                       request-response cycle.
 *
 * @returns {void} Always proceeds to the next middleware function.
 */
function stripUnallowedFields(req: Request, res: Response, next: NextFunction): void {}

```

The `Consumer`, `Acl` and `AclCondition` interfaces are exported and can be used to type `res.locals.consumer` / `res.locals.acl` in downstream middleware or route handlers:

```typescript

import type { Consumer, Acl } from "@dwtechs/gatelin-express";

// Type res.locals.consumer in downstream middleware
const consumer = res.locals.consumer as Consumer;
// consumer.userId   → number
// consumer.nickname → string

// Type res.locals.acl in downstream middleware
const acl = res.locals.acl as Acl;
// acl.fields     → Set<string> | null (null = unrestricted, empty Set = id only)
// acl.conditions → { field, op, value }[]

```

## Support

| Environment | Version |
| :---------- | :-----: |
| Node.js     |  >= 22  |

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
