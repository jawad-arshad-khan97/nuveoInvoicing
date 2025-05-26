import express from "express";

import {
    createClientMedia,
    deleteClientMedia,
    getAllClientMedias,
    getClientMediaDetail,
    updateClientMedia,
} from "../controllers/clientmedia.controller.js";

const router = express.Router();

router.route("/").get(getAllClientMedias);
router.route("/:id").get(getClientMediaDetail);
router.route("/").post(createClientMedia);
router.route("/:id").patch(updateClientMedia);
router.route("/:id").delete(deleteClientMedia);

export default router;