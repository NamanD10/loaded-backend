import dotenv from 'dotenv'
import express from 'express';
import authRouter from "./routes/auth"
import loadRouter from "./routes/loads"
import bidRouter from "./routes/bids"
import assignmentRouter from "./routes/assignments"

const app = express();
app.use(express.json());

dotenv.config();

app.use("/auth", authRouter);
app.use("/loads", loadRouter);
app.use("/bids", bidRouter);
app.use("/assignments", assignmentRouter);

const PORT = process.env.PORT;

app.listen(PORT,
    () => {console.log(`App listening on PORT ${PORT}`)}
);