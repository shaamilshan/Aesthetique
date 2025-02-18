import CategoryRadioButton from '@/components/Others/CategoryRadioButton'
import ProductCard from '@/components/Cards/ProductCard'
import React from 'react'

const Collectionsold = () => {
    return(

    
    <div className="flex flex-col md:flex-row min-h-screen mt-10">

      <aside className="w-full hidden md:block md:w-60 bg-white ml-6 p-2 overflow-y-auto py-6">
        <h2 className="text-lg font-Inter">Collection</h2>
        <div className="mt-4 space-y-2">
          <CategoryRadioButton/>
          <CategoryRadioButton/>
          <CategoryRadioButton/>
          <CategoryRadioButton/>
          <CategoryRadioButton/>
          <CategoryRadioButton/>


          
          
        </div>
        <hr className="my-4 border-[#757575]" />
        <h2 className="text-lg font-Inter pt-6">Category</h2>
        <div className="mt-4 space-y-2">
        <CategoryRadioButton/>
        <CategoryRadioButton/>
        <CategoryRadioButton/>
        <CategoryRadioButton/>
        <CategoryRadioButton/>
        <CategoryRadioButton/>
        <CategoryRadioButton/>
        <CategoryRadioButton/>
        <CategoryRadioButton/>


        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-5">
          <h1 className="text-3xl text-[40px] text-[#2C2C2C] ">Collections</h1>
          <div className=" grid  md:grid-cols-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>

          </div>
        </div>
      </main>
    </div>
    )
  
}

export default Collectionsold