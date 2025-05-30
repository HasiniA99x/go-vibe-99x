import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';

const dbService = new DatabaseService();

export class ProductController {
    static async getAllProducts(req: Request, res: Response) {
        try {
            const result = await dbService.getAllProducts();
            res.json(result);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Error fetching products' });
        }
    }

    static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await dbService.getProductById(parseInt(id));
            
            if (!result) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json(result);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ message: 'Error fetching product' });
        }
    }

    static async createProduct(req: Request, res: Response) {
        try {
            const { name, description, price, stock, image_url } = req.body;
            const result = await dbService.createProduct({ name, description, price, stock, image_url });
            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ message: 'Error creating product' });
        }
    }

    static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, price, stock, image_url } = req.body;
            
            const result = await dbService.updateProduct(parseInt(id), {
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
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Error updating product' });
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await dbService.deleteProduct(parseInt(id));

            if (!result) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Error deleting product' });
        }
    }
} 