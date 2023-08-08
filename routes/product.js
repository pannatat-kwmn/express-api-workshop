const express = require("express");
const router = express.Router();
const {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  getProductOrder,
  deleteProduct
} = require("../controllers/productController");
const validateToken = require("../middleware/tokenValidation");

//router.use(validateToken);
router.route("/").get(getProducts).post(createProduct);
router.route('/:id/order').get(getProductOrder);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;