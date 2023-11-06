"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importação dos módulos necessários
const express_1 = __importDefault(require("express")); // Framework web para criar a aplicação
const dotenv_1 = __importDefault(require("dotenv")); // Módulo para carregar variáveis de ambiente
const cors_1 = __importDefault(require("cors")); // Middleware para habilitar CORS
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes")); // Rotas para os eventos
// Carrega as variáveis de ambiente do arquivo .env
dotenv_1.default.config();
// Cria uma nova instância do express
const app = (0, express_1.default)();
// Habilita o express para tratar requisições com corpo no formato urlencoded
app.use(express_1.default.urlencoded({ extended: false }));
// Habilita o express para tratar requisições com corpo em JSON
app.use(express_1.default.json());
// Define a porta padrão ou a porta definida no arquivo .env
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = "http://localhost:4000";
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            // Se não há cabeçalho de origem, rejeitamos a requisição
            callback(new Error("Origin header missing or undefined"));
            return;
        }
        if (origin === ALLOWED_ORIGIN) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
// Usa as rotas definidas em eventRoutes para todas as requisições que começam com "/events"
app.use("/events", eventRoutes_1.default);
// Inicia o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
