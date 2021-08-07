"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var jsonschema_1 = require("jsonschema");
var handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var v, bodySchema, returnMapping, body, statusCode, responseBody, items, percentageValue, remaining, validateRes, i, i, i, randomGenerated;
    return __generator(this, function (_a) {
        console.log('Event', event);
        v = new jsonschema_1.Validator();
        bodySchema = {
            id: '/bodySchema',
            type: 'object',
            properties: {
                total: { type: 'integer', minimum: 1 },
                clusters: { type: 'integer', minimum: 1 },
                minPercentage: { type: 'number', maximum: 100 }
            },
            required: ['total', 'clusters']
        };
        returnMapping = function (statusCode, responseBody) {
            return {
                statusCode: statusCode,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responseBody)
            };
        };
        body = JSON.parse(event.body) ? JSON.parse(event.body) : {};
        statusCode = 200;
        responseBody = {};
        items = [];
        percentageValue = 0;
        remaining = body.total;
        validateRes = v.validate(body, bodySchema);
        console.log('validation results', validateRes);
        if (validateRes.errors && validateRes.errors.length > 0) {
            statusCode = 500;
            responseBody = {
                message: 'Validation Errors: ' + validateRes.errors.map(function (error) { return error.property + ' ' + error.message; }).join(', ')
            };
            return [2 /*return*/, returnMapping(statusCode, responseBody)];
        }
        if (body.total < body.clusters) {
            statusCode = 500;
            responseBody = {
                message: 'Validation Errors: instance.total must be greater than or equal to instance.clusters'
            };
            return [2 /*return*/, returnMapping(statusCode, responseBody)];
        }
        if (body.total === body.clusters) {
            statusCode = 200;
            responseBody = {
                items: items
            };
            return [2 /*return*/, returnMapping(statusCode, responseBody)];
        }
        if (body.minPercentage) {
            if (body.minPercentage * body.clusters > 100) {
                statusCode = 500;
                responseBody = {
                    message: 'Validation Errors: instance.minPercentage should permit consistent distribution over all clusters'
                };
                return [2 /*return*/, returnMapping(statusCode, responseBody)];
            }
            percentageValue = Math.round(parseFloat(((body.total * body.minPercentage) / 100).toFixed(3)));
            remaining = body.total - (percentageValue * body.clusters);
            for (i = 0; i < body.clusters; i++) {
                items.push(percentageValue);
            }
        }
        else {
            remaining = body.total - body.clusters;
            for (i = 0; i < body.clusters; i++) {
                items.push(1);
            }
        }
        for (i = 0; i < body.clusters; i++) {
            if (i === body.clusters - 1) {
                items[i] += remaining;
            }
            else {
                randomGenerated = Math.floor(Math.random() * remaining);
                items[i] += randomGenerated;
                remaining -= randomGenerated;
            }
        }
        responseBody = {
            items: items
        };
        return [2 /*return*/, returnMapping(statusCode, responseBody)];
    });
}); };
exports.handler = handler;
