import express from "express";

import {
    createEvent,
    deleteEvent,
    getAllEvents,
    getEventDetail,
    updateEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.route("/").get(getAllEvents);
router.route("/:id").get(getEventDetail);
router.route("/").post(createEvent);
router.route("/:id").patch(updateEvent);
router.route("/:id").delete(deleteEvent);

export default router;
