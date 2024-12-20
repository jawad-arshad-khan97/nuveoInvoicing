import express from "express";

import {
  createUser,
  getUser,
  getAllUsers,
  getUserInfoByID,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/getUser").get(getUser);
router.route("/").post(createUser);
router.route("/:id").patch(updateUser);
router.route("/:id").get(getUserInfoByID);

export default router;
