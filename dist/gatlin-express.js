/*
MIT License

Copyright (c) 2025 DWTechs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/DWTechs/Gatlin-express.js
*/

import { isValidNumber, isStringOfLength } from '@dwtechs/checkard';
import { log } from '@dwtechs/winstan';

function getConsumer(req, res, next) {
    const id = req.headers["x-consumer-id"];
    const name = req.headers["x-consumer-name"];
    log.debug(`getConsumer(id=${id}, name=${name})`);
    if (!isValidNumber(id, 1, 999999999, false))
        return next({ status: 400, msg: "Missing consumer Id" });
    if (!isStringOfLength(name, 5))
        return next({ status: 400, msg: "Missing consumer name" });
    res.locals.consumerId = +id;
    res.locals.consumerName = name;
    log.debug(`Consumer stored: id=${res.locals.consumerId}, name=${res.locals.consumerName}`);
    next();
}

export { getConsumer };
