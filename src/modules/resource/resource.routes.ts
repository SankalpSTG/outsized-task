import { Router } from "express";
import { ResourceController } from "./resource.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { USER_ROLES } from "../auth/constants";

const ResourceRouter = Router()

ResourceRouter.get("/admin", AuthMiddleware(USER_ROLES.ADMIN, true), ResourceController.getAdminResource)
ResourceRouter.get("/guest", AuthMiddleware(USER_ROLES.GUEST, false), ResourceController.getGuestResource)
ResourceRouter.get("/user", AuthMiddleware(USER_ROLES.USER, false), ResourceController.getUserResource)

export default ResourceRouter