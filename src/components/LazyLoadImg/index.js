import React,{memo} from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Skeleton from '../Skeleton';

const LazyLoadImageComp = ({ image, alt ,src,index ,...props }) => {
    let array = new Uint8Array(1),
    crypt = window.crypto.getRandomValues(array);
    return (<>
    <span className="skeleton w-14 h-14 overflow-hidden rounded-lg absolute left-0 top-0" >
    <Skeleton width={56} height={56} />
    </span>
    <span  className="lazy-load-img">
    <LazyLoadImage
        key={crypt}
         useIntersectionObserver={true}
         threshold={10}
          alt={alt}
          effect="blur"
          src={src}
          {...props}
          />
          </span>
          </>
      );
}
export default memo(LazyLoadImageComp);

