import React, { useRef, useEffect } from "react";

function useOutSideDetector(ref, handleNameBlur) {
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handleNameBlur();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default function OutSideDetector(props) {
    const wrapperRef = useRef(null);
    useOutSideDetector(wrapperRef, props.handleNameBlur);
    return <div ref={wrapperRef}>{props.children}</div>;
}