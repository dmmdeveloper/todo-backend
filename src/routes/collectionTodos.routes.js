import { Router } from "express";
import { addTodoToCollection, collectionTodosSortBy, deleteAllCollectionTodos, deleteCollectionTodo, updateCollectionTodo } from "../controllers/collectionTodos.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const collectionTodoRouter = Router();

collectionTodoRouter.route("/create/:id").post( verifyJWT, addTodoToCollection)
collectionTodoRouter.route("/:collectionId/delete/:todoId").delete( verifyJWT, deleteCollectionTodo)
collectionTodoRouter.route("/:collectionId/update/:todoId").put(verifyJWT, updateCollectionTodo)
collectionTodoRouter.route("/:collectionId/sort-by/:order").get(verifyJWT, collectionTodosSortBy)
collectionTodoRouter.route("/:collectionId/delete-all").delete( verifyJWT,deleteAllCollectionTodos)


export default collectionTodoRouter;