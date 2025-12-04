import {
  _objectSpread2,
  _objectWithoutProperties
} from "./chunk-3VO6AZ6S.js";
import "./chunk-33FMLZDD.js";
import {
  _slicedToArray,
  init_slicedToArray
} from "./chunk-INGDE2HJ.js";
import {
  _typeof,
  init_typeof
} from "./chunk-EZTFGPRW.js";
import "./chunk-AVUONKA5.js";
import {
  _extends
} from "./chunk-HQ6ZTAWL.js";
import {
  require_react
} from "./chunk-W4EHDCLL.js";
import {
  __commonJS,
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/classnames/index.js
var require_classnames = __commonJS({
  "node_modules/classnames/index.js"(exports, module) {
    (function() {
      "use strict";
      var hasOwn = {}.hasOwnProperty;
      function classNames3() {
        var classes = "";
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (arg) {
            classes = appendClass(classes, parseValue(arg));
          }
        }
        return classes;
      }
      function parseValue(arg) {
        if (typeof arg === "string" || typeof arg === "number") {
          return arg;
        }
        if (typeof arg !== "object") {
          return "";
        }
        if (Array.isArray(arg)) {
          return classNames3.apply(null, arg);
        }
        if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
          return arg.toString();
        }
        var classes = "";
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
          }
        }
        return classes;
      }
      function appendClass(value, newClass) {
        if (!newClass) {
          return value;
        }
        if (value) {
          return value + " " + newClass;
        }
        return value + newClass;
      }
      if (typeof module !== "undefined" && module.exports) {
        classNames3.default = classNames3;
        module.exports = classNames3;
      } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
        define("classnames", [], function() {
          return classNames3;
        });
      } else {
        window.classNames = classNames3;
      }
    })();
  }
});

// node_modules/rc-progress/es/Line.js
var React = __toESM(require_react());
var import_classnames = __toESM(require_classnames());

// node_modules/rc-progress/es/common.js
var import_react = __toESM(require_react());
var defaultProps = {
  percent: 0,
  prefixCls: "rc-progress",
  strokeColor: "#2db7f5",
  strokeLinecap: "round",
  strokeWidth: 1,
  trailColor: "#D9D9D9",
  trailWidth: 1,
  gapPosition: "bottom"
};
var useTransitionDuration = function useTransitionDuration2() {
  var pathsRef = (0, import_react.useRef)([]);
  var prevTimeStamp = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(function() {
    var now = Date.now();
    var updated = false;
    pathsRef.current.forEach(function(path) {
      if (!path) {
        return;
      }
      updated = true;
      var pathStyle = path.style;
      pathStyle.transitionDuration = ".3s, .3s, .3s, .06s";
      if (prevTimeStamp.current && now - prevTimeStamp.current < 100) {
        pathStyle.transitionDuration = "0s, 0s";
      }
    });
    if (updated) {
      prevTimeStamp.current = Date.now();
    }
  });
  return pathsRef.current;
};

