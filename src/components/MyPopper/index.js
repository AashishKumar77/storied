import React, { useEffect, useRef } from 'react';
const MyPopper = ({children, open, anchorEl, setMouseLeave}) => {
    const styleProp = useRef()
    useEffect(()=>{
        if( anchorEl && styleProp.current ) {
            const bounds = anchorEl.getBoundingClientRect()
            const top = bounds.top+80
            styleProp.current.style.top = 40+"px";
            styleProp.current.style.left = anchorEl.offsetLeft-(styleProp.current.clientWidth/2)+8+"px";
            styleProp.current.style.opacity = 1;
            const calheight = styleProp.current.clientHeight + top + 80
            const windowHeight = window.innerHeight
            if(calheight > windowHeight) {
                setMouseLeave.current = false
                window.scrollTo({
                    top: document.body.scrollHeight || document.documentElement.scrollHeight,
                    behavior: 'smooth'
                });
                setTimeout(()=>setMouseLeave.current = true, 150)
            }
        }
    }, [anchorEl, styleProp])
    return open && <div className="absolute whitespace-nowrap opacity-0 widget-tooltip hidden lg:flex" ref={styleProp}>
        <span className="bg-gray-700 text-white rounded px-2 py-1 whitespace-nowrap">{children}</span>
    </div>
}
export default MyPopper