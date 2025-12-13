const mongoose = require("mongoose");
const Category = require("./categoryModel");
const { Schema } = mongoose;

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    managerId: {
      type: String,
      required: [false, "Manager ID is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: 125, // Short description limit
    },
    longDescription: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    stockQuantity: {
      type: Number, 
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: Category,
      required: [true, "Category is required"],
    },
    imageURL: {
      type: String,
      required: [true, "Image URL is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    costPrice: {
      type: Number,
      required: false, // Make optional for backward compatibility
      min: [0, "Cost price cannot be negative"],
      default: 0,
    },
    markup: {
      type: Number,
      default: 0,
      min: [0, "Markup cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: [
          "draft",
          "published", 
          "out of stock", 
          "low quantity", 
          "unpublished"
        ],
        message: "{VALUE} is not a valid status"
      },
      default: "draft",
    },
    attributes: [{
      name: {
        type: String,
        trim: true,
      },
      value: {
        type: String,
        trim: true,
      },
      isHighlight: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0,
        min: [0, "Attribute quantity cannot be negative"],
      },
      imageIndex: {
        type: Number,
        default: 1,
        min: [1, "Image index must be at least 1"],
      },
    }],
    moreImageURL: [{
      type: String,
      // validate: {
      //   validator: function(v) {
      //     return /^https?:\/\/.+/.test(v);
      //   },
      //   message: props => `${props.value} is not a valid URL!`
      // }
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    numberOfReviews: {
      type: Number,
      default: 0,
      min: [0, "Number of reviews cannot be negative"],
    },
    offer: {
      type: Number,
      default: 0,
      min: [0, "Offer percentage cannot be negative"],
      max: [100, "Offer percentage cannot exceed 100"],
    },
  },
  { 
    timestamps: true,
    // Add indexes for performance
    indexes: [
      { name: 1 },
      { category: 1 },
      { status: 1 },
    ]
  }
);

const Products = mongoose.model("Products", productsSchema);

module.exports = Products;











































// const mongoose = require("mongoose");
// const Category = require("../model/categoryModel");
// const { Schema } = mongoose;

// const productsSchema = new Schema(
//   {
//     name: {
//       type: String,
//     },
//     managerId: {
//       type: String,
//     },
//     description: {
//       type: String,
//     },
//     stockQuantity: {
//       type: Number,
//     },
//     category: {
//       type: Schema.Types.ObjectId,
//       ref: Category,
//     },
//     imageURL: {
//       type: String,
//     },
//     price: {
//       type: Number,
//     },
//     markup: {
//       type: Number,
//     },
//     status: {
//       type: String,
//       enum: [
//         "draft",
//         "published",
//         "out of stock",
//         "low quantity",
//         "unpublished",
//       ],
//     },
//     attributes: [
//       {
//         name: {
//           type: String,
//         },
//         value: {
//           type: String,
//         },
//         isHighlight: {
//           type: Boolean,
//         },
//         quantity: {
//           type: Number,
//           default: '0',
//         },
//         imageIndex: {
//           type: Number,
//           default: '1',
//         },
//       },
//     ],
//     moreImageURL: [
//       {
//         type: String,
//       },
//     ],
//     isActive: {
//       type: Boolean,
//     },
//     rating: {
//       type: Number,
//     },
//     numberOfReviews: {
//       type: Number,
//     },
//     offer: {
//       type: Number,
//     },
//   },
//   { timestamps: true }
// );

// const Products = mongoose.model("Products", productsSchema);

// module.exports = Products;