// node_modules/rc-progress/es/Line.js
var _excluded = ["className", "percent", "prefixCls", "strokeColor", "strokeLinecap", "strokeWidth", "style", "trailColor", "trailWidth", "transition"];
var Line = function Line2(props) {
  var _defaultProps$props = _objectSpread2(_objectSpread2({}, defaultProps), props), className = _defaultProps$props.className, percent = _defaultProps$props.percent, prefixCls = _defaultProps$props.prefixCls, strokeColor = _defaultProps$props.strokeColor, strokeLinecap = _defaultProps$props.strokeLinecap, strokeWidth = _defaultProps$props.strokeWidth, style = _defaultProps$props.style, trailColor = _defaultProps$props.trailColor, trailWidth = _defaultProps$props.trailWidth, transition = _defaultProps$props.transition, restProps = _objectWithoutProperties(_defaultProps$props, _excluded);
  delete restProps.gapPosition;
  var percentList = Array.isArray(percent) ? percent : [percent];
  var strokeColorList = Array.isArray(strokeColor) ? strokeColor : [strokeColor];
  var paths = useTransitionDuration();
  var center = strokeWidth / 2;
  var right = 100 - strokeWidth / 2;
  var pathString = "M ".concat(strokeLinecap === "round" ? center : 0, ",").concat(center, "\n         L ").concat(strokeLinecap === "round" ? right : 100, ",").concat(center);
  var viewBoxString = "0 0 100 ".concat(strokeWidth);
  var stackPtg = 0;
  return React.createElement("svg", _extends({
    className: (0, import_classnames.default)("".concat(prefixCls, "-line"), className),
    viewBox: viewBoxString,
    preserveAspectRatio: "none",
    style
  }, restProps), React.createElement("path", {
    className: "".concat(prefixCls, "-line-trail"),
    d: pathString,
    strokeLinecap,
    stroke: trailColor,
    strokeWidth: trailWidth || strokeWidth,
    fillOpacity: "0"
  }), percentList.map(function(ptg, index) {
    var dashPercent = 1;
    switch (strokeLinecap) {
      case "round":
        dashPercent = 1 - strokeWidth / 100;
        break;
      case "square":
        dashPercent = 1 - strokeWidth / 2 / 100;
        break;
      default:
        dashPercent = 1;
        break;
    }
    var pathStyle = {
      strokeDasharray: "".concat(ptg * dashPercent, "px, 100px"),
      strokeDashoffset: "-".concat(stackPtg, "px"),
      transition: transition || "stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear"
    };
    var color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
    stackPtg += ptg;
    return React.createElement("path", {
      key: index,
      className: "".concat(prefixCls, "-line-path"),
      d: pathString,
      strokeLinecap,
      stroke: color,
      strokeWidth,
      fillOpacity: "0",
      ref: function ref(elem) {
        paths[index] = elem;
      },
      style: pathStyle
    });
  }));
};
if (true) {
  Line.displayName = "Line";
}
var Line_default = Line;

// node_modules/rc-progress/es/Circle/index.js
init_typeof();
var React4 = __toESM(require_react());
var import_classnames2 = __toESM(require_classnames());

// node_modules/rc-progress/es/hooks/useId.js
init_slicedToArray();
var React2 = __toESM(require_react());

// node_modules/rc-util/es/Dom/canUseDom.js
function canUseDom() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}

// node_modules/rc-progress/es/hooks/useId.js
var uuid = 0;
var isBrowserClient = canUseDom();
function getUUID() {
  var retId;
  if (isBrowserClient) {
    retId = uuid;
    uuid += 1;
  } else {
    retId = "TEST_OR_SSR";
  }
  return retId;
}
var useId_default = function(id) {
  var _React$useState = React2.useState(), _React$useState2 = _slicedToArray(_React$useState, 2), innerId = _React$useState2[0], setInnerId = _React$useState2[1];
  React2.useEffect(function() {
    setInnerId("rc_progress_".concat(getUUID()));
  }, []);
  return id || innerId;
};

// node_modules/rc-progress/es/Circle/PtgCircle.js
init_typeof();
var React3 = __toESM(require_react());
var Block = function Block2(_ref) {
  var bg = _ref.bg, children = _ref.children;
  return React3.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: bg
    }
  }, children);
};
function getPtgColors(color, scale) {
  return Object.keys(color).map(function(key) {
    var parsedKey = parseFloat(key);
    var ptgKey = "".concat(Math.floor(parsedKey * scale), "%");
    return "".concat(color[key], " ").concat(ptgKey);
  });
}
var PtgCircle = React3.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, color = props.color, gradientId = props.gradientId, radius = props.radius, circleStyleForStack = props.style, ptg = props.ptg, strokeLinecap = props.strokeLinecap, strokeWidth = props.strokeWidth, size = props.size, gapDegree = props.gapDegree;
  var isGradient = color && _typeof(color) === "object";
  var stroke = isGradient ? "#FFF" : void 0;
  var halfSize = size / 2;
  var circleNode = React3.createElement("circle", {
    className: "".concat(prefixCls, "-circle-path"),
    r: radius,
    cx: halfSize,
    cy: halfSize,
    stroke,
    strokeLinecap,
    strokeWidth,
    opacity: ptg === 0 ? 0 : 1,
    style: circleStyleForStack,
    ref
  });
  if (!isGradient) {
    return circleNode;
  }
  var maskId = "".concat(gradientId, "-conic");
  var fromDeg = gapDegree ? "".concat(180 + gapDegree / 2, "deg") : "0deg";
  var conicColors = getPtgColors(color, (360 - gapDegree) / 360);
  var linearColors = getPtgColors(color, 1);
  var conicColorBg = "conic-gradient(from ".concat(fromDeg, ", ").concat(conicColors.join(", "), ")");
  var linearColorBg = "linear-gradient(to ".concat(gapDegree ? "bottom" : "top", ", ").concat(linearColors.join(", "), ")");
  return React3.createElement(React3.Fragment, null, React3.createElement("mask", {
    id: maskId
  }, circleNode), React3.createElement("foreignObject", {
    x: 0,
    y: 0,
    width: size,
    height: size,
    mask: "url(#".concat(maskId, ")")
  }, React3.createElement(Block, {
    bg: linearColorBg
  }, React3.createElement(Block, {
    bg: conicColorBg
  }))));
});
if (true) {
  PtgCircle.displayName = "PtgCircle";
}
var PtgCircle_default = PtgCircle;

