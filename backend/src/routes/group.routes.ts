import express from "express";
import {
  createGroup,
  getPublicGroups,
  getGroupDetails,
  createDiscussion,
} from "../controllers/group.controller.ts";
import { requireAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();
router.post("/", requireAuth, createGroup);
router.get("/", getPublicGroups);
router.get("/:id", getGroupDetails);
router.post("/:id/discussions", requireAuth, createDiscussion);
export default router;
