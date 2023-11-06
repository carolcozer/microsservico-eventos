"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    constructor() {
        this.title = "";
        this.date = new Date();
        this.time = "";
        this.location = "";
        this.description = "";
        this.guests = [];
    }
}
exports.Event = Event;
