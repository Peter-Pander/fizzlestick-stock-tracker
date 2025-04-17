// backend/routes/product.route.js

import express from 'express';
import requireAuth from '../middleware/auth.js';
import multer from 'multer';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// Protect all routes in this router with authentication
router.use(requireAuth);

// Set up Multer to handle multipart/form-data
const upload = multer({ dest: 'uploads/' });

router.get("/", getProducts);

// Multer parses the file and puts it on req.file, then hands off to createProduct
router.post(
  "/",
  upload.single("image"),
  createProduct
);

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
