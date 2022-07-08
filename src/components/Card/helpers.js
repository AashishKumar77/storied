import { cardType, getScale } from "../utils";

const { FOCUSED_LIVING, FOCUSED_DECEASED } = cardType;

const MAC = "apple computer, inc.";
let fixedMargin = 48;
let panPopOver = false;
let selectedCard

export const getPanPopOver = () => {
    return panPopOver;
}

export const setPanPopOver = (value) => {
    panPopOver = value
}

export const handlePanActions = (event, handleViewBox,type) => {
    const tree = document.getElementById("maintree");
    if (tree) {
        selectedCard = event && event.currentTarget ? event.currentTarget.getBoundingClientRect() : null;
        const browser = navigator.vendor.toLowerCase();
        setTimeout(() => {
            panPopOver = true;
            const nodeForm = document.getElementById('nodeForm');
            if (nodeForm) {
                const formBounding = nodeForm.getBoundingClientRect();
                // Top is out of viewport
                if (selectedCard && selectedCard.top < 64) {
                    const moveBottom = selectedCard.top - fixedMargin - 64;
                    updateBottomPosition(moveBottom, handleViewBox, browser,type);
                }
                // Left side is out of viewoprt
                if (selectedCard && selectedCard.left < 16) {
                    let moveRight
                    let curscale = getScale(type).scale;
                    curscale =  curscale.substring(curscale.lastIndexOf("(") + 1, curscale.lastIndexOf(")"))
                    if(curscale >=1)
                    {
                        if((type === FOCUSED_LIVING) || (type === FOCUSED_DECEASED))
                            moveRight = selectedCard.left - fixedMargin;
                        else
                            moveRight = selectedCard.left - fixedMargin + 10;
                    }
                    else{
                        if((type === FOCUSED_LIVING) || (type === FOCUSED_DECEASED))
                            moveRight = selectedCard.left - fixedMargin - 20;
                        else
                            moveRight = selectedCard.left - fixedMargin + 30;
                    }
                    updateRightPosition(moveRight, handleViewBox, browser,type);
                }

                const windowHeight = window.innerHeight - 12;
                const clientHeight = document.documentElement.clientHeight - 12;
                // Bottom is out of viewport
                if (formBounding.bottom > (windowHeight || clientHeight)) {
                    const moveTop = windowHeight - formBounding.bottom - fixedMargin;
                    updateTopPosition(moveTop, handleViewBox, browser);
                }
                // Right side is out of viewport
                if (formBounding.right > (window.innerWidth || document.documentElement.clientWidth)) {
                    const moveLeft = window.innerWidth - formBounding.right - fixedMargin;
                    updateLeftPosition(moveLeft, handleViewBox, browser);
                }
            }
        }, 500);
    }
}

export const checkNaN = (value) => {
    return isNaN(Number(value)) ? 0 : Number(value)
}

export const getExistingPosition = (browser) => {
    const maintree = document.getElementById("maintree");
    const scaleval = Number(localStorage.getItem("scaleval")) || 1;
    if(browser === MAC){
        const transform = maintree.getAttribute("style");
        const r1 = transform.replace(/translate/, "");
        const r2 = r1.split("(");
        const r3 = r2[1].split(")");
        const r4 = r2[2].split(")");
        const x = r3[0].replace("px", "");
        const y = r4[0].replace("px", "");
        const popOver = document.getElementById("simple-popover");
        const style = getComputedStyle(popOver);
        return { x, y, scaleval, maintree, popOver, style };
    }else{
        const transform = maintree.getAttribute("transform");
        const r1 = transform.replace(/translate/, "");
        const r2 = r1.replace(/[()]/g, '');
        const r3 = r2.split(' ');
        const x = r3[0].replace(",", "");
        const y = r3[1].replace(",", "");
        const popOver = document.getElementById("simple-popover");
        const style = getComputedStyle(popOver);
        return { x, y, scaleval, maintree, popOver, style };
    }
}

export const updateTopPosition = (moveTop, handleViewBox, browser) => {
    const { x, y, scaleval, maintree, popOver, style } = getExistingPosition(browser);
    const newCordinates = {
        x: checkNaN(x),
        y: checkNaN(y) + moveTop
    }
    const top = Number(style.top.replace(/px/, ""));
    if (maintree && popOver) {
        if(browser === MAC) maintree.setAttribute('style', `transform: translateX(${newCordinates.x}px) translateY(${newCordinates.y}px) translateZ(0) scale(${scaleval})`);
        else maintree.setAttribute('transform', `translate(${newCordinates.x}, ${newCordinates.y}) scale(${scaleval})`);
        popOver.style.top = `${top + moveTop}px`;
        handleViewBox(newCordinates);
    }
}