// node_modules/rc-progress/es/Circle/util.js
var VIEW_BOX_SIZE = 100;
var getCircleStyle = function getCircleStyle2(perimeter, perimeterWithoutGap, offset, percent, rotateDeg, gapDegree, gapPosition, strokeColor, strokeLinecap, strokeWidth) {
  var stepSpace = arguments.length > 10 && arguments[10] !== void 0 ? arguments[10] : 0;
  var offsetDeg = offset / 100 * 360 * ((360 - gapDegree) / 360);
  var positionDeg = gapDegree === 0 ? 0 : {
    bottom: 0,
    top: 180,
    left: 90,
    right: -90
  }[gapPosition];
  var strokeDashoffset = (100 - percent) / 100 * perimeterWithoutGap;
  if (strokeLinecap === "round" && percent !== 100) {
    strokeDashoffset += strokeWidth / 2;
    if (strokeDashoffset >= perimeterWithoutGap) {
      strokeDashoffset = perimeterWithoutGap - 0.01;
    }
  }
  var halfSize = VIEW_BOX_SIZE / 2;
  return {
    stroke: typeof strokeColor === "string" ? strokeColor : void 0,
    strokeDasharray: "".concat(perimeterWithoutGap, "px ").concat(perimeter),
    strokeDashoffset: strokeDashoffset + stepSpace,
    transform: "rotate(".concat(rotateDeg + offsetDeg + positionDeg, "deg)"),
    transformOrigin: "".concat(halfSize, "px ").concat(halfSize, "px"),
    transition: "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s",
    fillOpacity: 0
  };
};

