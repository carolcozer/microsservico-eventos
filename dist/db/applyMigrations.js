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
// Importando o método `readFileSync` do módulo 'fs' para ler o conteúdo dos arquivos.
const fs_1 = require("fs");
// Importando o método `join` do módulo 'path' para concatenar caminhos.
const path_1 = require("path");
// Importando o método `open` do módulo 'sqlite' para abrir conexões com o banco de dados SQLite.
const sqlite_1 = require("sqlite");
// Importando a biblioteca sqlite3.
const sqlite3_1 = __importDefault(require("sqlite3"));
// Definindo o caminho do diretório para os arquivos de migração com base no diretório atual.
const migrationDir = (0, path_1.join)(__dirname, "migrations");
// Função assíncrona para aplicar as migrações do banco de dados.
const applyMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    // Abrindo o banco de dados SQLite localizado no caminho especificado usando o driver sqlite3.
    const db = yield (0, sqlite_1.open)({
        filename: "src/db/database.sqlite",
        driver: sqlite3_1.default.Database,
    });
    // Lista dos arquivos de migração a serem executados.
    // (Este exemplo contém apenas um, mas mais podem ser adicionados.)
    const migrations = ["001-initial-schema.sql"];
    // Iterando sobre cada arquivo de migração para executá-los.
    for (const migration of migrations) {
        // Lendo o conteúdo SQL do arquivo de migração.
        const migrationScript = (0, fs_1.readFileSync)((0, path_1.join)(migrationDir, migration), "utf8");
        // Executando o script de migração no banco de dados.
        yield db.exec(migrationScript);
    }
    // Mostrando no console quando todas as migrações forem aplicadas com sucesso.
    console.log("Migrações aplicadas com sucesso.");
});
// Chamando a função para aplicar as migrações.
applyMigrations();
