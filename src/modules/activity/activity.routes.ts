import { Router } from "express";
import * as activityController from "./activity.controller";

export const activityRoutes = Router();

activityRoutes.post("/", activityController.createActivity);
