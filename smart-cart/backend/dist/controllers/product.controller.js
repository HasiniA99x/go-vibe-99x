"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const database_service_1 = require("../services/database.service");
const dbService = new database_service_1.DatabaseService();
class ProductController {
    static getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dbService.getAllProducts();
                res.json(result);
            }
            catch (error) {
                console.error('Error fetching products:', error);
                res.status(500).json({ message: 'Error fetching products' });
            }
        });
    }
    static getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield dbService.getProductById(parseInt(id));
                if (!result) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                res.json(result);
            }
            catch (error) {
                console.error('Error fetching product:', error);
                res.status(500).json({ message: 'Error fetching product' });
            }
        });
    }
    static createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, price, stock, image_url } = req.body;
                const result = yield dbService.createProduct({ name, description, price, stock, image_url });
                res.status(201).json(result);
            }
            catch (error) {
                console.error('Error creating product:', error);
                res.status(500).json({ message: 'Error creating product' });
            }
        });
    }
    static updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, description, price, stock, image_url } = req.body;
                const result = yield dbService.updateProduct(parseInt(id), {
                    name,
                    description,
                    price,
                    stock,
                    image_url
                });
                if (!result) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                res.json(result);
            }
            catch (error) {
                console.error('Error updating product:', error);
                res.status(500).json({ message: 'Error updating product' });
            }
        });
    }
    static deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield dbService.deleteProduct(parseInt(id));
                if (!result) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                res.json({ message: 'Product deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting product:', error);
                res.status(500).json({ message: 'Error deleting product' });
            }
        });
    }
}
exports.ProductController = ProductController;