// node_modules/rc-progress/es/Circle/index.js
var _excluded2 = ["id", "prefixCls", "steps", "strokeWidth", "trailWidth", "gapDegree", "gapPosition", "trailColor", "strokeLinecap", "style", "className", "strokeColor", "percent"];
function toArray(value) {
  var mergedValue = value !== null && value !== void 0 ? value : [];
  return Array.isArray(mergedValue) ? mergedValue : [mergedValue];
}
var Circle = function Circle2(props) {
  var _defaultProps$props = _objectSpread2(_objectSpread2({}, defaultProps), props), id = _defaultProps$props.id, prefixCls = _defaultProps$props.prefixCls, steps = _defaultProps$props.steps, strokeWidth = _defaultProps$props.strokeWidth, trailWidth = _defaultProps$props.trailWidth, _defaultProps$props$g = _defaultProps$props.gapDegree, gapDegree = _defaultProps$props$g === void 0 ? 0 : _defaultProps$props$g, gapPosition = _defaultProps$props.gapPosition, trailColor = _defaultProps$props.trailColor, strokeLinecap = _defaultProps$props.strokeLinecap, style = _defaultProps$props.style, className = _defaultProps$props.className, strokeColor = _defaultProps$props.strokeColor, percent = _defaultProps$props.percent, restProps = _objectWithoutProperties(_defaultProps$props, _excluded2);
  var halfSize = VIEW_BOX_SIZE / 2;
  var mergedId = useId_default(id);
  var gradientId = "".concat(mergedId, "-gradient");
  var radius = halfSize - strokeWidth / 2;
  var perimeter = Math.PI * 2 * radius;
  var rotateDeg = gapDegree > 0 ? 90 + gapDegree / 2 : -90;
  var perimeterWithoutGap = perimeter * ((360 - gapDegree) / 360);
  var _ref = _typeof(steps) === "object" ? steps : {
    count: steps,
    gap: 2
  }, stepCount = _ref.count, stepGap = _ref.gap;
  var percentList = toArray(percent);
  var strokeColorList = toArray(strokeColor);
  var gradient = strokeColorList.find(function(color) {
    return color && _typeof(color) === "object";
  });
  var isConicGradient = gradient && _typeof(gradient) === "object";
  var mergedStrokeLinecap = isConicGradient ? "butt" : strokeLinecap;
  var circleStyle = getCircleStyle(perimeter, perimeterWithoutGap, 0, 100, rotateDeg, gapDegree, gapPosition, trailColor, mergedStrokeLinecap, strokeWidth);
  var paths = useTransitionDuration();
  var getStokeList = function getStokeList2() {
    var stackPtg = 0;
    return percentList.map(function(ptg, index) {
      var color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
      var circleStyleForStack = getCircleStyle(perimeter, perimeterWithoutGap, stackPtg, ptg, rotateDeg, gapDegree, gapPosition, color, mergedStrokeLinecap, strokeWidth);
      stackPtg += ptg;
      return React4.createElement(PtgCircle_default, {
        key: index,
        color,
        ptg,
        radius,
        prefixCls,
        gradientId,
        style: circleStyleForStack,
        strokeLinecap: mergedStrokeLinecap,
        strokeWidth,
        gapDegree,
        ref: function ref(elem) {
          paths[index] = elem;
        },
        size: VIEW_BOX_SIZE
      });
    }).reverse();
  };
  var getStepStokeList = function getStepStokeList2() {
    var current = Math.round(stepCount * (percentList[0] / 100));
    var stepPtg = 100 / stepCount;
    var stackPtg = 0;
    return new Array(stepCount).fill(null).map(function(_, index) {
      var color = index <= current - 1 ? strokeColorList[0] : trailColor;
      var stroke = color && _typeof(color) === "object" ? "url(#".concat(gradientId, ")") : void 0;
      var circleStyleForStack = getCircleStyle(perimeter, perimeterWithoutGap, stackPtg, stepPtg, rotateDeg, gapDegree, gapPosition, color, "butt", strokeWidth, stepGap);
      stackPtg += (perimeterWithoutGap - circleStyleForStack.strokeDashoffset + stepGap) * 100 / perimeterWithoutGap;
      return React4.createElement("circle", {
        key: index,
        className: "".concat(prefixCls, "-circle-path"),
        r: radius,
        cx: halfSize,
        cy: halfSize,
        stroke,
        strokeWidth,
        opacity: 1,
        style: circleStyleForStack,
        ref: function ref(elem) {
          paths[index] = elem;
        }
      });
    });
  };
  return React4.createElement("svg", _extends({
    className: (0, import_classnames2.default)("".concat(prefixCls, "-circle"), className),
    viewBox: "0 0 ".concat(VIEW_BOX_SIZE, " ").concat(VIEW_BOX_SIZE),
    style,
    id,
    role: "presentation"
  }, restProps), !stepCount && React4.createElement("circle", {
    className: "".concat(prefixCls, "-circle-trail"),
    r: radius,
    cx: halfSize,
    cy: halfSize,
    stroke: trailColor,
    strokeLinecap: mergedStrokeLinecap,
    strokeWidth: trailWidth || strokeWidth,
    style: circleStyle
  }), stepCount ? getStepStokeList() : getStokeList());
};
if (true) {
  Circle.displayName = "Circle";
}
var Circle_default = Circle;

// node_modules/rc-progress/es/index.js
var es_default = {
  Line: Line_default,
  Circle: Circle_default
};
export {
  Circle_default as Circle,
  Line_default as Line,
  es_default as default
};
/*! Bundled license information:

classnames/index.js:
  (*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  *)
*/
//# sourceMappingURL=rc-progress.js.map
