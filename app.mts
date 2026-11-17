import express from "express";
import app from "./artifacts/api-server/src/app";

const vercelApp = express();
vercelApp.use(app);

export default vercelApp;
