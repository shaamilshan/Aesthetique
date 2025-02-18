import React from 'react';
import redbanner from '../../assets/trendskart/home/red-banner.jpg';

const RedBanner = () => {
  return (
    <div>
    <div
  className="relative w-full" // responsive-div class added by me, in index.css
  style={{ height: 'auto' }}
>
  <img
    src={redbanner}
    alt="Red Banner"
    className="w-full object-contain "
    // style={{ transform: 'scale(1.1)' }}
  />
</div>

    </div>
  );
};

export default RedBanner;
