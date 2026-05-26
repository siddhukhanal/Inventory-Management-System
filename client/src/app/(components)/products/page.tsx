"use client"
import { useCreateProductMutation, useGetProductsQuery } from '@/src/state/api';
import { PlusCircle, PlusCircleIcon, SearchIcon } from 'lucide-react';
import React, { useState } from 'react'
import Header from '@/src/app/(components)/Header';
import Rating from '@/src/app/(components)/Rating';
import CreateProductModal from './CreateProductModal';


type ProductFormData = {
  name:string;
  price:number;
  stockQuantity:number;
  rating:number;

}

const Products = () => {
    const [searchTerm,setSearchTerm]= useState("");
    const [isModalOpen,setIsModalOpen]=useState(false);

    const{
      data:products, 
      isLoading, 
      isError,
    } =useGetProductsQuery(searchTerm);

    const [createProduct]=useCreateProductMutation();
    const handleCreateProduct= async (productData:ProductFormData)=>{
      await createProduct(productData);
    }



    if(isLoading){
        return <div className="py-4">Loading...</div>
    }

    if (isError || !products){
        return(
            <div className="text-center text-red-500 py-4">
                Failed to fetch products
            </div>
        )
    }
    

  return (
    <div className="mx-auto pb-5 w-full">
      {/**Search Bar */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2"/>
          <input className="w-full py-2 px-4 rounded bg-white" placeholder="Seach Proucts ...." value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}></input>
        </div>
      </div>
      {/**Header bar */}
      <div className="flex justify-between items-center mb-6">
        <Header
        name="Products  "
        />
        <button
        className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold
        py-2 px-4 rounded"
        onClick={()=>setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Products

        </button>
      </div>
      {/*Body products list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 justify-between">
        {isLoading ? (<div>Loading...</div>): (
          products?.map((product)=>(
            <div key={product.productId} className="border shadow rounded-md p-4 max-w-full w-full mx-auto">
              <div className="flex flex-col items-center">
                img
                <h3 className="text-lg text-gray-900 font-semibold">{product.name}</h3>
                <p className="text-gray-800">${product.price.toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  Stock:{product.stockQuantity}
                </div>
                {product.rating && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating}/>
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>
      {/**Modal */}
      <CreateProductModal 
      isOpen={isModalOpen} 
      onClose={()=>setIsModalOpen(false)}
      onCreate={handleCreateProduct}/>

    </div>
  )
}

export default Products
