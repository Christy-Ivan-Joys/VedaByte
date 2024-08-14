"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
class message {
    constructor(_id, sender, recipient, message, Time) {
        this._id = _id;
        this.sender = sender;
        this.recipient = recipient;
        this.message = message;
        this.Time = Time;
    }
}
exports.message = message;
