import React from "react";
import BreadCrumbs from "../../Components/BreadCrumbs";
import HomeBannerManager from "./HomeBannerManager";

const Banner = () => {
  return (
    <div className="p-5 w-full overflow-x-auto text-sm">
      <div className="font-semibold">
        <h1 className="font-bold text-2xl">Banner Management</h1>
        <BreadCrumbs list={["Dashboard", "Banner Management"]} />
      </div>

      <HomeBannerManager />
    </div>
  );
};

export default Banner;
