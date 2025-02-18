import { Button } from "@/components/ui/button";
import React from "react";

const ProductCard4 = () => {
  return (
    <div
      className="w-[417px] h-[533px] flex flex-col rounded-2xl w-[22%] py-10 ml-8  bg-cover items-center justify-end"
      style={{
        backgroundImage:
          "url(https://s3-alpha-sig.figma.com/img/af51/5951/4f7ef2c9539805cc4981173ea0609a93?Expires=1717977600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RYtpJGUNcpDkGAl1H4v5bcz1fxY1GLdxALII1wMgavkM~Lj46iCnrkewED4Zrx08slNtjGBNw4ZKVD9c44FO-2f81yPq~WcX2R9jfLKAJTGbIl4Me32kY3O317r0GgEMt9Tz3hoNEZxhafiPJI7dk3~pfFLrwwI3VTII-nngO67K3uIsaib7oqZIOcAj~LYPCbu2bY--wOkEMvotR~wEBFeUyEDMsEIIEgFOiEvG9bzfyxqSvBtYz5urExCKWWb3BHJtuXwgV8t9Rt2mY2cz~wU515D6BzcL1i~isDxHX0UHGiN6XNQMLcKTx7IQFBSivGpjxOl8vgcMPBTvBWcDPA__)",
      }}
    >
      <div className="flex justify-center items-center flex-col"> 
        <h1 className="text-[30px] text-white"> Explore below 7999</h1>{" "}
        <Button className="bg-[#CC4254] mt-3 w-[158px] h-[54px] rounded-[27px] font-Inter text-[20px] text-white  ">
          Explore now
        </Button>
      </div>
    </div>
  );
};

export default ProductCard4;