"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const loads_1 = __importDefault(require("./routes/loads"));
const bids_1 = __importDefault(require("./routes/bids"));
const assignments_1 = __importDefault(require("./routes/assignments"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
app.use("/auth", auth_1.default);
app.use("/loads", loads_1.default);
app.use("/bids", bids_1.default);
app.use("/assignments", assignments_1.default);
const PORT = process.env.PORT;
app.get("/", () => {
    console.log("Hello from loaded");
});
app.listen(PORT, () => { console.log(`App listening on PORT ${PORT}`); });
