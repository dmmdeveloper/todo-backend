import { Router } from "express";
import {
  collections,
  collectionSortBy,
  completedCollection,
  createCollection,
  deleteCollection,
  editCollectionName,
  singleCollection,
  totalTodos,
  unCompletedCollection,
} from "../controllers/collction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const collectionRouter = Router();

collectionRouter.route("/create").post(verifyJWT, createCollection);
collectionRouter.route("/collections").get(verifyJWT, collections);
collectionRouter.route("/edit-name/:id").put(verifyJWT, editCollectionName);
collectionRouter.route("/delete/:id").delete(deleteCollection);
collectionRouter.route("/completed/:id").put( verifyJWT, completedCollection);
collectionRouter.route("/uncompleted/:id").put( verifyJWT, unCompletedCollection);
collectionRouter.route("/collection/:id").get(verifyJWT, singleCollection);
collectionRouter.route("/:/collectionId/sort-by/:order").get(verifyJWT, collectionSortBy)
collectionRouter.route("/total").get(verifyJWT , totalTodos )

export default collectionRouter;


