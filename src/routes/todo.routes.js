import { Router} from "express"
import { create, deleteTodo, todos, update } from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const todoRouter = Router();

todoRouter.route("/create").post( verifyJWT, create);
todoRouter.route("/todos").get( verifyJWT, todos)
todoRouter.route("/delete/:id").delete(verifyJWT ,  deleteTodo)
todoRouter.route("/update/:id").post( verifyJWT, update)

export default todoRouter;