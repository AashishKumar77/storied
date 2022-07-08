import React from "react";
import PropTypes from "prop-types";
import "./index.css";

// Utils
import { iconsList } from "../utils";
let crypt;
const Icon = ({ type, id, size, color, background, disabled, handleClick }) => {
  const getIconSize = () => {
    switch (size) {
      case "small":
        return "icon-small";
      case "medium":
        return "icon-medium";
      case "large":
        return "icon-large";
      default:
        return "";
    }
  };

  const iconSize = getIconSize();

  const bgColor = background ? "icon-bgColor" : "";

  const iconDisable = disabled ? "icon-disable" : "";

  const getIconColor = () => {
    switch (color) {
      case "default":
        return "#999999";
      case "primary":
        return "#295DA1";
      case "secondary":
        return "#212122";
      case "danger":
        return "#B02A4C";
      case "white":
        return "#FFFFFF";
      default:
        return "";
    }
  };

  const iconColor = getIconColor();

  const icons = {
    "minus":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M1 7L13 7" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </svg>,
    "aim":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M2.500 7.000 A4.500 4.500 0 1 0 11.500 7.000 A4.500 4.500 0 1 0 2.500 7.000 Z" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M6.500 7.000 A0.500 0.500 0 1 0 7.500 7.000 A0.500 0.500 0 1 0 6.500 7.000 Z" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M7 2.5L7 0.5" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M7 13.5L7 11.5" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M11.5 7L13.5 7" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M0.5 7L2.5 7" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </svg>,
    "delete":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M12.5 1.5L1.5 12.5" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M1.5 1.5L12.5 12.5" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </svg>,
    "family":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M2.750 3.250 A2.250 2.250 0 1 0 7.250 3.250 A2.250 2.250 0 1 0 2.750 3.250 Z" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M9.5,13H.5V11.5a4.5,4.5,0,0,1,9,0Z" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M8.48,1.06A2.284,2.284,0,0,1,9,1,2.25,2.25,0,0,1,9,5.5a2.292,2.292,0,0,1-.48-.051" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M9.976,7.106A4.5,4.5,0,0,1,13.5,11.5V13h-2" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </svg>,
    "plus":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M7 1L7 13" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M1 7L13 7" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </svg>,
    "upload":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M.5,10.5v1a2,2,0,0,0,2,2h9a2,2,0,0,0,2-2v-1" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M4 4L7 0.5 10 4" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M7 0.5L7 9.5" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </svg>,
    "user-single":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M3.500 3.500 A3.500 3.500 0 1 0 10.500 3.500 A3.500 3.500 0 1 0 3.500 3.500 Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
          <path d="M13.278,13.333a6.659,6.659,0,0,0-12.556,0A.5.5,0,0,0,1.193,14H12.807a.5.5,0,0,0,.471-.667Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
        </g>
      </svg>,
    "dashboard":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M4.000 7.000 A3.000 3.000 0 1 0 10.000 7.000 A3.000 3.000 0 1 0 4.000 7.000 Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
          <path d="M1,5A1,1,0,0,1,0,4V2A2,2,0,0,1,2,0H4A1,1,0,0,1,4,2H2V4A1,1,0,0,1,1,5Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
          <path d="M13,5a1,1,0,0,1-1-1V2H10a1,1,0,0,1,0-2h2a2,2,0,0,1,2,2V4A1,1,0,0,1,13,5Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
          <path d="M4,14H2a2,2,0,0,1-2-2V10a1,1,0,0,1,2,0v2H4a1,1,0,0,1,0,2Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
          <path d="M12,14H10a1,1,0,0,1,0-2h2V10a1,1,0,0,1,2,0v2A2,2,0,0,1,12,14Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
        </g>
      </svg>,
    "edit":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M11.75,12.493H.75a.75.75,0,0,0,0,1.5h11a.75.75,0,0,0,0-1.5Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
          <path d="M13.561,1.493,12.5.432a1.537,1.537,0,0,0-2.121,0L3.671,7.139a.5.5,0,0,0-.138.267L3,10.411A.5.5,0,0,0,3.5,11a.433.433,0,0,0,.087-.008l3.005-.53a.5.5,0,0,0,.267-.139l6.707-6.707a1.5,1.5,0,0,0,0-2.121Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
        </g>
      </svg>,

    "add-circle":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M7,0a7,7,0,1,0,7,7A7.008,7.008,0,0,0,7,0Zm3,8H8v2a1,1,0,0,1-2,0V8H4A1,1,0,0,1,4,6H6V4A1,1,0,0,1,8,4V6h2a1,1,0,0,1,0,2Z" fill="#000000" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="0"></path>
        </g>
      </svg>,

    "search":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M0.500 5.917 A5.417 5.417 0 1 0 11.334 5.917 A5.417 5.417 0 1 0 0.500 5.917 Z" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M13.5 13.5L9.747 9.747" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </svg>,

    "plant":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 140 140">
        <g transform="matrix(5.833333333333333,0,0,5.833333333333333,0,0)">
          <path d="M10.653,8.984s-1.53,2.62-3.75,2.25c-4.5-.75-3.75-6.75-5.25-9a9.947,9.947,0,0,1,9,.75C12.9,4.484,12.9,6.734,10.653,8.984Z" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          <path d="M15.575,11.182S16.638,13,18.18,12.745c3.125-.521,2.6-4.688,3.646-6.251a6.913,6.913,0,0,0-6.251.521C14.013,8.057,14.013,9.62,15.575,11.182Z" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          <path d="M7.653,5.984s4.5,2.25,5.25,9.75c1.5-4.5,3.75-6,3.75-6" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          <path d="M16.038,23.234H9.768a.75.75,0,0,1-.735-.6l-1.2-6a.75.75,0,0,1,.735-.9h8.67a.75.75,0,0,1,.736.9l-1.2,6A.751.751,0,0,1,16.038,23.234Z" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
        </g>
      </svg>,
    "file":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(1.1428571428571428,0,0,1.1428571428571428,0,0)">
          <path d="M12.5,12.5a1,1,0,0,1-1,1h-9a1,1,0,0,1-1-1V1.5a1,1,0,0,1,1-1h5l5,5Z" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M7.5 0.5L7.5 5.5 12.5 5.5" fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
      </svg>,

    "tree":
      <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5 16.4987C10.9477 16.4987 10.5 16.0509 10.5 15.4987V12.4987C10.5 11.9464 10.9477 11.4987 11.5 11.4987H15.5C16.0523 11.4987 16.5 11.9464 16.5 12.4987V15.4987C16.5 16.0509 16.0523 16.4987 15.5 16.4987H11.5Z" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 11.4987C1.94772 11.4987 1.5 11.0509 1.5 10.4987L1.5 7.49866C1.5 6.94637 1.94772 6.49866 2.5 6.49866H6.5C7.05228 6.49866 7.5 6.94637 7.5 7.49866V10.4987C7.5 11.0509 7.05228 11.4987 6.5 11.4987H2.5Z" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.5 6.49866C10.9477 6.49866 10.5 6.05094 10.5 5.49866V2.49866C10.5 1.94637 10.9477 1.49866 11.5 1.49866H15.5C16.0523 1.49866 16.5 1.94637 16.5 2.49866V5.49866C16.5 6.05094 16.0523 6.49866 15.5 6.49866H11.5Z" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9L13 8.99866" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 7V11" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>,

    "downArrow":
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" svgjs="https://svgjs.com/svgjs" viewBox="0 0 16 16">
        <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
          <path d="M23.25,7.311,12.53,18.03a.749.749,0,0,1-1.06,0L.75,7.311" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
        </g>
      </svg>,
    "upArrow":
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
          <path d="M.75,17.189,11.47,6.47a.749.749,0,0,1,1.06,0L23.25,17.189" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
        </g>
      </svg>,
    "addPhoto":
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 0.999969H22.6424V23.4092H1V0.999969Z" fill="white" stroke={iconColor} strokeLinejoin="round" />
        <path d="M3.59644 3.58505H20.045V18.238H3.59644V3.58505Z" fill={iconColor} />
        <path d="M3.59644 3.58505H20.045V18.238H3.59644V3.58505Z" stroke={iconColor} strokeLinejoin="round" />
        <path d="M17.5171 18.2258C17.0578 16.9313 16.2393 15.8165 15.1707 15.0297C14.1021 14.2429 12.8339 13.8215 11.5349 13.8215C10.2359 13.8215 8.96773 14.2429 7.8991 15.0297C6.83046 15.8165 6.01204 16.9313 5.55273 18.2258H17.5171Z" fill="white" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8.64966" y="6.70114" width="5.89808" height="5.87235" rx="2.93618" fill="white" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" />
      </svg>,
    "uploadFile":
      <svg viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.00001 24.4282C0.999943 24.5033 1.01491 24.5776 1.04406 24.647C1.0732 24.7164 1.11595 24.7794 1.16986 24.8325C1.22378 24.8856 1.28779 24.9277 1.35826 24.9565C1.42872 24.9852 1.50425 25 1.58052 25H18.4194C18.4957 25 18.5712 24.9852 18.6417 24.9565C18.7121 24.9277 18.7762 24.8856 18.8301 24.8325C18.884 24.7794 18.9267 24.7164 18.9559 24.647C18.985 24.5776 19 24.5033 18.9999 24.4282V5.85742L14.0646 1H1.58052C1.50425 1 1.42872 1.01479 1.35826 1.04353C1.28779 1.07227 1.22378 1.1144 1.16986 1.1675C1.11595 1.2206 1.0732 1.28363 1.04406 1.353C1.01491 1.42237 0.999943 1.49671 1.00001 1.57178V24.4282Z" fill="white" stroke={iconColor} strokeLinecap="round" stroke-linejoin="round" />
        <path d="M19 5.85742H14.6067C14.4629 5.85742 14.3251 5.80122 14.2234 5.70117C14.1217 5.60113 14.0646 5.46544 14.0646 5.32396V1L19 5.85742Z" fill={iconColor} stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.31062 8.28125H11.5346" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.31062 11.4409H15.5479" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.31062 15.2485H15.9791" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.31062 18.8857H15.9791" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" />
      </svg>,

    "uploadFileError":
      <svg viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 56C0 70.8521 5.89998 85.0959 16.402 95.598C26.9041 106.1 41.1479 112 56 112C70.8521 112 85.0959 106.1 95.598 95.598C106.1 85.0959 112 70.8521 112 56C112 41.1479 106.1 26.9041 95.598 16.402C85.0959 5.89998 70.8521 0 56 0C41.1479 0 26.9041 5.89998 16.402 16.402C5.89998 26.9041 0 41.1479 0 56Z" fill="#F7CED8" fill-opacity="0.5" />
        <path d="M40.3885 99.2642C40.3885 99.9047 42.2544 100.519 45.5757 100.972C48.897 101.425 53.4016 101.679 58.0986 101.679C62.7955 101.679 67.3001 101.425 70.6214 100.972C73.9427 100.519 75.8086 99.9047 75.8086 99.2642C75.8086 98.6237 73.9427 98.0094 70.6214 97.5565C67.3001 97.1036 62.7955 96.8492 58.0986 96.8492C53.4016 96.8492 48.897 97.1036 45.5757 97.5565C42.2544 98.0094 40.3885 98.6237 40.3885 99.2642Z" fill="#F7CED8" />
        <path d="M29.7933 84.2282C29.7926 84.4552 29.8367 84.6802 29.923 84.8902C30.0093 85.1002 30.1362 85.291 30.2965 85.4519C30.4567 85.6128 30.6471 85.7405 30.8567 85.8276C31.0663 85.9148 31.2911 85.9598 31.5181 85.96H81.5303C81.9877 85.9596 82.4262 85.7778 82.7496 85.4544C83.0729 85.131 83.2548 84.6925 83.2551 84.2352V28.1792L68.5999 13.5212H31.5181C31.0607 13.5212 30.622 13.7029 30.2985 14.0264C29.9751 14.3498 29.7933 14.7885 29.7933 15.246V84.2282Z" fill="white" stroke="#DF3962" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36.3271 32.921H76.5771V71.561H36.3271V32.921Z" fill="#F7CED8" stroke="#DF3962" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M45.066 47.7512C45.066 49.037 45.5768 50.2702 46.486 51.1794C47.3953 52.0886 48.6284 52.5994 49.9142 52.5994C51.2001 52.5994 52.4332 52.0886 53.3424 51.1794C54.2517 50.2702 54.7624 49.037 54.7624 47.7512C54.7624 46.4654 54.2517 45.2322 53.3424 44.323C52.4332 43.4138 51.2001 42.903 49.9142 42.903C48.6284 42.903 47.3953 43.4138 46.486 44.323C45.5768 45.2322 45.066 46.4654 45.066 47.7512Z" fill="white" stroke="#DF3962" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M76.5799 63.84V68.3354C76.5799 69.1894 76.2407 70.0084 75.6368 70.6123C75.033 71.2162 74.2139 71.5554 73.3599 71.5554H39.5471C38.6932 71.5554 37.8741 71.2162 37.2703 70.6123C36.6664 70.0084 36.3271 69.1894 36.3271 68.3354V65.2988L44.5787 58.0762C45.0395 57.6668 45.6399 57.45 46.2559 57.4709C46.8719 57.4917 47.4564 57.7485 47.8883 58.1882L51.1993 61.5006C51.5013 61.8024 51.9107 61.9719 52.3375 61.9719C52.7644 61.9719 53.1738 61.8024 53.4757 61.5006L63.6957 51.2806C63.9389 51.0343 64.2332 50.8445 64.5579 50.7247C64.8826 50.6049 65.2297 50.5581 65.5745 50.5876C65.9221 50.6051 66.2613 50.7007 66.5669 50.8672C66.8725 51.0337 67.1367 51.2669 67.3399 51.5494L76.5799 63.84Z" fill="white" stroke="#DF3962" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M83.2552 28.1792H70.2058C69.7795 28.1781 69.3711 28.0079 69.07 27.7061C68.769 27.4043 68.6 26.9955 68.6 26.5692V13.5212L83.2552 28.1792Z" fill="#F7CED8" stroke="#DF3962" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>,

    "errorImg":
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 0C6.41775 0 4.87104 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346633 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9976 5.87901 15.154 3.84559 13.6542 2.34582C12.1544 0.846052 10.121 0.00241984 8 0V0ZM7.14286 4C7.14286 3.77267 7.23317 3.55465 7.39391 3.39391C7.55466 3.23316 7.77268 3.14286 8 3.14286C8.22733 3.14286 8.44535 3.23316 8.6061 3.39391C8.76684 3.55465 8.85715 3.77267 8.85715 4V7.42857C8.85715 7.6559 8.76684 7.87392 8.6061 8.03466C8.44535 8.19541 8.22733 8.28572 8 8.28572C7.77268 8.28572 7.55466 8.19541 7.39391 8.03466C7.23317 7.87392 7.14286 7.6559 7.14286 7.42857V4ZM8 12.5714C7.77397 12.5714 7.55301 12.5044 7.36507 12.3788C7.17712 12.2532 7.03064 12.0748 6.94414 11.8659C6.85764 11.6571 6.83501 11.4273 6.87911 11.2056C6.9232 10.9839 7.03205 10.7803 7.19188 10.6205C7.35171 10.4606 7.55535 10.3518 7.77704 10.3077C7.99874 10.2636 8.22853 10.2862 8.43736 10.3727C8.64619 10.4592 8.82468 10.6057 8.95026 10.7936C9.07583 10.9816 9.14286 11.2025 9.14286 11.4286C9.14286 11.7317 9.02245 12.0224 8.80813 12.2367C8.5938 12.451 8.30311 12.5714 8 12.5714Z"
          fill="#B02A4C"
        />
      </svg>,

    "home":
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.5 9.29248V14.7925H7.5V10.7925C7.5 10.5273 7.60536 10.2729 7.79289 10.0854C7.98043 9.89784 8.23478 9.79248 8.5 9.79248H9.5C9.76522 9.79248 10.0196 9.89784 10.2071 10.0854C10.3946 10.2729 10.5 10.5273 10.5 10.7925V14.7925H14.5V9.29248" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.5 8.29257L8.29267 1.49991C8.38553 1.40698 8.4958 1.33326 8.61717 1.28297C8.73854 1.23267 8.86862 1.20679 9 1.20679C9.13138 1.20679 9.26146 1.23267 9.38283 1.28297C9.5042 1.33326 9.61447 1.40698 9.70733 1.49991L16.5 8.29257" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3.79248V2.79248H14.5V6.29248" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 14.7925H16" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>,

    "hamburger":
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 14" stroke="currentColor" aria-hidden="true">
        <path d="M1.25 13.003H20.75" stroke="#212122" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.25 7.00299H20.75" stroke="#212122" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.25 1.00299H20.75" stroke="#212122" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>,
    "camera":
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 8.5C6 8.95963 6.09053 9.41475 6.26642 9.83939C6.44231 10.264 6.70012 10.6499 7.02513 10.9749C7.35013 11.2999 7.73597 11.5577 8.16061 11.7336C8.58525 11.9095 9.04037 12 9.5 12C9.95963 12 10.4148 11.9095 10.8394 11.7336C11.264 11.5577 11.6499 11.2999 11.9749 10.9749C12.2999 10.6499 12.5577 10.264 12.7336 9.83939C12.9095 9.41475 13 8.95963 13 8.5C13 8.04037 12.9095 7.58525 12.7336 7.16061C12.5577 6.73597 12.2999 6.35013 11.9749 6.02513C11.6499 5.70012 11.264 5.44231 10.8394 5.26642C10.4148 5.09053 9.95963 5 9.5 5C9.04037 5 8.58525 5.09053 8.16061 5.26642C7.73597 5.44231 7.35013 5.70012 7.02513 6.02513C6.70012 6.35013 6.44231 6.73597 6.26642 7.16061C6.09053 7.58525 6 8.04037 6 8.5V8.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13 4L12.2767 2.55267C12.1936 2.38655 12.0659 2.24685 11.9078 2.14924C11.7498 2.05162 11.5677 1.99994 11.382 2H7.618C7.43226 1.99994 7.25017 2.05162 7.09215 2.14924C6.93413 2.24685 6.80642 2.38655 6.72333 2.55267L6 4H1.5C1.23478 4 0.98043 4.10536 0.792893 4.29289C0.605357 4.48043 0.5 4.73478 0.5 5V13C0.5 13.2652 0.605357 13.5196 0.792893 13.7071C0.98043 13.8946 1.23478 14 1.5 14H14.5C14.7652 14 15.0196 13.8946 15.2071 13.7071C15.3946 13.5196 15.5 13.2652 15.5 13V5C15.5 4.73478 15.3946 4.48043 15.2071 4.29289C15.0196 4.10536 14.7652 4 14.5 4H13Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M2.75 6C2.79945 6 2.84778 6.01466 2.88889 6.04213C2.93 6.0696 2.96205 6.10865 2.98097 6.15433C2.99989 6.20001 3.00484 6.25028 2.9952 6.29877C2.98555 6.34727 2.96174 6.39181 2.92678 6.42678C2.89181 6.46174 2.84727 6.48555 2.79877 6.4952C2.75028 6.50484 2.70001 6.49989 2.65433 6.48097C2.60865 6.46205 2.5696 6.43 2.54213 6.38889C2.51466 6.34778 2.5 6.29945 2.5 6.25C2.5 6.1837 2.52634 6.12011 2.57322 6.07322C2.62011 6.02634 2.6837 6 2.75 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3.5 4V3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
    "menuHorizontal":
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.7413 9.75195C14.2055 9.75195 14.6506 9.56758 14.9788 9.23939C15.307 8.9112 15.4913 8.46608 15.4913 8.00195C15.4913 7.53782 15.307 7.09271 14.9788 6.76452C14.6506 6.43633 14.2055 6.25195 13.7413 6.25195C13.2772 6.25195 12.8321 6.43633 12.5039 6.76452C12.1757 7.09271 11.9913 7.53782 11.9913 8.00195C11.9913 8.46608 12.1757 8.9112 12.5039 9.23939C12.8321 9.56758 13.2772 9.75195 13.7413 9.75195Z" fill="currentColor" />
        <path d="M2.24133 9.75195C2.70546 9.75195 3.15058 9.56758 3.47877 9.23939C3.80696 8.9112 3.99133 8.46608 3.99133 8.00195C3.99133 7.53782 3.80696 7.09271 3.47877 6.76452C3.15058 6.43633 2.70546 6.25195 2.24133 6.25195C1.7772 6.25195 1.33208 6.43633 1.0039 6.76452C0.675708 7.09271 0.491333 7.53782 0.491333 8.00195C0.491333 8.46608 0.675708 8.9112 1.0039 9.23939C1.33208 9.56758 1.7772 9.75195 2.24133 9.75195Z" fill="currentColor" />
        <path d="M7.99133 9.75195C8.45546 9.75195 8.90058 9.56758 9.22877 9.23939C9.55696 8.9112 9.74133 8.46608 9.74133 8.00195C9.74133 7.53782 9.55696 7.09271 9.22877 6.76452C8.90058 6.43633 8.45546 6.25195 7.99133 6.25195C7.5272 6.25195 7.08208 6.43633 6.7539 6.76452C6.42571 7.09271 6.24133 7.53782 6.24133 8.00195C6.24133 8.46608 6.42571 8.9112 6.7539 9.23939C7.08208 9.56758 7.5272 9.75195 7.99133 9.75195Z" fill="currentColor" />
      </svg>,

    "arrowLeft":
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 8L1.5 8" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8.5 1L1.5 8L8.5 15" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
    "profile-circle":
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.99999 11.4285C11.9724 11.4285 13.5714 9.82952 13.5714 7.85707C13.5714 5.88463 11.9724 4.28564 9.99999 4.28564C8.02755 4.28564 6.42857 5.88463 6.42857 7.85707C6.42857 9.82952 8.02755 11.4285 9.99999 11.4285Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3.89998 17C4.53747 15.9536 5.43342 15.0888 6.50171 14.4887C7.56999 13.8886 8.77469 13.5734 9.99998 13.5734C11.2253 13.5734 12.43 13.8886 13.4983 14.4887C14.5665 15.0888 15.4625 15.9536 16.1 17" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10 19.2857C15.1284 19.2857 19.2857 15.1283 19.2857 9.99995C19.2857 4.87159 15.1284 0.714233 10 0.714233C4.87165 0.714233 0.71429 4.87159 0.71429 9.99995C0.71429 15.1283 4.87165 19.2857 10 19.2857Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
    "card":
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.125 1.125H1.875C1.18464 1.125 0.625 1.68464 0.625 2.375V13.625C0.625 14.3154 1.18464 14.875 1.875 14.875H18.125C18.8154 14.875 19.375 14.3154 19.375 13.625V2.375C19.375 1.68464 18.8154 1.125 18.125 1.125Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M0.625 4.875H19.375" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.375 8.625H11.25" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.375 11.125H8.75" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
    "privacy":
      <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.625 8.875H2.375C1.68464 8.875 1.125 9.43464 1.125 10.125V18.875C1.125 19.5654 1.68464 20.125 2.375 20.125H13.625C14.3154 20.125 14.875 19.5654 14.875 18.875V10.125C14.875 9.43464 14.3154 8.875 13.625 8.875Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3.625 8.875V5.75C3.625 4.58968 4.08594 3.47688 4.90641 2.65641C5.72688 1.83594 6.83968 1.375 8 1.375C9.16032 1.375 10.2731 1.83594 11.0936 2.65641C11.9141 3.47688 12.375 4.58968 12.375 5.75V8.875" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8 14.99C9.03553 14.99 9.875 14.1505 9.875 13.115C9.875 12.0795 9.03553 11.24 8 11.24C6.96447 11.24 6.125 12.0795 6.125 13.115C6.125 14.1505 6.96447 14.99 8 14.99Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.2083 18.1325C10.9949 17.4543 10.5716 16.8613 9.99944 16.4391C9.4273 16.017 8.73588 15.7874 8.02485 15.7835C7.31382 15.7796 6.61993 16.0016 6.04319 16.4175C5.46646 16.8334 5.03669 17.4216 4.81583 18.0975" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
    "envolope":
      <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.25 0.958374H18.75V13.4584H1.25V0.958374Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M18.4675 1.41675L11.6808 6.63675C11.1989 7.00746 10.608 7.20846 10 7.20846C9.39201 7.20846 8.80107 7.00746 8.31917 6.63675L1.5325 1.41675" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
    "trees":
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.875 20.3733C12.3227 20.3733 11.875 19.9256 11.875 19.3733V15.1233C11.875 14.571 12.3227 14.1233 12.875 14.1233H18.375C18.9273 14.1233 19.375 14.571 19.375 15.1233V19.3733C19.375 19.9256 18.9273 20.3733 18.375 20.3733H12.875Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M1.625 14.1233C1.07272 14.1233 0.625 13.6756 0.625 13.1233L0.625 8.87329C0.625 8.32101 1.07272 7.87329 1.625 7.87329H7.125C7.67728 7.87329 8.125 8.32101 8.125 8.87329V13.1233C8.125 13.6756 7.67728 14.1233 7.125 14.1233H1.625Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12.875 7.87329C12.3227 7.87329 11.875 7.42558 11.875 6.87329V2.62329C11.875 2.07101 12.3227 1.62329 12.875 1.62329H18.375C18.9273 1.62329 19.375 2.07101 19.375 2.62329V6.87329C19.375 7.42558 18.9273 7.87329 18.375 7.87329H12.875Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8.75 11L15 10.9983" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15 8.5V13.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
    "trash":
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 3H15" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.5 1H6.5C6.23478 1 5.98043 1.10536 5.79289 1.29289C5.60536 1.48043 5.5 1.73478 5.5 2V3H10.5V2C10.5 1.73478 10.3946 1.48043 10.2071 1.29289C10.0196 1.10536 9.76522 1 9.5 1Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.5 11.5V6.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.5 11.5V6.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12.5767 14.0827C12.5559 14.3327 12.4419 14.5659 12.2573 14.7358C12.0727 14.9057 11.8309 15 11.58 15H4.42067C4.16975 15 3.92798 14.9057 3.74336 14.7358C3.55874 14.5659 3.44474 14.3327 3.424 14.0827L2.5 3H13.5L12.5767 14.0827Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
    "rightArrow":
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.50006 3.75L13.4556 9.70556C13.4943 9.7442 13.525 9.7901 13.546 9.84062C13.5669 9.89115 13.5777 9.94531 13.5777 10C13.5777 10.0547 13.5669 10.1089 13.546 10.1594C13.525 10.2099 13.4943 10.2558 13.4556 10.2944L7.50006 16.25" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>,
    "leftArrow":
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5776 16.25L7.62209 10.2944C7.58338 10.2558 7.55268 10.2099 7.53173 10.1594C7.51078 10.1089 7.5 10.0547 7.5 10C7.5 9.94531 7.51078 9.89115 7.53173 9.84062C7.55268 9.7901 7.58338 9.7442 7.62209 9.70556L13.5776 3.75" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
  }

  let array = new Uint8Array(1);
  crypt = window.crypto.getRandomValues(array);

  return (
    <div id={id} className={`icon ${iconSize} ${bgColor} ${iconDisable}`} onClick={!disabled ? handleClick : undefined}>
      {icons[type] || icons["plus"]}
    </div>
  );
};

Icon.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf(iconsList),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["default", "primary", "secondary", "danger", "white"]),
  background: PropTypes.bool,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
};

Icon.defaultProps = {
  id: "icon-" + crypt,
  type: "plus",
  size: "small",
  color: "default",
  background: false,
  disabled: false,
  handleClick: undefined,
};

export default Icon;
