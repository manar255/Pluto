"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomErrorClass extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomErrorClass.prototype);
    }
}
exports.default = CustomErrorClass;
