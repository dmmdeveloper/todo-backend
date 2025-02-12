import mongoose from "mongoose";


const todoSchema = mongoose.Schema({
        _id: {
          type :mongoose.Schema.Types.ObjectId,
          auto :true
        },
        text: String,
        completed: {
          type: Boolean,
          default: false,
        },
} ,{timestamps  :true} )

const TodosCollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    todos: [
      todoSchema
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Collection = mongoose.model("collection", TodosCollectionSchema);
