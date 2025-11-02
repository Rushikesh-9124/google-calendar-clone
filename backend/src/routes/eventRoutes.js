import express from "express";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { login, signup } from "../controllers/authController.js";
import { authenticate } from "../Utilities/utils.js";

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.get("/get-events", authenticate, getEvents);
router.post("/create-event", authenticate, createEvent);
router.put("/update-event/:id", authenticate, updateEvent);
router.delete("/delete-event/:id", authenticate, deleteEvent);

export default router;
