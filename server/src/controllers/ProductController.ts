import type { Request, Response } from "express"
import { PrismaClient,ExpenseByCategory, Prisma } from "@prisma/client"


const prisma = new PrismaClient();

export const getProducts = async (req:Request,res:Response): Promise <void>=>{
    try{
        const search = req.query.search ?.toString();
        const Products= await prisma.products.findMany({
            where:{
                name:{
                    contains:search
                }
            }
        })
        res.json(Products);

    } catch (error) {
        res.status(500).json({message:"Error retrieving products"});
    }
};
export const createProduct= async (req:Request, res:Response): Promise<void> =>{
    try {
        const { productId, name, price,rating,stockQuantity}=req.body;
        const product=await prisma.products.create({
            data:{
                productId,
                name,
                price,
                rating,
                stockQuantity,
            }
            
        });
        res.status(201).json(product);
        
    } catch (error) {
        res.status(500).json({message:"Error Creating Product"});
    }
};