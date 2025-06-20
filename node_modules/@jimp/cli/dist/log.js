"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logSymbols = __importStar(require("log-symbols"));
var chalk_1 = __importDefault(require("chalk"));
exports.greenCheck = chalk_1.default.green(logSymbols.success + " ");
exports.log = function (message, verbose) {
    if (verbose === void 0) { verbose = false; }
    return verbose && console.log(message);
};
exports.logResult = function (functionName, result) {
    return exports.log(exports.greenCheck + "  Result of running '" + functionName + "': " + JSON.stringify(result), true);
};
