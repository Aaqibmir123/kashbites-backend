import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    category: {
      type: String,
      required: true,
    },

    pricingType: {
      type: String,
      enum: ["single", "size", "quantity"],
      default: "single",
    },

    price: Number,

    variants: {
      type: [variantSchema],
      default: [],
    },

    foodType: {
      type: String,
      enum: ["veg", "nonveg"],
      default: "veg",
    },

    available: {
      type: Boolean,
      default: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    image: String,
  },
  { timestamps: true }
);

const ProductResturant =
  mongoose.models.ProductResturant ||
  mongoose.model("ProductResturant", productSchema);

export default ProductResturant;
