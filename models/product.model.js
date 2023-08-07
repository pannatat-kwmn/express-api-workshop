const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    _id: { type: Schema.Types.UUID, default: () => mongoose.Types.UUID() },
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        unique: [true, "This product is already exist."],
      },
    productDescription: {
        type: String,
      },
    productPrice: {
        type: Number,
    },
    productStock: Number
},
{ timestamps: true });
module.exports = mongoose.model("Product", productSchema);

