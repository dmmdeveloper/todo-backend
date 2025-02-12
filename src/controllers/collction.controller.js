import mongoose from "mongoose";
import { Collection } from "../models/collection.mode.js";
import { APIError } from "../utils/apierror.utils.js";
import { APIREsponse } from "../utils/apiresponse.utils.js";
import { asyncHandler } from "../utils/asynhandler.utils.js";

const createCollection = asyncHandler(async (req, res) => {
  console.log(req.url);

  const { name } = req.body;
  console.log(name);
  console.log(req.user?._id);

  if (!name) {
    res.status(400).json(new APIREsponse("Name is Required :)", {}, 400));
  }

  const newCollection = await Collection.create({
    name,
    createdBy: req.user?._id,
  });

  res
    .status(200)
    .json(
      new APIREsponse(
        "Todo Collection  Created Success Fully !!!",
        newCollection,
        200
      )
    );
});

// Conterollers;;

// Fetch All Collection collection.find();

const collections = asyncHandler(async (req, res) => {
  

  const allCollections = await Collection
    .find(
    { _id : req.user?._id}
    ).sort({createdAt : -1});

  res
    .status(200)
    .json(
      new APIREsponse(
        `Collections Are Fetched Success Fylly !! Total Collections  : ${allCollections.length}`,
        allCollections,
        200
      )
    );
});
// edit / re-name

const editCollectionName = asyncHandler(async (req, res) => {
  console.log(req.url);

  const { id } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json(new APIREsponse("Invaid Collection Id:)", {}, 400));
    throw new APIError("Invalid Collection Id:)", {}, 400);
  }

  if (!text) {
    res.status(400).json(new APIREsponse("Text is Required :)", {}, 400));
    throw new APIError("Text is Required :)", {}, 400);
  }

  const updatedNameCollection = await Collection.findByIdAndUpdate(
    id,
    {
      $set: {
        name: text,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(
      new APIREsponse(
        "Colection Name Changed Success Fully !!",
        updatedNameCollection,
        200
      )
    );
});

// delete Collection

const deleteCollection = asyncHandler(async (req, res) => {
  console.log(req.url);

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json(new APIREsponse("Invalid Collection Id :)", 400));
    throw new APIError("Invalid Collection Id :)", 400);
  }

  await Collection.findByIdAndDelete(id);

  res
    .status(200)
    .json(new APIREsponse("Tode Deleted Success Fully !!", {}, 200));
});

// complete Collection - all todos Completed is true

const completedCollection = asyncHandler(async (req, res) => {
  console.log(req.url);

  const { id } = req.params;
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json(new APIREsponse("Invalid Collection Id", 400));
    throw new APIError("Invalid Collection Id", 400);
  }

  const findCollection = await Collection.findById(id);

  // console.log(
  findCollection.todos.map((todo) => (todo.completed = true));
  // );
  const savedCollection = await findCollection.save();

  res
    .status(200)
    .json(
      new APIREsponse(
        "Collection Completed Success Fully !!",
        savedCollection,
        200
      )
    );
});

// Uncomplete Collection - all todos Completed is false

const unCompletedCollection = asyncHandler(async (req, res) => {
  console.log(req.url);

  const { id } = req.params;
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json(new APIREsponse("Invalid Collection Id:)", 400));
    throw new APIError("Invalid Collection Id", 400);
  }

  const findCollection = await Collection.findById(id);
  findCollection.todos.map((todo) => (todo.completed = false));
  const savedCollection = await findCollection.save();

  res
    .status(200)
    .json(new APIREsponse("Collection UnCompleted Success Fully !!!", savedCollection, 200));
});

const singleCollection = asyncHandler ( async ( req , res) =>{
  // console.log(req.url);

  const {id} = req.params;
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    res
    .status(400)
    .json(
      new APIREsponse("Invalid Collection Id ::)" , {}  ,400)
    )
    throw new APIError("Invalid Collection Id :)" , 400)
  }
  const findCollection = await Collection.findById(id)

  if(!findCollection){
    res
    .status(400)
    .json(
      new APIREsponse("Collection Not Find  :) , Internal Server Error" , {}  ,400)
    )
    throw new APIError("Collection Not Find  :) , Internal Server Error", 400)
  }

  res
  .status(200)
  .json(
    new APIREsponse("Single Collection Fetched Success Fully !!" , findCollection , 200)
  )
})

const collectionSortBy = asyncHandler ( async (req , res)=>{
  console.log(req.url);




  res
  .status(200)
  .json(
    new APIREsponse(` Collection Order In {order}` , {}, 200)
  )
} )


export {
  createCollection,
  collections,
  editCollectionName,
  deleteCollection,
  completedCollection,
  unCompletedCollection,
  singleCollection
};
