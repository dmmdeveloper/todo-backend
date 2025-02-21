import mongoose from "mongoose";
import { asyncHandler } from "../utils/asynhandler.utils.js";
import { APIREsponse } from "../utils/apiresponse.utils.js";
import { APIError } from "../utils/apierror.utils.js";
import { Collection } from "../models/collection.mode.js";

const addTodoToCollection = asyncHandler(async (req, res) => {
  console.log(req.url);

  // Get data - Collection _id, text
  const { id } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json(new APIREsponse("Invalid Collection Id ::)", {}, 400));
    throw new APIError("Invalid Collection Id :)", 400);
  }

  if (!text) {
    res.status(400).json(new APIREsponse("Todo Text Is Required :)", {}, 200));
    throw new APIError("Todo Text Is Required :))", 400);
  }

  const findCollection = await Collection.findById(id);
  if (!findCollection) {
    res.status(404).json(new APIREsponse("Collection Not Found :)", null, 404));
    throw new APIError("Collection Not Found :)", 404);
  }

  // Add the new todo with createdAt
  const newTodo = { text, createdAt: new Date() };
  findCollection.todos.push(newTodo);

  // Sort todos by creation order (newest first)
  findCollection.todos.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const savedCollection = await findCollection.save();

  res
    .status(200)
    .json(
      new APIREsponse(
        `Todo Added To Collection, Total Todos: ${savedCollection.todos.length}`,
        savedCollection,
        200
      )
    );
});

const deleteCollectionTodo = asyncHandler(async (req, res) => {
  console.log(req.url);

  const { collectionId, todoId } = req.params;
  console.log(collectionId, todoId);

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    res.status(400).json(new APIREsponse("Invalid Collection Id", {}, 400));
    throw new APIError("Invalid Collection Id", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    res.status(400).json(new APIREsponse("Invalid Todo Id", {}, 400));
    throw new APIError("Invalid Todo Id", 400);
  }

  const findCollection = await Collection.findById(collectionId);

  if (!findCollection) {
    res.status(400).json(new APIREsponse("Collection Not Find", {}, 400));
    throw new APIError("Collection Not find ", 400);
  }
  findCollection.todos = findCollection.todos.filter(
    (todo) => todo._id.toString() !== todoId
  );
  const updatedTodos = await findCollection.save();

  res
    .status(200)
    .json(
      new APIREsponse(
        `Collection Todo Deleted :) ${updatedTodos?.todos.length}`,
        updatedTodos,
        null
      )
    );
});

const updateCollectionTodo = asyncHandler(async (req, res) => {
  console.log(req.url);

  const { collectionId, todoId } = req.params;

  const { text, completed } = req.body;
  console.log(text, completed);

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    res.status(400).json(new APIREsponse("Invalid Collection Id", {}, 400));
    new APIError("Invalid Collection Id", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    res.status(400).json(new APIREsponse("Invalid Todo Id", {}, 400));
    new APIError("Invalid Todo Id", 400);
  }

  const findCollection = await Collection.findById(collectionId);

  if (!findCollection) {
    res.status(400).json(new APIREsponse("Collection Not Found", {}, 400));
    new APIError("Collection Not Found", 400);
  }
  const findTodo = findCollection?.todos.find(
    (todo) => todo?._id.toString() == todoId
  );

  if (!findTodo) {
    res.status(400).json(new APIREsponse("Todo Not Found", {}, 400));
    new APIError("Todo Not Found", 400);
  }
  console.log(findTodo);
  if (text) findTodo.text = text;
  if (completed || !completed) findTodo.completed = completed;
  // if(!completed) findTodo.completed = completed;

  const updatedTodo = await findCollection.save();

  res
    .status(200)
    .json(new APIREsponse("Collection Todo Updated !", updatedTodo, 200));
});

const collectionTodosSortBy = asyncHandler(async (req, res) => {
  console.log(req.url);
  console.log(req.params);

  const { collectionId, order } = req.params;

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    res.status(400).json(new APIREsponse("Invalid Collection Id", {}, 400));
    throw new APIError("Invalid Collection Id", 400);
  }

  const findCollection = await Collection.findById(collectionId)

  // Fetch todos from the database
  let todos = findCollection?.todos;

  if (!todos || todos.length === 0) {
    res.status(404).json(new APIREsponse("No Todos found", {}, 404));
    throw new APIError("No Todos found", 404);
  }

  // **Sorting Logic Based on the 'order' Parameter**
  switch (order) {
    case "completedFirst":
      todos.sort((a, b) => b.completed - a.completed);
      break;

    case "uncompletedFirst":
      todos.sort((a, b) => a.completed - b.completed);
      break;

    case "newestFirst":
      todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;

    case "oldestFirst":
      todos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;

    case "newestCompletedFirst":
      todos.sort((a, b) => b.completed - a.completed || new Date(b.createdAt) - new Date(a.createdAt));
      break;

    case "oldestCompletedFirst":
      todos.sort((a, b) => b.completed - a.completed || new Date(a.createdAt) - new Date(b.createdAt));
      break;

    case "newestUncompletedFirst":
      todos.sort((a, b) => a.completed - b.completed || new Date(b.createdAt) - new Date(a.createdAt));
      break;

    case "oldestUncompletedFirst":
      todos.sort((a, b) => a.completed - b.completed || new Date(a.createdAt) - new Date(b.createdAt));
      break;

    default:
      res
        .status(400)
        .json(new APIREsponse("Invalid Order. Choose a valid sorting order.", {}, 400));
      throw new APIError("Invalid Order. Choose a valid sorting order.", 400);
  }

await findCollection.save();

  res.status(200).json(new APIREsponse(`Collection Todos Sorted In ${order}`, { todos }, 200));
});

const deleteAllCollectionTodos = asyncHandler(async (req , res)=>{
  console.log(req.url);


const {collectionId}  =req.params;

if(!mongoose.Types.ObjectId.isValid(collectionId)){
  res
  .status(400)
  .json(
    new APIREsponse("Invalid Collection Id", {}, 400)
  )
  throw new APIError("Invalid Collection Id", 400)
}

const findCollection = await Collection.findById(collectionId)

if(!findCollection){
  res
  .status(400)
  .json(
    new APIREsponse("Collection Not Find", {}, 400)
  )
  throw new APIError("Collection Not Find", 400)
}
console.log(findCollection?.todos.length);
findCollection.todos = [];
await findCollection.save();

  res
  .status(200)
  .json(
    new APIREsponse("Delete All Todos From Collection " , {} , 200)
  )  
});

// Delete Selected Todo / Delete multiple todos
// const todoIdsToRemove = ["id1", "id2", "id3", "id4"]; // Replace with actual IDs
// findCollection.todos = findCollection.todos.filter(
//   todo => !todoIdsToRemove.includes(todo._id.toString()) // Keep only todos NOT in the list
// );
// await findCollection.save();

  // ===================== or ==================
  // await Collection.updateOne(
  //   { _id: collectionId }, // Find the collection by its ID
  //   { $pull: { todos: { _id: { $in: todoIdsToRemove } } } } // Remove todos whose _id is in the array
  // );
  
export {
  addTodoToCollection,
  deleteCollectionTodo,
  updateCollectionTodo,
  collectionTodosSortBy,
  deleteAllCollectionTodos
};
