import { Router } from "express";
import { auth } from "../auth";
import { toNodeHandler } from "better-auth/node";

const router = Router();

// Pass the request to better-auth using the Node handler adapter
router.all("/*", toNodeHandler(auth));

export default router;