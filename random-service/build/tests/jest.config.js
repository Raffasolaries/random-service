"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var config = function () {
    return {
        "roots": [
            "./tests"
        ],
        "testMatch": [
            "**/__tests__/**/*.+(ts|tsx|js)",
            "**/?(*.)+(spec|test).+(ts|tsx|js)"
        ],
        "transform": {
            "^.+\\.(ts|tsx)$": "ts-jest"
        }
    };
};
exports.config = config;
