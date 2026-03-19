import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createProduct,
  deleteProductById,
  getProductById,
  listProducts,
  Product,
  updateProduct,
} from "../models/productModel";
import { removeLocalFile } from "../utils/file";

interface ProductInput {
  name: string;
  price: number;
  unit_in_stock: number;
  errors: string[];
}

function validateProductInput(body: Request["body"]): ProductInput {
  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  const unitInStock = Number(body.unit_in_stock);
  const errors: string[] = [];

  if (!name) {
    errors.push("Tên sản phẩm là bắt buộc.");
  }

  if (Number.isNaN(price) || price < 0) {
    errors.push("Giá phải là số không âm.");
  }

  if (!Number.isInteger(unitInStock) || unitInStock < 0) {
    errors.push("Số lượng tồn phải là số nguyên không âm.");
  }

  return {
    name,
    price,
    unit_in_stock: unitInStock,
    errors,
  };
}

export async function renderProductList(req: Request, res: Response): Promise<void> {
  const search = String(req.query.search ?? "").trim();
  const products = await listProducts(search);

  res.render("products/index", {
    pageTitle: "Quản lý sản phẩm",
    products,
    search,
  });
}

export function renderCreateForm(_req: Request, res: Response): void {
  res.render("products/new", {
    pageTitle: "Thêm sản phẩm",
    product: {
      name: "",
      price: "",
      unit_in_stock: "",
      url_image: "",
    },
    errors: [],
  });
}

export async function createNewProduct(req: Request, res: Response): Promise<void> {
  const { name, price, unit_in_stock, errors } = validateProductInput(req.body);

  if (errors.length > 0) {
    if (req.file) {
      await removeLocalFile(`/uploads/${req.file.filename}`);
    }

    res.status(400).render("products/new", {
      pageTitle: "Thêm sản phẩm",
      product: {
        name,
        price: req.body.price,
        unit_in_stock: req.body.unit_in_stock,
        url_image: "",
      },
      errors,
    });
    return;
  }

  const product: Product = {
    id: uuidv4(),
    name,
    price,
    unit_in_stock,
    url_image: req.file ? `/uploads/${req.file.filename}` : "",
  };

  await createProduct(product);
  res.redirect("/?success=Thêm sản phẩm thành công");
}

export async function renderEditForm(req: Request, res: Response): Promise<void> {
  const productId = String(req.params.id);
  const product = await getProductById(productId);

  if (!product) {
    res.redirect("/?error=Không tìm thấy sản phẩm");
    return;
  }

  res.render("products/edit", {
    pageTitle: "Cập nhật sản phẩm",
    product,
    errors: [],
  });
}

export async function updateExistingProduct(req: Request, res: Response): Promise<void> {
  const productId = String(req.params.id);
  const existingProduct = await getProductById(productId);

  if (!existingProduct) {
    if (req.file) {
      await removeLocalFile(`/uploads/${req.file.filename}`);
    }

    res.redirect("/?error=Không tìm thấy sản phẩm để cập nhật");
    return;
  }

  const { name, price, unit_in_stock, errors } = validateProductInput(req.body);

  if (errors.length > 0) {
    if (req.file) {
      await removeLocalFile(`/uploads/${req.file.filename}`);
    }

    res.status(400).render("products/edit", {
      pageTitle: "Cập nhật sản phẩm",
      product: {
        ...existingProduct,
        name,
        price: req.body.price,
        unit_in_stock: req.body.unit_in_stock,
      },
      errors,
    });
    return;
  }

  let imageUrl = existingProduct.url_image;

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
    await removeLocalFile(existingProduct.url_image);
  }

  await updateProduct({
    id: existingProduct.id,
    name,
    price,
    unit_in_stock,
    url_image: imageUrl,
  });

  res.redirect("/?success=Cập nhật sản phẩm thành công");
}

export async function deleteExistingProduct(req: Request, res: Response): Promise<void> {
  const productId = String(req.params.id);
  const product = await getProductById(productId);

  if (!product) {
    res.redirect("/?error=Không tìm thấy sản phẩm để xóa");
    return;
  }

  await deleteProductById(product.id);
  await removeLocalFile(product.url_image);

  res.redirect("/?success=Xóa sản phẩm thành công");
}

export async function viewProductDetail(req: Request, res: Response): Promise<void> {
  const productId = String(req.params.id);
  const product = await getProductById(productId);

  if (!product) {
    res.redirect("/?error=Không tìm thấy sản phẩm");
    return;
  }

  res.render("products/detail", {
    pageTitle: "Chi tiết sản phẩm",
    product,
  });
}
