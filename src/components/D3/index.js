import React, { useRef, useEffect, useState } from "react";
import { render } from "react-dom";
import * as d3 from "d3";
import Card from "../Card";
import Actions from "./Actions";
import "./index.css";
import { useParams } from "react-router-dom";
import {parentsplaceholder} from "../../data/treeData";
import _ from "lodash";
// Utils
import { cardType, getType } from "../utils";
import { getPathString} from "../../../src/utils/index";
import { titleCase } from "../../components/utils/titlecase";
import * as services from "../../services"
import * as helpers from "./helpers";
import { trimString } from "shared-logics";

let spousechildwidth = 200
let focusdefaultwidth = 216
var scaleval = 1;
var width = document.documentElement.clientWidth
var halfWidth = width /2

var vis = ""
let countcheck = 0
let totalspace
let Uid = 0
let totalLHSnodes
let leftnodedownposition = 0
var focusstartpos = 0
var focusendpos = 0
let counter = 0
var ua = navigator.vendor.toLowerCase();
let totalchildspousecount = 0
let totalspouses, childspousecount
let childspousepos, spouseposition
let nodetype = ""
let focuswidth = 220;
let focusheight = 78;
let focusNameLength, focusBirthPlacelength, focusDeathPlaceLength,focusDeathDateLength, focusBirthDateLength

// We save the original values from the viewBox
let viewBox = {
  x: 0,
  y: 0,
  width: document.documentElement.offsetWidth,
  height: document.documentElement.offsetHeight
};
 // The distances calculated from the pointer will be stored here
 var newViewBox = {
  x: 0,
  y: 0
};

