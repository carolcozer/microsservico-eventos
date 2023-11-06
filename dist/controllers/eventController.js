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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventController = void 0;
const axios_1 = __importDefault(require("axios"));
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const dbPromise = (0, sqlite_1.open)({
    filename: "src/db/database.sqlite",
    driver: sqlite3_1.default.Database,
});
exports.eventController = {
    getAllEvents: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbPromise;
        const events = yield db.all("SELECT * FROM events");
        res.json(events);
    }),
    createEvent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbPromise;
        const event = req.body;
        const usersServiceURL = process.env.USERS_SERVICE_URL;
        if (!event.title ||
            !event.date ||
            !event.time ||
            !event.location ||
            !event.description ||
            !event.guests) {
            return res
                .status(400)
                .send("Propriedades obrigatórias ausentes no corpo da requisição.");
        }
        const guestsDetails = [];
        for (const userId of event.guests) {
            const handleUsersURL = `${usersServiceURL}/students/studentDetails/${userId}`;
            try {
                const userResponse = yield axios_1.default.get(handleUsersURL);
                if (userResponse.status === 200) {
                    guestsDetails.push(userResponse.data);
                }
            }
            catch (error) {
                console.error("Erro ao buscar usuário:", error);
            }
        }
        if (guestsDetails.length !== event.guests.length) {
            return res.status(400).send("Convidados fornecidos são inválidos.");
        }
        try {
            // Inserir novo evento.
            const result = yield db.run("INSERT INTO events (title, date, time, location, description) VALUES (?, ?, ?, ?, ?)", [event.title, event.date, event.time, event.location, event.description]);
            const lastId = result.lastID;
            // Associar convidados ao evento.
            const insertPromises = event.guests.map((userId) => db.run("INSERT INTO event_guests (event_id, user_id) VALUES (?, ?)", [
                lastId,
                userId,
            ]));
            yield Promise.all(insertPromises);
            const newEvent = yield db.get("SELECT * FROM events WHERE id = ?", [
                lastId,
            ]);
            newEvent.guests = guestsDetails;
            return res.status(201).json(newEvent);
        }
        catch (error) {
            console.error("Erro ao inserir evento:", error);
            return res.status(500).send("Erro interno ao criar evento.");
        }
    }),
    getGuestsForEvent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const eventId = req.params.eventId;
        const db = yield dbPromise;
        try {
            const guests = yield db.all(`
            SELECT u.id, u.name, u.email ... 
            FROM users u
            JOIN event_guests eg ON u.id = eg.user_id
            WHERE eg.event_id = ?
            `, [eventId]);
            return res.status(200).json(guests);
        }
        catch (error) {
            console.error("Erro ao buscar convidados:", error);
            return res.status(500).send("Erro interno ao buscar convidados.");
        }
    }),
    getEvent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbPromise;
        const event = yield db.get("SELECT * FROM events WHERE id = ?", [
            req.params.id,
        ]);
        if (event) {
            res.json(event);
        }
        else {
            res.status(404).send("Event not found");
        }
    }),
    updateEvent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbPromise;
        const event = req.body;
        yield db.run("UPDATE events SET title = ?, date = ?, time = ?, location = ?, description = ? WHERE id = ?", [
            event.title,
            event.date,
            event.time,
            event.location,
            event.description,
            req.params.id,
        ]);
        res.send("Event updated successfully");
    }),
    deleteEvent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield dbPromise;
        yield db.run("DELETE FROM events WHERE id = ?", [req.params.id]);
        res.send("Event deleted successfully");
    }),
};