// Update node position whenLeft side is out of viewoprt
export const updateRightPosition = (moveRight, handleViewBox, browser,type) => {
    const { x, y, scaleval, maintree, popOver } = getExistingPosition(browser);
    const newCordinates = {
        x: checkNaN(x) - moveRight,
        y: checkNaN(y)
    }
    const nodeForm = document.getElementById("nodeForm");
    if (maintree && popOver) {
        if(browser === MAC) maintree.setAttribute('style', `transform: translateX(${newCordinates.x}px) translateY(${newCordinates.y}px) translateZ(0) scale(${scaleval})`);
        else maintree.setAttribute('transform', `translate(${newCordinates.x}, ${newCordinates.y}) scale(${scaleval})`);
        if((type === FOCUSED_LIVING) || (type === FOCUSED_DECEASED))
        {
            setTimeout(() => {
                switch(true){
                case(scaleval >= 1 && scaleval <1.5):
                    nodeForm.style.left = `${32}px`;
                    break;
                case(scaleval >= 1.5 && scaleval <=2):
                    nodeForm.style.left = `${18}px`;
                    break;
                case(scaleval > 0.5 && scaleval < 1):
                    nodeForm.style.left = `${70}px`;
                    break;
                default:
                    nodeForm.style.left = `${100}px`;
                    break;
                }
                
            }, 50);
        }
        else{
            setTimeout(() => {
                switch(true){
                case(scaleval >= 1 && scaleval <1.5):
                    nodeForm.style.left = `${20}px`;
                    break;
                case(scaleval >= 1.5 && scaleval <=2):
                    nodeForm.style.left = `${13}px`;
                    break;
                default:
                    nodeForm.style.left = `${4}px`;
                    break;
                }
                
            }, 50);
            
        }
        handleViewBox(newCordinates);
    }
}

export const updateBottomPosition = (moveBottom, handleViewBox, browser, type) => {
    const { x, y, scaleval, maintree, popOver} = getExistingPosition(browser);
    const newCordinates = {
        x: checkNaN(x),
        y: checkNaN(y) - moveBottom
    }
    if (maintree && popOver) {
        const nodeForm = document.getElementById("nodeForm");
        if(browser === MAC) maintree.setAttribute('style', `transform: translateX(${newCordinates.x}px) translateY(${newCordinates.y}px) translateZ(0) scale(${scaleval})`);
        else maintree.setAttribute('transform', `translate(${newCordinates.x}, ${newCordinates.y}) scale(${scaleval})`);
        
        if((type === FOCUSED_LIVING) || (type === FOCUSED_DECEASED))
        {
            
            setTimeout(() => {
                switch(true){
                    case(scaleval === 1.0):
                        nodeForm.style.top = `${96}px`;
                        break;
                    case(scaleval > 1 && scaleval <=1.75):
                        nodeForm.style.top = `${70}px`;
                        break;
                    case(scaleval > 1.75 && scaleval <=2):
                        nodeForm.style.top = `${48}px`;
                        break;
                    case(scaleval >=0.75 && scaleval < 1):
                        nodeForm.style.top = `${108}px`;
                        break;
                    case(scaleval >= 0.25 && scaleval < 0.75):
                        nodeForm.style.top = `${122}px`;
                        break;
                }
            }, 50);
        }
        else{
            setTimeout(() => {
                switch(true){
                case(scaleval === 1.0):
                    nodeForm.style.top = `${70}px`;
                    break;
                case(scaleval > 1 && scaleval <=1.75):
                    nodeForm.style.top = `${48}px`;
                    break;
                case(scaleval > 1.75 && scaleval <=2):
                    nodeForm.style.top = `${48}px`;
                    break;
                case(scaleval >=0.75 && scaleval < 1):
                    nodeForm.style.top = `${83}px`;
                    break;
                case(scaleval >= 0.25 && scaleval < 0.75):
                    nodeForm.style.top = `${104}px`;
                    break;
                }
            }, 50);
        }
        handleViewBox(newCordinates);
    }
}

export const updateLeftPosition = (moveLeft, handleViewBox, browser) => {
    const { x, y, scaleval, maintree, popOver, style } = getExistingPosition(browser);
    const newCordinates = {
        x: checkNaN(x) + moveLeft,
        y: checkNaN(y)
    }
    const left = Number(style.left.replace(/px/, ""));
    if (maintree && popOver) {
        if(browser === MAC) maintree.setAttribute('style', `transform: translateX(${newCordinates.x}px) translateY(${newCordinates.y}px) translateZ(0) scale(${scaleval})`);
        else maintree.setAttribute('transform', `translate(${newCordinates.x}, ${newCordinates.y}) scale(${scaleval})`);
        popOver.style.left = `${left + moveLeft}px`;
        handleViewBox(newCordinates);
    }
}