const D3Tree = ({ data, ...props }) => {
  const [expandNodeParentArray, setParentsArray] = useState([]);
  const [treePan, setTreePan] = useState(services.getTreePan());
  // we save data to see if it changed
  const chartRef = useRef();
  const getDimensions = (d) => {
    switch (true) {
      case (d.isfocus): {
        nodetype = (d.attributes.death.RawDate !== "" || d.attributes.deathLocation !== "") ? "focusdeath" : "focus"
        totalspouses = d.spouses.length;
        break;
      }
      case (d.isSame): {
        nodetype = "spouse"
        countcheck = totalspouses
        break;
      }
      case (d.isSChild): {
        nodetype = "sChild"
        countcheck = totalLHSnodes
        break;
      }
      case (d.isdirectChildren): {
        nodetype = "directChildren"
        countcheck = totalLHSnodes
        break;
      }
      case (d.isdirectChildSpouse): {
        nodetype = "directChildspouse"
        countcheck = totalLHSnodes
        break;
      }
      default: {
        countcheck = 0
        nodetype = ""
        break;
      }
    }

    const { path, title, type } = d.attributes;
    const ctype = getType(path, title, type, countcheck, nodetype);

    focuswidth = helpers.getFocusWidth({ focuswidth }, { focusNameLength, focusBirthPlacelength, focusDeathPlaceLength, focusBirthDateLength, focusDeathDateLength }, d)
    if (d.isfocus)
      focusheight = helpers.getFocusHeight(d)
    switch (true) {
      case (ctype === cardType.FOCUSED_DECEASED): {
        switch (focusheight) {
          case (118):
            return { width: "100%", height: focusheight, y: 3 }
          case (102):
            return { width: "100%", height: focusheight, y: 8 }
          case (78):
          case (88):
            return { width: "100%", height: focusheight, y: 16 }
          default:
            return { width: "100%", height: focusheight }
        }
      }
      case (ctype === cardType.FOCUSED_LIVING): {
        if (focusheight === 68)
          return { width: "100%", height: focusheight, y: 6 }
        else
          return { width: "100%", height: focusheight }
      }
      case (ctype === cardType.MEDIUM_IMG):
        return { width: 204, height: 48, y: 0.5 }
      case (ctype === cardType.MEDIUM_NEXT_GEN):
        return { width: 204, height: 48, y: 0.5  }
      case (ctype === cardType.SMALL_IMG):
      case (ctype === cardType.SMALL_NEXT_GEN):
        {
          switch (true) {
            case (path.split("/").length === 4):
              return { width: 204, height: 26, y: 13 }
            case (path.split("/").length > 4):
              return { width: 204, height: 26, y: 9 }
            default:
              return { width: 204, height: 26, y: 12 }
          }
        }
      default:
        return { width: 204, height: 80 }
    }
  }

  const { treeId, primaryPersonId, level } = useParams();
  let homePerson
  // will be called initially and on every data change
  useEffect(() => {
    // INITIALIZE
    let treelevel = 0;
    var treetoplevel = 0
    let totallevel = 0;
    let focusXpos = 32
    let totalTreeWidth = 0;
    let directlastchildspouse = 0
    let totalchild = 0
    let prevspouse0child = false
    var spousechildsize = 0
    var directchildspouseend = 0
    var childspouseend = 0
    var spousesize = 48
    let directcounter = 0
    let totaldirectchild
    let totaldirectspace = 0
    let directchildspousecount = 0
    let directChildrenpos = 0

    let height = document.documentElement.clientHeight
    if (height < 500) {
      height = 500
      scaleval = 0.75
    }
    if (props.resetZoom !== false && treePan){
      setTreePan(false)
      services.setTreePan(false)
      if (width < 768) scaleval = 0.75
      else scaleval = 1
      viewBox.x = 0
      viewBox.y = 0
    }
    helpers.zoomlevel(scaleval);
    var spousechildloop = 0;
    var childspouseloop = 0;
    var directChildloop = 0;
    var directchildspouseloop = 0;
    var animduration = 0;
    var spouseDownCount = 1;
    var childDownCount = 1;
    var downconnector = 1;
    var directdownconnector = 1;
    var childcount = 0;
    var previousspouseposition = 0
    const calcutaleLHSnodecount = (d) => {
      if (d.spouses) {
        for (let spouseloop of d.spouses) {
          for (spousechildloop of spouseloop.schild) {
            totalchildspousecount++
            for (childspouseloop = 0; childspouseloop < spousechildloop.schildspouse.length; childspouseloop++) {
              totalchildspousecount++
            }
          }
        }
      }
      if (d.directChildren) {
        for (directChildloop of d.directChildren) {
          totalchildspousecount++
          for (directchildspouseloop of directChildloop.schildspouse) {
            totalchildspousecount++
          }
        }
      }
      return (totalchildspousecount)
    }

    totalchildspousecount = 0
    // GET CHILDREN
    var getChildren = function (d) {
      var a = [];
      if (d.parentId === "") {
        totalLHSnodes = calcutaleLHSnodecount(d)
        totalspouses = d.spouses.length
        if (totalLHSnodes > 20)
          spousechildsize = 24
        else
          spousechildsize = 48
        d.Uid = ++Uid
        d.isfocus = true;
        homePerson = d.treeInfo.HomePersonId;
      }
      if (d.directChildren) {
        for (let directChildrenloop of d.directChildren) {
          directChildrenloop.Uid = ++Uid
          directchildspousecount = directchildspousecount + directChildrenloop.schildspouse.length
          directChildrenloop.direction = "down"
          directChildrenloop.connector = directdownconnector
          directChildrenloop.placing = childDownCount;
          childDownCount++
          directChildrenloop.isRight = false;
          directChildrenloop.isdirectChildren = true;
          directChildrenloop.siblingcount = d.directChildren.length;
          directChildrenloop.parent = d;
          a.push(directChildrenloop);
          directdownconnector++;
          for (directchildspouseloop of directChildrenloop.schildspouse) {
            if (totalLHSnodes < 41) {
              directchildspouseloop.Uid = ++Uid
              directchildspouseloop.isdirectChildSpouse = true;
              directchildspouseloop.spouse = d.directChildren[directChildrenloop];
              a.push(directchildspouseloop);
            }
          }
        }
      }
      if (d.spouses) {
        for (let spouseloop of d.spouses) {
          spouseloop.Uid = ++Uid
          childcount = spouseloop.schild.length
          childspousecount = 0
          for (var z = 0; z < childcount; z++) {
            if (spouseloop.schild[z].schildspouse.length > 0)
              childspousecount++
          }
          spouseloop.totalchildspouse = childspousecount;
          spouseloop.connector = downconnector
          spouseloop.direction = "down"
          if (childcount < 3) {
            spouseloop.placing = spouseDownCount;
            spouseDownCount++
          }
          else {
            spouseloop.placing = spouseDownCount + childcount;
            spouseDownCount = spouseDownCount + childcount
          }
          spouseloop.isSame = true;
          spouseloop.parent = d;
          spouseloop.childnum = childcount
          a.push(spouseloop);

          //spouse child
          var spousechildCount = 1;
          for (spousechildloop of spouseloop.schild) {
            spousechildloop.Uid = ++Uid
            spousechildloop.placing = spousechildCount;
            spousechildCount++
            spousechildloop.connector = downconnector
            spousechildloop.pdirection = spouseloop.direction
            spousechildloop.pplacing = spouseloop.placing
            spousechildloop.totalsibling = childcount
            spousechildloop.isSChild = true;
            spousechildloop.parent = spouseloop;
            a.push(spousechildloop);
            for (childspouseloop = 0; childspouseloop < spousechildloop.schildspouse.length; childspouseloop++) {
              if (totalLHSnodes < 41) {
                spousechildloop.schildspouse[childspouseloop].Uid = ++Uid
                spousechildloop.schildspouse[childspouseloop].isSChildSpouse = true;
                spousechildloop.schildspouse[childspouseloop].spouse = spousechildloop;
                a.push(spousechildloop.schildspouse[childspouseloop]);
              }
            }

          }
          downconnector++;
        }
      }

      if (d.parents)
        for (let parentloop of d.parents) {
          treelevel = d.attributes.path ? d.attributes.path.split("/").length : 0
          if(treelevel > treetoplevel)
            treetoplevel = treelevel
          parentloop.Uid = ++Uid;
          parentloop.isRight = true;
          parentloop.parent = d;
          a.push(parentloop);
        }
      return a.length ? a : null;
    };
    var tree = d3.layout.tree().size([height, width]);
    if (vis !== "") {
      if (document.getElementById("tree")) {
        document.getElementById("tree").remove();
      }
    }

    vis = d3.select(chartRef.current).append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("id", "tree")
      .append("g")
      .attr("id", "maintree")

    if (ua !== "apple computer, inc.") {//Chrome
      vis.attr("transform", "translate(" + viewBox.x + ", " + viewBox.y + ") scale(" + scaleval + ")")
        .attr("transform-origin", "center")
    }
    else {//iphone or safari
      vis.attr("transform-origin", "center")
        .attr("transform", "translate(" + viewBox.x + ", " + viewBox.y + ") scale(" + scaleval + ")")
      document.getElementById('maintree').setAttribute('style', `transform:translateX(${viewBox.x}px) translateY(${viewBox.y}px) translateZ(0) scale(${scaleval}); `);
    }


    var canvas = document.getElementById("tree");

    //Zoom
    function zoomin(scalevalue) {
      if (ua !== "apple computer, inc.") {// Chrome
        maintree.setAttribute("transform", "translate(" + viewBox.x + ", " + viewBox.y + ") scale(" + scalevalue + ")");
      }
      else {
        // Safari
        document.getElementById('maintree').removeAttribute('transform')
        document.getElementById('maintree').removeAttribute('style')
        document.getElementById('maintree').setAttribute('style', `transform:translateX(${viewBox.x}px) translateY(${viewBox.y}px) translateZ(0) scale(${scaleval}); `);
        maintree.setAttribute("transform-origin", "center")
        maintree.setAttribute("transform", "translate(" + viewBox.x + ", " + viewBox.y + ") scale(" + scalevalue + ")  translateZ(0)");
      }
    }

    function reset(scalevalue) {
      viewBox.x = 0;
      viewBox.y = 0;
      newViewBox.x = 0;
      newViewBox.y = 0;
      if (ua !== "apple computer, inc.") {
        maintree.setAttribute("transform", "translate(0, 0) scale(" + scalevalue + ")");
      }
      else {
        document.getElementById('maintree').removeAttribute('transform')
        document.getElementById('maintree').removeAttribute('style')
        document.getElementById('maintree').setAttribute('style', `transform:translateX(${viewBox.x}px) translateY(${viewBox.y}px) translateZ(0) scale(${scaleval}); `);
        maintree.setAttribute("transform-origin", "center")
        maintree.setAttribute("transform", "translate(" + viewBox.x + ", " + viewBox.y + ") scale(" + scalevalue + ")  translateZ(0)");
      }
    }

    //Keyboard + & -
    document.onkeydown = function (e) {
      if (e.ctrlKey === true && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handleZoomIn()
      }
      else if (e.ctrlKey === true && (e.key === '-')) {
        e.preventDefault();
        handleZoomOut()
      }
    };

    var scrollStatus = {
      wheeling: false,
      functionCall: false
    };
    var scrollTimer = false;

    //Mouse zoomin & zoomout
    if (document.getElementById("tree")) {
      document.getElementById("tree").addEventListener("wheel", (e) => {
        e.preventDefault();
        scrollStatus.wheeling = true;
        if (!scrollStatus.functionCall) {
          if (e.deltaY < 0) {
            handleZoomIn()
          }
          else if (e.deltaY > 0) {
            handleZoomOut()
          }
          scrollStatus.functionCall = true;
        }
        window.clearInterval(scrollTimer);
        scrollTimer = window.setTimeout(function () {
          scrollStatus.wheeling = false;
          scrollStatus.functionCall = false;
        }, 50);
      }, false);

    }
    //Button +
    document.getElementById("btnplus").onclick = function () {
      if (!document.getElementById("btnplus").classList.contains("top-disable"))
        handleZoomIn()
    };

    //Button Home
    document.getElementById("btnhomePerson").onclick = function () {
      setTreePan(false)
      services.setTreePan(false)
      if (!document.getElementById("btnhomePerson").classList.contains("home-disable"))
      {
        if (width < 768)
          scaleval = 0.75
        else
          scaleval = 1
        helpers.zoomlevel(scaleval);
        reset(scaleval);
        props.makeHomePersonAsFocus(treeId, homePerson, level)
      }
    };

    //Button -
    document.getElementById("btnminus").onclick = function () {
      if (!document.getElementById("btnminus").classList.contains("bottom-disable"))
        handleZoomOut()
    };

    //Button Reset
    document.getElementById("btnreset").onclick = function () {
      if (width < 768)
        scaleval = 0.75
      else
        scaleval = 1
      helpers.zoomlevel(scaleval);
      reset(scaleval)
    };

    function handleZoomOut() {
      scaleval = scaleval - 0.25;
      if ((scaleval >= 0.01) && (scaleval <= 0.24))
        scaleval = 0.25
      if (scaleval >= 0.25) {
        zoomin(scaleval)
      }
      else {
        scaleval = scaleval + 0.25;
      }
      helpers.zoomlevel(scaleval);
    }

    function handleZoomIn() {
      scaleval = scaleval + 0.25;
      if ((scaleval >= 2.01) && (scaleval <= 2.24))
        scaleval = 2.0
      if (scaleval <= 2.00) {
        zoomin(scaleval)
      }
      else {
        scaleval = scaleval - 0.25;
      }
      helpers.zoomlevel(scaleval);
    }

    function round(num, places) {
      num = parseFloat(num);
      places = (places ? parseInt(places, 10) : 0)
      if (places > 0) {
        let length = places;
        places = "1";
        for (let i = 0; i < length; i++) {
          places += "0";
          places = parseInt(places, 10);
        }
      } else {
        places = 1;
      }
      return Math.round((num + Number.EPSILON) * (1 * places)) / (1 * places)
    }

    function handlePinchZoomOut() {
      scaleval = scaleval - 0.01;
      if (scaleval >= 0.25) {
        zoomin(scaleval)
      }
      else {
        scaleval = scaleval + 0.01;
      }
      scaleval = round(scaleval, 2);
      helpers.zoomlevel(scaleval);
    }

    function handlePinchZoomIn() {
      scaleval = scaleval + 0.01;
      if (scaleval <= 2.0) {
        zoomin(scaleval)
      }
      else {
        scaleval = scaleval - 0.01
      }
      scaleval = round(scaleval, 2);
      helpers.zoomlevel(scaleval);
    }

    //Panning
    const handleViewBox = (updatedView) => {
      viewBox.x = updatedView.x
      viewBox.y = updatedView.y
    }

    var pointerOrigin = { x: 0, y: 0 };
    canvas.addEventListener("mousedown", function (evt) {
      var pointerPosition = getPointFromEvent(evt);

      pointerOrigin.x = pointerPosition.x;
      pointerOrigin.y = pointerPosition.y;
    });

    var svg = document.getElementById('tree');
    var maintree = document.getElementById('maintree');
    let pinchzoom = false;
    // If browser supports pointer events
    if (window.PointerEvent) {
      // Add all mouse events listeners fallback
      svg.addEventListener('mousedown', dragStart); // Pressing the mouse
      svg.addEventListener('mouseup', dragEnd); // Releasing the mouse
      svg.addEventListener('mouseleave', dragEnd); // Mouse gets out of the SVG area
      svg.addEventListener('mousemove', drag); // Mouse is moving

      // Add all touch events listeners fallback
      svg.addEventListener('touchstart', checkZoomorPan); // Finger is touching the screen
      svg.addEventListener('touchend', dragEnd); // Finger is no longer touching the screen
      svg.addEventListener('touchmove', drag); // Finger is moving
    }

    function checkZoomorPan(event) {
      let fingers = event.touches.length
      if (fingers === 1)
        dragStart(event);
      else {
        pinchStart(event);
      }
    }
    // This function returns an object with X & Y values from the pointer event
    function getPointFromEvent(event) {
      var point = { x: 0, y: 0 };
      // If even is triggered by a touch event, we get the position of the first finger
      if ((event.type === "touchstart") || (event.type === "touchmove")) {
        point.x = event.touches[0].clientX;
        point.y = event.touches[0].clientY;
      }
      else {
        point.x = event.clientX;
        point.y = event.clientY;
      }
      return point;
    }

    function getZoomPointFromEvent(event) {
      var zoompoint1 = { x: 0, y: 0 };
      var zoompoint2 = { x: 0, y: 0 };
      var zoomdiff = { x: 0, y: 0 };
      // If even is triggered by a touch event, we get the position of the first finger
      if ((event.type === "touchstart") || (event.type === "touchmove")) {
        zoompoint1.x = event.touches[0].clientX;
        zoompoint1.y = event.touches[0].clientY;
        zoompoint2.x = event.touches[1].clientX;
        zoompoint2.y = event.touches[1].clientY;
      }
      if (zoompoint1.x > zoompoint2.x)
        zoomdiff.x = zoompoint1.x - zoompoint2.x;
      else
        zoomdiff.x = zoompoint2.x - zoompoint1.x;
      if (zoompoint1.y > zoompoint2.y)
        zoomdiff.y = zoompoint1.y - zoompoint2.y;
      else
        zoomdiff.y = zoompoint2.y - zoompoint1.y;
      return zoomdiff;
    }

    // This variable will be used later for move events to check if pointer is down or not
    var isPointerDown = false;

    // Function called by the event listeners when user start pressing/touching
    function dragStart(event) {
      isPointerDown = true; // We set the pointer as down
      // We get the pointer position on click/touchdown so we can get the value once the user starts to drag
      var pointerPosition = getPointFromEvent(event);
      pointerOrigin.x = pointerPosition.x;
      pointerOrigin.y = pointerPosition.y;
    }

    var pinchZoomInitialDistance = { x: 0, y: 0 };
    var pinchZoomNewDistance = { x: 0, y: 0 };
    function pinchStart(event) {
      pinchzoom = true; // We set the pointer as down
      // We get the pointer position on click/touchdown so we can get the value once the user starts to drag
      var zoomPointerPosition = getZoomPointFromEvent(event);
      pinchZoomInitialDistance.x = zoomPointerPosition.x;
      pinchZoomInitialDistance.y = zoomPointerPosition.y;
    }


    // Calculate the ratio based on the viewBox width and the SVG width
    var ratio = viewBox.width / svg.getBoundingClientRect().width;
    window.addEventListener('resize', function () {
      ratio = viewBox.width / svg.getBoundingClientRect().width;
    });
    var pinchDifferencex, pinchDifferencey
    // Function called by the event listeners when user start moving/dragging
    function drag(event) {
      // Only run this function if the pointer is down
      if (pinchzoom) {
        event.preventDefault();
        pinchZoomNewDistance = getZoomPointFromEvent(event);
        pinchDifferencex = pinchZoomNewDistance.x - pinchZoomInitialDistance.x
        pinchDifferencey = pinchZoomNewDistance.y - pinchZoomInitialDistance.y
        if ((pinchDifferencex >= 0) || (pinchDifferencey >= 0))
          handlePinchZoomIn()
        else
          handlePinchZoomOut()
        return;
      }
      if (!isPointerDown) {
        return;
      }
      // This prevent user to do a selection on the page
      event.preventDefault();
      // Get the pointer position
      var pointerPosition = getPointFromEvent(event);

      // We calculate the distance between the pointer origin and the current position
      // The viewBox x & y values must be calculated from the original values and the distances
      newViewBox.x = viewBox.x + ((pointerPosition.x - pointerOrigin.x) * ratio);
      newViewBox.y = viewBox.y + ((pointerPosition.y - pointerOrigin.y) * ratio);

      // We create a string with the new viewBox values
      // The X & Y values are equal to the current viewBox minus the calculated distances
      // We apply the new transform values onto the SVG
      if (ua !== "apple computer, inc.") {
        document.getElementById('maintree').setAttribute('transform', `translate(${newViewBox.x}, ${newViewBox.y}) scale(${scaleval})`);
      }
      else {
        document.getElementById('maintree').removeAttribute('style')
        document.getElementById('maintree').removeAttribute('transform')
        document.getElementById('maintree').removeAttribute('transform-origin')
        document.getElementById('maintree').setAttribute('style', `transform:translateX(${newViewBox.x}px) translateY(${newViewBox.y}px) translateZ(0) scale(${scaleval}); `);
        vis.attr("transform-origin", "center")
        vis.attr("transform", "translate(" + newViewBox.x + ", " + newViewBox.y + ") scale(" + scaleval + ")")
      }
    }

    function dragEnd() {
      // The pointer is no longer considered as down
      if (pinchzoom) {
        pinchzoom = false;
        return
      }
      isPointerDown = false;
      // We save the viewBox coordinates based on the last pointer offsets
      viewBox.x = newViewBox.x;
      viewBox.y = newViewBox.y;
    }

    var nodedata = data;
    nodedata.x0 = height / 2;
    nodedata.y0 = width / 2;

    var t1 = d3.layout.tree().size([height, halfWidth]).children(function (d) { return d.directChildren; });
    var t2 = d3.layout.tree().nodeSize([100, 50]).separation(function (a, b) {
    treelevel = a.parent.attributes.path ? a.parent.attributes.path.split("/").length : 0;
      if (a.parent === b.parent) {
        if (treelevel % 4 === 3) {
          return 0.4        }
        else if ((treelevel === 1 || treelevel === 0) && helpers.getFocusWidth({ focuswidth }, { focusNameLength, focusBirthPlacelength, focusDeathPlaceLength, focusBirthDateLength, focusDeathDateLength }, a.parent) > 222){

          let checkHeight = helpers.getFocusHeight(a.parent);

          if (checkHeight === 102)
            return 1.75
          else if (checkHeight === 118) {
            return 1.95
          }
          else if (checkHeight === 78) {
            return 1.55
          }
          else if (checkHeight === 68) {
            return 1.45
          }
          else {
            return 1.45
          }
        }
        else {
          return 0.75

        }
      }
      else {
         if (treelevel % 4 === 3) return 0.44;
         else if (treelevel === 2) return 0.7;
         else return 0.75;
      }

    }).children(function (d) { return d.parents; });
    var t3 = d3.layout.tree().size([height, halfWidth]).children(function (d) { return d.spouses; });

    t1.nodes(nodedata);
    t2.nodes(nodedata);
    t3.nodes(nodedata);

    var rebuildChildren = function (noderoot) {

      noderoot.children = getChildren(noderoot);
      if (noderoot.children) noderoot.children.forEach(rebuildChildren);
    }
    rebuildChildren(nodedata);
    nodedata.isRight = false;
    update(nodedata);

    // UPDATE
    function update(sourceupdate) {
      // Compute the new tree layout.
      var nodes = toArray(sourceupdate);
      // Normalize for fixed-depth.
      nodes.forEach(function (d) {
        d.y = d.depth * 180 + halfWidth;
      });
      var k = 0;
      // Update the nodes…
      var node = vis.selectAll("g.node")
        .data(nodes, function (d) {
          return d.Uid || (d.Uid = ++k);
        });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
        .attr("transform", function (d) {
          return "translate(" + sourceupdate.y0 + ", " + sourceupdate.x0 + ")";
        });

      nodeEnter
        .append("svg")
        .on('mouseover', function (d) {   //Tooltip on mouse hover
          var nodesvg = d3.select(this);
          var cardid = document.getElementById(nodesvg.attr('id'))
          const rect = cardid.getBoundingClientRect();
          var elem = cardid.querySelector('.truncate');
          let fullNameLength = d.firstName.length + d.lastName.length + 1;
          let cardsize = getType(d.attributes.path, d.attributes.title,d.attributes.type, countcheck, nodetype).toLowerCase()

          if ((elem.offsetWidth < elem.scrollWidth)
          || (cardsize.includes("focus") && fullNameLength > 29)
          || (cardsize.includes("medium") && fullNameLength > 21 && d.attributes.imgsrc === "")
          || (cardsize.includes("medium") && fullNameLength > 15 && d.attributes.imgsrc !== "")
          || (cardsize.includes("small") && fullNameLength > 21))
          {
           //To check elliptic text     
            var d3body = d3.select("body");
            d3body.append("div")
              .attr("class", "tooltip")
              .html(trimString(titleCase(d.firstName) + " " + titleCase(d.lastName)))
              .style("opacity", 1)
              .style("left", rect.left + "px")
              .style("top", distance)
              .style("visibility", "visible")

            //Function to calculate distance between tooltip and card
            function distance() {
              var tooltipheight = document.querySelector('.tooltip').clientHeight;
              var Y = rect.top;
              var factor = tooltipheight / 16;
              if (tooltipheight > 16) {
                Y = Y - 18 * factor + "px";
              }
              else {
                Y = Y - 21 + "px"
              }
              return Y;
            }
          }
          else{
            d3.select('.tooltip')
              .style('visibility', 'hidden');

          }
        })
        .on('mouseout', function (d) {
          d3.select("body").select('div.tooltip').remove();   //Remove Tooltip on mouseout
        })
        .attr("y", function (d) {
          if (d.isSame)
            return 0;
          else
            return -20
        })
        .attr('width', function (d) {
          if (d.isfocus)
            return 400;
          else
            return 300;
        })

        .attr('height', 150)
        .attr("id", function (d) {
          return `card-${d.Uid}`;
        })
        .html(function (d) {
          if (d.isfocus) {
            if (d.attributes.death.RawDate !== "" || d.attributes.deathLocation !== "")
              nodetype = "focusdeath"
            else
              nodetype = "focus"
            totalspouses = d.spouses.length;
          }
          else if (d.isSame) {
            nodetype = "spouse"
            countcheck = totalspouses
          }
          else if (d.isdirectChildSpouse) {
            nodetype = "directChildspouse"
            countcheck = totalspouses
          }
          else {
            countcheck = 0
            nodetype = ""
          }
          render(
            <foreignObject {...getDimensions(d)}>
              <Card
                id={d.id}
                parentId={d.parentId}
                cFilialId={d.attributes.cFilialId}
                type={getType(d.attributes.path, d.attributes.title, d.attributes.type, countcheck, nodetype)}
                path={d.attributes.path}
                title={d.attributes.title}
                firstName={d.firstName}
                firstNameWithInitials={helpers.getInitials(d.firstName,d.lastName,getType(d.attributes.path, d.attributes.title,d.attributes.type, countcheck, nodetype),d.attributes.imgsrc)}
                lastName={d.lastName}
                isLiving={d.isLiving}
                gender={d.attributes.gender}
                birth={d.attributes.birth}
                birthPlace={d.attributes.birthLocation}
                death={d.attributes.death}
                deathPlace={d.attributes.deathLocation}
                imgsrc={d.attributes.imgsrc}
                relatedParentIds={d.attributes.relatedParentIds}
                handleViewBox={handleViewBox}
                {...props}
              />
            </foreignObject>,
            document.getElementById("card-" + d.Uid ));

        })

        let totalLHSspace = function (d, totalchildcount, childspousenum) {
        let totalspaceused = 0
        if (totalLHSnodes > 20) {
          if (totalLHSnodes > 40)
            totalspaceused = totalchildcount * spousechildsize + ((totalchildcount - 1) * 16)
          else
            totalspaceused = totalchildcount * spousechildsize + ((totalchildcount - 1) * 16) + (childspousenum * 24)
        }
        else {
          totalspaceused = totalchildcount * spousechildsize + ((totalchildcount - 1) * 16) + (childspousenum * 24)
        }
        return totalspaceused
      }

      var incrementSpouseLine = 15;
      var elbow = function (d, i) {
        let source = calcLeft(d.source, "elbow");
        var target = calcLeft(d.target, "elbow");
        var hy = 0;
        let deltaY = 6
        if (d.target.isRight) //parent connecting line
        {
          treelevel = d.target.attributes.path ? d.target.attributes.path.split("/").length : 0;
          if (treelevel === 1) {
            deltaY = 4;
            if(focusheight === 68 || focusheight === 78){
              source.x = source.x + 15
            }
            else
            {
              source.x = source.x + 35
            }
          }
          else if (treelevel>=8 && treelevel % 4 === 1)
            source.x = source.x  - 3
          if (treelevel % 4 ===0)
            hy = (target.y - source.y) + 15;
          else
            hy = (target.y - source.y) + 25;
          return `M${source.y + 25},${source.x + deltaY} H${source.y + hy} V${target.x} H${target.y + 25}`;
        }
        else if (d.target.isSame) //spouse connecting lines
        {
          target.x = d.target.connectingline
          hy = hy + incrementSpouseLine;
          incrementSpouseLine += 10;
          let dr = 0
          return "M" + (source.y + hy) + "," + source.x + "A" + dr + "," + dr + " 0 0,1 " + (target.y + hy) + "," + (target.x + 2);
        }
        else if (d.target.isdirectChildren) //direct child connecting lines
        {
          hy = -60
          let elbowloc
          childcount = d.target.siblingcount
          if (focusheight === 68)
            source.x = d.source.center + focusheight / 2 - 14
          else if (focusheight === 102)
            source.x = d.source.center + focusheight / 2 - 11
          else if ((focusheight === 118) || (focusheight === 78))
            source.x = d.source.center + focusheight / 2 - 19
          else
            source.x = d.source.center + focusheight / 2 - 4
          if (childcount > 1)
            source.y = source.y + 30 + (d.target.connector * 20) - 5
          else
            source.y = source.y + 30 + (d.target.connector * 20)

          elbowloc = hy - (d.target.connector - 1) * 20
          if (d.target.siblingcount > 1) {
            if (d.target.placing === 1)
              return `M${source.y - 50},${source.x} H${source.y + elbowloc} V${target.x + 6} a6,6 0 0 0 -6,-6 H${target.y}`;
            else if (d.target.placing === d.target.siblingcount)
              return `M${source.y - 50},${source.x} H${source.y + elbowloc} V${target.x - 6} a6,6 0 0 1 -6,6 H${target.y}`;
            else
              return `M${source.y - 50},${source.x} H${source.y + elbowloc} V${target.x} H${target.y}`;
          }
          else {
            return `M${source.y - 50},${source.x} H${source.y + elbowloc} V${target.x + 1} H${target.y}`;
          }
        }
        else if (d.target.isSChild) //LHS connecting lines
        {
          hy = -60
          let elbowloc
          childcount = d.target.totalsibling
          source.x = d.target.parent.center - 10
          source.y = source.y + 30 + (d.target.connector * 20) - 5
          elbowloc = hy - (d.target.connector - 1) * 20
          if (d.target.totalsibling === 1)
            target.x = d.target.parent.center - 10
          if (totalLHSnodes > 20) {
            if (d.target.totalsibling > 1) {
              if (d.target.placing === 1)
                return `M${source.y - ((d.target.connector - 1) * 10 + 30)},${source.x} H${source.y + elbowloc} V${target.x + 7} a6,6 0 0 0 -6,-6 H${target.y}`;
              else if (d.target.placing === d.target.totalsibling)
                return `M${source.y - ((d.target.connector - 1) * 10 + 30)},${source.x} H${source.y + elbowloc} V${target.x - 5} a6,6 0 0 1 -6,6 H${target.y}`;
              else
                return `M${source.y - ((d.target.connector - 1) * 10 + 30)},${source.x} H${source.y + elbowloc} V${target.x + 1} H${target.y}`;
            }
            else {
              return `M${source.y - ((d.target.connector - 1) * 10 + 30)},${source.x} H${source.y + elbowloc} V${target.x + 1} H${target.y}`;
            }
          }
          else {
            if (d.target.totalsibling > 1) {
              if (d.target.placing === 1)
                return `M${source.y - ((d.target.connector - 1) * 10 + 30)},${source.x} H${source.y + elbowloc} V${target.x + 8} a6,6 0 0 0 -6,-6 H${target.y}`;
              else if (d.target.placing === d.target.totalsibling)
                return `M${source.y - ((d.target.connector - 1) * 10 + 30)},${source.x} H${source.y + elbowloc} V${target.x - 4} a6,6 0 0 1 -6,6 H${target.y}`;
              else
                return `M${source.y - ((d.target.connector - 1) * 10 + 30)},${source.x} H${source.y + elbowloc} V${target.x + 2} H${target.y}`;
            }
            else {
              return `M${source.y - ((d.target.connector - 1) * 10 + 30)},${source.x} H${source.y + elbowloc} V${target.x} H${target.y}`;
            }
          }
        }
        else if (d.target.isSChildSpouse) // No connection for Spouses of Childrens
          return `M0,0 H0 V0 H0`;
      };
      var connector = elbow;

      // Calculate Tree width
      totallevel = treetoplevel + 1
      if(totallevel === 1)
      {
      //totalTreeWidth = FocusNodeWidth + DistancebetweenFocus&1stGen + ParentNodeSize
        totalTreeWidth = focusdefaultwidth +  32 + spousechildwidth
      }
      else if (totallevel >=5)
      {
        //totalTreeWidth = FocusNodeWidth + (totallevel * ParentNodeSize) + (totallevel-1 * 2ndNodeOnwardsDistanceBetweenParentsNodes) + DistancebetweenFocus&1stGen
          totalTreeWidth = focusdefaultwidth + (4 * spousechildwidth) + (3 * 24) + 32
        }
      else
      {
      //totalTreeWidth = FocusNodeWidth + (totallevel * ParentNodeSize) + (totallevel-1 * 2ndNodeOnwardsDistanceBetweenParentsNodes) + DistancebetweenFocus&1stGen
        totalTreeWidth = focusdefaultwidth + (totallevel * spousechildwidth) + ((totallevel-1) * 24) + 32
      }
      if (totalchildspousecount > 0)
      {
      //totalTreeWidth = Focus&RHSWidth + ChildNodeWidth + DistanceBetweenFocus&Child
        totalTreeWidth = totalTreeWidth + spousechildwidth + 32
      }
      if(width >= 768){
        if(totalTreeWidth > width)
        {
          if(totalchildspousecount > 0)
            focusXpos = focusXpos + spousechildwidth + 32
          else
            focusXpos = focusXpos + 0
        }
        else
        {
          if(totalchildspousecount > 0)
            focusXpos = (width - totalTreeWidth)/2 + spousechildwidth + 32
          else
            focusXpos = (width - totalTreeWidth)/2
        }
      }
      else
      {
        focusXpos = (width / 2) - 75
      }

      // CALC LEFT
      let x, l
      var calcLeft = function (d, src) {
        x = d.x
        l = d.y;
        var focusy = (height-64) / 2;
        var nodesrc = src;
        if (!d.isRight) {
          if (d.isfocus === true) //focus node
          {
            if(focusheight === 68 )
              focusstartpos = d.center = focusy + focusheight/2 + 10
            else if(focusheight === 78)
              focusstartpos = d.center = focusy + focusheight/2 + 6
            else if(focusheight === 88)
              focusstartpos = d.center = focusy + focusheight/2 - 20
            else if(focusheight === 102)
              focusstartpos = d.center = focusy + focusheight/2 - 26
            else
              focusstartpos = d.center = focusy + focusheight/2 - 36
            focusendpos = focusstartpos + focusheight
            previousspouseposition = focusendpos
            return { x: focusstartpos, y: focusXpos }
          }
          else if (d.isdirectChildren === true) // direct childs
          {
            if (directcounter === 0) {
              if (focusheight === 102)
                directChildrenpos = d.parent.center + focusheight / 2 + 8
              else if (focusheight === 118)
                directChildrenpos = d.parent.center + focusheight / 2
              else if (focusheight === 68)
                directChildrenpos = d.parent.center + focusheight / 2 + 5
              else
                directChildrenpos = d.parent.center + focusheight / 2
              totaldirectchild = d.siblingcount
              directlastchildspouse = 0
              let totaldirectchildspouses = 0
              for (var z = 0; z < totaldirectchild; z++) {
                if (z === totaldirectchild - 1) {
                  if (d.parent.directChildren[z].schildspouse.length > 0)
                    directlastchildspouse = 1
                }
                else {
                  if (d.parent.directChildren[z].schildspouse.length > 0)
                    totaldirectchildspouses++
                }
              }
              totaldirectspace = totalLHSspace(d, totaldirectchild, totaldirectchildspouses)
              if (totaldirectchild > 1) {
                if (totaldirectchild === 2) {
                  if (totalLHSnodes > 20)
                    directChildrenpos = directChildrenpos - totaldirectspace / 2 + 5
                  else
                    if ((focusheight === 68) || (focusheight === 78) || (focusheight === 102) || (focusheight === 118))
                      directChildrenpos = directChildrenpos - totaldirectspace / 2
                    else if (focusheight === 88)
                      directChildrenpos = directChildrenpos - totaldirectspace / 2 + 15
                    else
                      directChildrenpos = directChildrenpos - totaldirectspace / 2 + 15
                }
                else {
                  if (directlastchildspouse === 1) {
                    if (totalLHSnodes > 20)
                      directChildrenpos = directChildrenpos - totaldirectspace / 2 + 5
                    else
                      directChildrenpos = directChildrenpos - totaldirectspace / 2 + 18
                  }
                  else {
                    if (focusheight === 88)
                      directChildrenpos = directChildrenpos - totaldirectspace / 2 + 20
                    else
                      directChildrenpos = directChildrenpos - totaldirectspace / 2
                  }
                }
              }
              else {
                if (focusheight === 88)
                  directChildrenpos = directChildrenpos - 10
                else
                  directChildrenpos = directChildrenpos - 25
              }
              directcounter++
              x = directChildrenpos
            }
            else {
              directChildrenpos = directchildspouseend + 16
              x = directChildrenpos
            }
            directChildrenpos = x
            if (nodesrc === "node") {
              d.center = directChildrenpos
              directchildspouseend = leftnodedownposition = directChildrenpos + spousechildsize
            }
            if (nodesrc !== "node")
              x = d.center + 5
            l = focusXpos - spousechildwidth - 32
            return {
              x: x,
              y: l
            };
          }
          else if (d.isdirectChildSpouse) {
            if (totalLHSnodes > 20) {
              directChildrenpos = directchildspouseend + 4
              directchildspouseend = leftnodedownposition = directChildrenpos + 25 + 4

            }
            else {
              directChildrenpos = directchildspouseend - 10
              directchildspouseend = leftnodedownposition = directChildrenpos + 25 + 10

            }
            x = directChildrenpos
            l = focusXpos - spousechildwidth - 32
            return {
              x: x,
              y: l
            };
          }
          else if (d.isSame) //spouse
          {
            counter = 0
            if (directchildspouseend === 0) {
              if(d.connector === 1)
              {
                if (totalLHSnodes > 20)
                  spouseposition = focusendpos + 11
                else {
                  if (focusheight === 68)
                    spouseposition = focusendpos + 6
                  else if (focusheight === 102)
                    spouseposition = focusendpos + 10
                  else if (focusheight === 88)
                    spouseposition = focusendpos + 16
                  else if (focusheight === 118)
                    spouseposition = focusendpos + 4
                  else
                    spouseposition = focusendpos
                }
              }
              else
              {
                if (totalLHSnodes > 20)
                  spouseposition = leftnodedownposition + 11
                else {
                  if ((focusheight === 102) || (focusheight === 68) || (focusheight === 78))
                    spouseposition = leftnodedownposition + 24
                  else if (focusheight === 88)
                    spouseposition = leftnodedownposition + 16
                  else if (focusheight === 118)
                    spouseposition = leftnodedownposition + 4
                  else
                    spouseposition = leftnodedownposition
                }
              }
            }
            else {
              if (directchildspouseend === 0)
                leftnodedownposition = focusendpos
              else {
                if ((leftnodedownposition < previousspouseposition) && (d.schild.length < 3)) {
                  leftnodedownposition = previousspouseposition - 4
                }
              }
              if (d.schild.length === 0) {
                if (totalLHSnodes > 20)
                  spouseposition = leftnodedownposition + 5
                else {
                  if ((focusheight === 68) || (focusheight === 78) || (focusheight === 102) || (focusheight === 118) || (focusheight === 88))
                    if (d.connector === 1) {
                      if (leftnodedownposition < previousspouseposition)
                        spouseposition = leftnodedownposition + 14
                      else
                        spouseposition = leftnodedownposition - 6
                    }
                    else
                      spouseposition = leftnodedownposition + 24
                  else
                    spouseposition = leftnodedownposition + 24
                }
                prevspouse0child = true;
              }
              else {
                totalchild = d.schild.length
                let totalchildspouses = 0
                for (var loopcount = 0; loopcount < totalchild; loopcount++) {
                  if (d.schild[loopcount].schildspouse.length > 0) {
                    if (loopcount !== totalchild - 1) {
                      if (d.schild[loopcount].schildspouse.length > 0)
                        totalchildspouses++
                    }
                  }
                }
                totalspace = totalLHSspace(d, totalchild, totalchildspouses)
                if (totalLHSnodes > 20)
                  spouseposition = leftnodedownposition + totalspace / 2 + 40
                else
                  spouseposition = leftnodedownposition + totalspace / 2 + 30

                if (prevspouse0child === true) {
                  if (totalLHSnodes > 20)
                    spouseposition = spouseposition - 16
                  else {
                    if (directlastchildspouse === 1)
                      spouseposition = spouseposition - 5
                    else
                      spouseposition = spouseposition - 40
                  }
                }
              }

            }
            if (d.schild.length === 0)
              prevspouse0child = true
            else
              prevspouse0child = false;
            if (nodesrc === "node") {
              d.prevcenter = spouseposition
              d.center = spouseposition
              if(d.connector === 1 && prevspouse0child)
                leftnodedownposition = spouseposition + spousesize
              else
                directchildspouseend = leftnodedownposition = spouseposition + spousesize
              previousspouseposition = directchildspouseend
            }
            x = spouseposition

            if (src === "node") {
              d.connectingline = x
            }
            return {
              x: x,
              y: focusXpos
            };

          }
          else { // spouse childs & their spouses
            if (d.isSChild === true) // spouse childs
            {
              if (counter === 0) {
                childspousepos = spouseposition - 12
                totalchild = d.parent.schild.length
                let totalchildspouses = 0
                let lastchildspouce = 0
                for (var loopcalc = 0; loopcalc < totalchild; loopcalc++) {
                  if (loopcalc === totalchild - 1) {
                    if (d.parent.schild[loopcalc].schildspouse.length > 0)
                      lastchildspouce = 1
                  }
                  else {
                    if (d.parent.schild[loopcalc].schildspouse.length > 0)
                      totalchildspouses++
                  }
                }
                totalspace = totalLHSspace(d, totalchild, totalchildspouses)
                if (totalchild < 2) {
                  childspousepos = childspousepos - 5
                }
                else {
                  if (totalLHSnodes > 20) {
                    if (lastchildspouce === 1)
                      if (totalchild === 2)
                        childspousepos = childspousepos - totalspace / 2
                      else
                        childspousepos = childspousepos - totalspace / 2 + 10
                    else
                      childspousepos = childspousepos - totalspace / 2 + 9
                  }
                  else {
                    if ((totalchildspouses === 0))
                      childspousepos = childspousepos - totalspace / 2 + 20
                    else
                      childspousepos = childspousepos - totalspace / 2 + spousechildsize / 2 - 5
                  }
                }
                counter++
                x = childspousepos
              }
              else {
                childspousepos = childspouseend + 16
                x = childspousepos
              }
              childspousepos = x
              if (nodesrc === "node") {
                d.center = childspousepos
                childspouseend = leftnodedownposition = childspousepos + spousechildsize
              }
              if (nodesrc !== "node")
                x = d.center + 4
              l = focusXpos - spousechildwidth - 32
            }
            else if (d.isSChildSpouse) //child spouse
            {
              if (totalLHSnodes > 20) {
                childspousepos = childspouseend + 4
                childspouseend = leftnodedownposition = childspousepos + 25
              }
              else {
                childspousepos = childspouseend - 11
                childspouseend = leftnodedownposition = childspousepos + 25 + 11
              }
              x = childspousepos
              l = focusXpos - spousechildwidth - 32
            }
            return {
              x: x,
              y: l
            };
          }
        }
        else if (d.isRight) {
          treelevel = d.attributes.path ? d.attributes.path.split("/").length : 0
          let X = d.x + focusy + 58;
          if (treelevel >= 8){
            if (treelevel % 4 ===0)
              X = X + 5;
            else
              X = X + 2
          }
          l = l + treelevel * 50
          if (treelevel === 1)
            l = focusXpos + focusdefaultwidth + 32
          else if( treelevel >= 5){
            if (treelevel >=9)
              l = focusXpos + focusdefaultwidth + 32 + ((treelevel-1) * spousechildwidth) + ((treelevel - 1) * 24) + (Math.floor((treelevel-1) / 4) *25)
            else
              l = focusXpos + focusdefaultwidth + 32 + ((treelevel-1) * spousechildwidth) + ((treelevel - 1) * 24) + 25
          }
          else
            l = focusXpos + focusdefaultwidth + 32 + ((treelevel-1) * spousechildwidth) + ((treelevel - 1) * 24)
          return {
            x: X,
            y: l
          };
        }
        return {
          x: d.x,
          y: l
        };
      };
      //Function to get tree level
      const getTreeLevel = (d) =>{
       return d.attributes.path ? d.attributes.path.split("/").length : 0
      }

      const createQuarterAnimEffect =(arrow, animPath)=>{
        arrow.append("path")
          .attr("d", animPath)
          .attr("stroke-width","1.5")
          .attr("stroke","#FC4040")
          .attr("fill","none")
          .attr("style","transition:dash 300ms linear forwards")
      }

      //Add empty parents node in tree json
      const upDateFamily = async(selectedNode, treeData, nextGenAvailable,updateimageicon, isExpand) => {
        treelevel = selectedNode.attributes.path ? selectedNode.attributes.path.split("/").length : 0
        if (selectedNode.parents) {
          delete selectedNode.parents;
          if(expandNodeParentArray.length >= 1) {
            deleteOldParents(treeData, treelevel);
          }
        }
        else if(!nextGenAvailable){
          if(expandNodeParentArray.length >= 1) {
            deleteOldParents(treeData, treelevel);
          }
          let nextGenParents = parentsplaceholder(selectedNode);
          selectedNode.parents = nextGenParents;
          setParentsArray( arr => [...arr, selectedNode]);
        }
        else if(nextGenAvailable){
          if(expandNodeParentArray.length >= 1) {
            deleteOldParents(treeData, treelevel);
          }
          const res =  await props.addNextGenFamily(selectedNode);
          selectedNode.parents = res;
          if(isExpand){
            //4th Quarter animation
            createQuarterAnimEffect(updateimageicon,"M1,11 a11,11 0 0,1 11,-10")
          }
          setTimeout(() => {
            setParentsArray( arr => [...arr, selectedNode]);  
          }, 100);
        }
        return { ...treeData, selectedNode };
      };
      // To delete previous added parents node local json
      const deleteOldParents = (treeData, clickedTreelevel) => {
        let nodeIndex =  expandNodeParentArray.length - 1;
        if(clickedTreelevel < expandNodeParentArray[nodeIndex].attributes.path.split("/").length)
          while(clickedTreelevel !== expandNodeParentArray[nodeIndex].attributes.path.split("/").length)
             nodeIndex = nodeIndex - 1;
        const parentPath = getPathString(expandNodeParentArray[nodeIndex].attributes.path, false);
        const getStrEval = _.get(treeData, parentPath);
        if(getStrEval.parents && clickedTreelevel === parentPath.split(".").length) {
          getStrEval.isExpand = false
          delete getStrEval.parents;
        }
      }
      let icon
      // Append placeholder nodes on click of expand icon
      const expandOnClick = async(d, imageicon) => {
        let hasNextGen;
        let extendedTreeJson;
        const parentPath = getPathString(d.attributes.path, false);
        const updatedData = { ...data };
        const getStrEval = _.get(updatedData, parentPath);
        if (d.id && _.isEmpty(d.attributes.relatedParentIds)) {
          hasNextGen = false;
          if (getStrEval) extendedTreeJson = await upDateFamily(getStrEval, updatedData, hasNextGen);
          setTreePan(false)
          services.setTreePan(false)
          props.updateTreeJson(extendedTreeJson);
        }
        else if(d.id && d.attributes.relatedParentIds){
          hasNextGen = true;
          let expandFlag = true
          if (getStrEval){
            while(expandFlag){
              if(d.isExpand){
              setTimeout(() => {
                //3rd Quarter animation
                createQuarterAnimEffect(imageicon,"M12,22 a11,11 0 0,1 -11,-11")
              }, 150);
            }
              extendedTreeJson = await upDateFamily(getStrEval, updatedData, hasNextGen, imageicon, d.isExpand);
              expandFlag = false
            }
          }
          
          setTimeout(() => {
            setTreePan(false)
            services.setTreePan(false)
            props.updateTreeJson(extendedTreeJson);
          }, 100);
        }
        else return;
      }

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(animduration)
        .attr("transform", function (d) {
          var p = calcLeft(d, "node");
          return "translate(" + p.y + ", " + p.x + ")";
        });
      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      //cirle at node intersection
      nodeEnter.append('circle')
        .attr("r", function (d) {
          treelevel = d.attributes.path ? d.attributes.path.split("/").length : 0
          if (d.isRight)
           if(treelevel >= 4 && d.parents?.length >=1) return 2
            else if (d.attributes.title || treelevel >= 4) return 0;
            else return 2;
          else if (d.isfocus && (helpers.getFocusNameWidth({ focusNameLength, focusBirthPlacelength, focusDeathPlaceLength, focusBirthDateLength, focusDeathDateLength }, d).focusBirthDeathWidth < 250 && helpers.getFocusNameWidth({ focusNameLength, focusBirthPlacelength, focusDeathPlaceLength, focusBirthDateLength, focusDeathDateLength }, d).focusNameWidth < 260))
            return 2;
          else if (d.isSame && d.childnum > 0)
            return 2;
          else
            return 0
        })
        .attr("transform", function (d) {
          if (!d.isRight) {
            if (d.isfocus) {
              if(focusheight === 68 || focusheight ===78)
              {
                return "translate(273,19)"
              }
              else
              {
                return "translate(273,39)"
              }
            }
            else if (d.isSame) {
              var circley, circlex
              circlex = 15 + ((d.connector - 1) * 10)
              circley = -10
              return "translate(" + circlex + "," + circley + ")"
            }
            return "translate(110,5)"
          }
          else {
            treelevel = d.attributes.path ? d.attributes.path.split("/").length : 0
            if (treelevel === 4)
              return "translate(274,6)"
            else if (treelevel % 4 === 3)
              return "translate(239,6)"
            else if (treelevel>=8 && treelevel % 4 === 0)
              return "translate(274,3)"
            else return "translate(249,6)"
          }
        })
        .style("fill", "#EFEFF0")
        .style("stroke", "#9D9FA2")

        //onclick of arrow btn show 5th generation
        nodeEnter.append("image")
        .attr('x', function (d) {
          treelevel = getTreeLevel(d)
          if (d.isRight && treelevel % 4 === 0)
            return 210;
          else return 0
        })
        .attr('y', function (d) {
          treelevel = getTreeLevel(d)
          if (d.isRight){
            if (treelevel === 4) return -6;
            else if (treelevel >= 8 && treelevel % 4 === 0) return -10;
            else return 0;
          }
          else
            return 0
        })
        .attr('width', function (d) {
          treelevel = getTreeLevel(d)
          if (d.isRight &&  treelevel % 4 === 0)
             return 20;
          else return 0
        })
        .attr('height', function (d) {
          treelevel = getTreeLevel(d)
          if (d.isRight && treelevel % 4 === 0)
             return 24;
          else return 0
        })
        .attr('class','arrow-icon')
        .attr("xlink:href", function (d) {
          treelevel = getTreeLevel(d);
          if (d.isRight)
            if (treelevel % 4 === 0 && d.id) {
              switch (true) {
                case (d.parents && _.isEmpty(d.attributes.relatedParentIds)): //Next gen parents not available (Collapse)
                  return "https://stwaft-blob-core-windows-net.o365.cybage.skyfencenet.com/wa-container/PedigreeSVG/transparentcollapseicon.svg";
                case (_.isEmpty(d.attributes.relatedParentIds)): //Next gen parents not available (Expand)
                  return "https://stwaft-blob-core-windows-net.o365.cybage.skyfencenet.com/wa-container/PedigreeSVG/transparentexpandicon.svg";
                case (d.parents && d.attributes.title == ""): //Next gen parents expanded state (black button with collapse icon)
                  return "https://stwaft.blob.core.windows.net/wa-container/PedigreeSVG/filledopenstate.svg";
                default: //Next gen parents available (Expand)
                  return "https://stwaft-blob-core-windows-net.o365.cybage.skyfencenet.com/wa-container/PedigreeSVG/expandicon.svg";
              }
            } else return "";
          else return "";
        })
        .attr('id',function(d){ return d.id})
        .on("mouseover", function(d){
          if (d.id) {
            switch (true) {
              case ( d.parents && _.isEmpty(d.attributes.relatedParentIds))://Hover when next gen parents not available and expanded with placeholder
                return d3.select(this).attr("xlink:href", "https://stwaft.blob.core.windows.net/wa-container/PedigreeSVG/collapseemptyhoverstate.svg");
              case (_.isEmpty(d.attributes.relatedParentIds))://Hover when next gen parents not available and collapsed with placeholder
                return d3.select(this).attr("xlink:href", "https://stwaft-blob-core-windows-net.o365.cybage.skyfencenet.com/wa-container/PedigreeSVG/emptyhoverstate.svg");
              case (d.parents && d.attributes.title == "")://Hover when next gen parents available and expanded
                return d3.select(this).attr("xlink:href", "https://stwaft.blob.core.windows.net/wa-container/PedigreeSVG/collapsefilledhoverstate.svg");
              default://Hover when next gen parents available and not yet expanded
                return d3.select(this).attr("xlink:href", "https://stwaft.blob.core.windows.net/wa-container/PedigreeSVG/filledhoverstate.svg");
            }
          }
        })
        .on("mousedown", function(d){
          if (d.id) {
            if(d.attributes.relatedParentIds && d.attributes.title == "")//Mouse down when next gen parents available and trying to expand
              return d3.select(this).attr("xlink:href", "https://stwaft-blob-core-windows-net.o365.cybage.skyfencenet.com/wa-container/PedigreeSVG/Expand-icon-mousedown.svg");
          }
        })
        .on("mouseup", function(d){
          if (d.id) {
            if(d.attributes.relatedParentIds && d.attributes.title == "")//Mouse down when next gen parents available and trying to expand
              return d3.select(this).attr("xlink:href", "https://stwaft.blob.core.windows.net/wa-container/PedigreeSVG/filledhoverstate.svg");
          }
        })
        .on("click",function(d){
            if (d.id) {
              if(!d.isExpand)
                d.isExpand = true
              else
                d.isExpand = false
              if(d.isExpand){
                let posy 
                if(d.attributes.path.split("/").length >=8)
                  posy = -10
                else  
                  posy = -5.5
                icon = d3.select(this.parentNode).append("svg")
                .attr("x", "208.5")
                .attr("y", posy)
                setTimeout(() => {
                  //1st Quarter animation
                  createQuarterAnimEffect(icon,"M11,1 a11,11 0 0,1 11,11")
                }, 10);
                setTimeout(() => {
                  //2nd Quarter animation
                  createQuarterAnimEffect(icon,"M22,11 a11,11 0 0,1 -11,11")
                }, 150);
            }
              expandOnClick(d, icon)
            }
        })
        .on("mouseout", function(d){
          if (d.id) {
            switch (true) {
              case (d.parents && _.isEmpty(d.attributes.relatedParentIds))://Mouse release when next gen parents not available and expanded with empty placeholder
                return d3.select(this).attr("xlink:href", "https://stwaft.blob.core.windows.net/wa-container/PedigreeSVG/transparentcollapseicon.svg");
              case (_.isEmpty(d.attributes.relatedParentIds))://Mouse release when next gen parents not available and not expanded
                return d3.select(this).attr("xlink:href", "https://stwaft-blob-core-windows-net.o365.cybage.skyfencenet.com/wa-container/PedigreeSVG/transparentexpandicon.svg");
              case (d.parents && d.attributes.title == "")://Mouse release when next gen parents available and expanded
                return d3.select(this).attr("xlink:href", "https://stwaft.blob.core.windows.net/wa-container/PedigreeSVG/filledopenstate.svg");
              default://Mouse release when next gen parents available and not yet expanded
                return d3.select(this).attr("xlink:href", "https://stwaft-blob-core-windows-net.o365.cybage.skyfencenet.com/wa-container/PedigreeSVG/expandicon.svg");
            }
          }
        }
       )

      // Update the links
      var link = vis.selectAll("path.link").data(tree.links(nodes), function (d) {
        return d.target.Uid;
      });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function (d) {
          var o = {
            x: sourceupdate.x0,
            y: sourceupdate.y0
          };
          return connector({
            source: o,
            target: o
          });
        });

      // Transition links to their new position.
      link.transition()
        .duration(animduration)
        .attr("d", connector); /**/
    }

    // TO ARRAY
    function toArray(item, arr) {
      arr = arr || [];
      var i = 0,
        countloop = item.children ? item.children.length : 0;
      arr.push(item);
      for (; i < countloop; i++) {
        toArray(item.children[i], arr);
      }
      return arr;
    }
    document.getElementById("search").classList.remove("icon-disable")
    document.getElementById("reset").classList.remove("icon-disable")
    if (primaryPersonId !== homePerson) //Enable Home icon as Focus person in tree is different then Home Person
    {
      document.getElementById("btnhomePerson").classList.add("home-icon")
      document.getElementById("btnhomePerson").classList.remove("home-disable")
      document.getElementById("homePerson").classList.remove("icon-disable")
    }
    else //Disable Home icon as Focus person in tree is same as Home Person
    {
      document.getElementById("btnhomePerson").classList.remove("home-icon")
      document.getElementById("btnhomePerson").classList.add("home-disable")
      document.getElementById("homePerson").classList.add("icon-disable")
    }
  });
  return (
    <>
      <div className="d3tree-container" ref={chartRef}></div>
      <Actions 
      handleDrawer = {props.handleDrawer}
      />
      
    </>
  );
}
export default D3Tree;