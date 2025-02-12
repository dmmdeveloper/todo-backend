import { Router } from "express";
import {
  collections,
  completedCollection,
  createCollection,
  deleteCollection,
  editCollectionName,
  singleCollection,
  unCompletedCollection,
} from "../controllers/collction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const collectionRouter = Router();

collectionRouter.route("/create").post(verifyJWT, createCollection);
collectionRouter.route("/collections").get(verifyJWT, collections);
collectionRouter.route("/edit-name/:id").put(verifyJWT, editCollectionName);
collectionRouter.route("/delete/:id").delete(deleteCollection);
collectionRouter.route("/completed/:id").put(completedCollection);
collectionRouter.route("/uncompleted/:id").put(unCompletedCollection);
collectionRouter.route("/collection/:id").get(verifyJWT, singleCollection);

export default collectionRouter;


