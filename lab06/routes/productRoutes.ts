import { Router } from "express";
import {
  createNewProduct,
  deleteExistingProduct,
  renderCreateForm,
  renderEditForm,
  renderProductList,
  updateExistingProduct,
  viewProductDetail,
} from "../controller/productController";
import { uploadImage } from "../middleware/upload";

const router = Router();

router.get("/", renderProductList);
router.get("/products/new", renderCreateForm);
router.post("/products", uploadImage.single("url_image"), createNewProduct);
router.get("/products/:id", viewProductDetail);
router.get("/products/:id/edit", renderEditForm);
router.post("/products/:id/edit", uploadImage.single("url_image"), updateExistingProduct);
router.post("/products/:id", uploadImage.single("url_image"), updateExistingProduct);
router.delete("/products/:id", deleteExistingProduct);

export default router;
