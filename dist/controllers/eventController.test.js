"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.test)('Testar se a soma de 1 com 1 resulta em 2', () => {
    (0, vitest_1.expect)(1 + 1).toEqual(2);
});
