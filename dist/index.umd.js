(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dotsAnim = {}));
}(this, (function (exports) { 'use strict';

    const defaultOptions = {
        expectedFps: 60,
        number: null,
        density: 0.00005,
        dprDependentDensity: true,
        dprDependentDimensions: true,
        minR: 1,
        maxR: 6,
        minSpeedX: -0.5,
        maxSpeedX: 0.5,
        minSpeedY: -0.5,
        maxSpeedY: 0.5,
        blur: 1,
        fill: true,
        colorsFill: ["#ffffff", "#fff4c1", "#faefdb"],
        opacityFill: null,
        opacityFillMin: 0,
        opacityFillStep: 0,
        stroke: false,
        colorsStroke: ["#ffffff"],
        opacityStroke: 1,
        opacityStrokeMin: 0,
        opacityStrokeStep: 0,
        drawLines: true,
        lineColor: "#717892",
        lineLength: 150,
        lineWidth: 2,
        actionOnClick: true,
        actionOnHover: true,
        onClickCreate: false,
        onClickMove: true,
        onHoverMove: true,
        onHoverDrawLines: true,
        onClickCreateNDots: 10,
        onClickMoveRadius: 200,
        onHoverMoveRadius: 50,
        onHoverLineRadius: 150
    };

    function getRandomUuid() {
        return crypto.getRandomValues(new Uint32Array(4)).join("-");
    }
    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    function getRandomInt(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    function hexToRgba(hex, opacity, denominator = 1) {
        hex = hex.replace("#", "");
        const r = parseInt(hex.substring(0, hex.length / 3), 16);
        const g = parseInt(hex.substring(hex.length / 3, 2 * hex.length / 3), 16);
        const b = parseInt(hex.substring(2 * hex.length / 3, 3 * hex.length / 3), 16);
        return "rgba(" + r + "," + g + "," + b + "," + opacity / denominator + ")";
    }
    function drawCircle(ctx, x, y, r, colorS, colorF) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        if (colorF !== null) {
            ctx.fillStyle = colorF;
            ctx.fill();
        }
        if (colorS !== null) {
            ctx.strokeStyle = colorS;
            ctx.stroke();
        }
    }
    function drawLine(ctx, x1, y1, x2, y2, width, color) {
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    class Dot {
        constructor(_canvas, _offset, _x, _y, _xSpeed, _ySpeed, _r, _colorSHex, _colorFHex, _opacitySMin, _opacitySMax, _opacitySStep, _opacityFMin, _opacityFMax, _opacityFStep) {
            this._canvas = _canvas;
            this._offset = _offset;
            this._x = _x;
            this._y = _y;
            this._xSpeed = _xSpeed;
            this._ySpeed = _ySpeed;
            this._r = _r;
            this._colorSHex = _colorSHex;
            this._colorFHex = _colorFHex;
            this._opacitySMin = _opacitySMin;
            this._opacitySMax = _opacitySMax;
            this._opacitySStep = _opacitySStep;
            this._opacityFMin = _opacityFMin;
            this._opacityFMax = _opacityFMax;
            this._opacityFStep = _opacityFStep;
            this._opacitySCurrent = _opacitySMax;
            this._opacityFCurrent = _opacityFMax;
            this._colorS = _colorSHex === null ?
                null : hexToRgba(_colorSHex, this._opacitySCurrent, 100);
            this._colorF = _colorFHex === null ?
                null : hexToRgba(_colorFHex, this._opacityFCurrent, 100);
        }
        getProps() {
            return {
                x: this._x,
                y: this._y,
                r: this._r,
                xSpeed: this._xSpeed,
                ySpeed: this._ySpeed,
                colorS: this._colorS,
                colorF: this._colorF
            };
        }
        updatePosition() {
            const offset = Math.max(this._offset, this._r);
            const xMin = -1 * offset;
            const yMin = -1 * offset;
            const xMax = this._canvas.width + offset;
            const yMax = this._canvas.height + offset;
            if (this._x < xMin) {
                this._x = xMax;
            }
            else if (this._x > xMax) {
                this._x = xMin;
            }
            else {
                this._x += this._xSpeed;
            }
            if (this._y < yMin) {
                this._y = yMax;
            }
            else if (this._y > yMax) {
                this._y = yMin;
            }
            else {
                this._y += this._ySpeed;
            }
        }
        updateColor() {
            if (this._opacitySStep !== 0 && this._colorSHex !== null) {
                this._opacitySCurrent += this._opacitySStep;
                if (this._opacitySCurrent > this._opacitySMax) {
                    this._opacitySCurrent = this._opacitySMax;
                    this._opacitySStep *= -1;
                }
                else if (this._opacitySCurrent < this._opacitySMin) {
                    this._opacitySCurrent = this._opacitySMin;
                    this._opacitySStep *= -1;
                }
                this._colorS = hexToRgba(this._colorSHex, this._opacityFCurrent, 100);
            }
            if (this._opacityFStep !== 0 && this._colorFHex !== null) {
                this._opacityFCurrent += this._opacityFStep;
                if (this._opacityFCurrent > this._opacityFMax) {
                    this._opacityFCurrent = this._opacityFMax;
                    this._opacityFStep *= -1;
                }
                else if (this._opacityFCurrent < this._opacityFMin) {
                    this._opacityFCurrent = this._opacityFMin;
                    this._opacityFStep *= -1;
                }
                this._colorF = hexToRgba(this._colorFHex, this._opacityFCurrent, 100);
            }
        }
        moveTo(position) {
            this._x = position.x;
            this._y = position.y;
        }
    }
    class DotControl {
        constructor(canvas, options) {
            this._pauseState = false;
            this._array = [];
            this._maxNumber = 100;
            this._lastDpr = 0;
            this._canvas = canvas;
            const canvasCtx = this._canvas.getContext("2d");
            if (canvasCtx === null) {
                throw new Error("Canvas context is null");
            }
            this._canvasCtx = canvasCtx;
            this._options = options;
        }
        setPauseState(pauseState) {
            this._pauseState = pauseState;
        }
        draw(mousePosition, isClicked) {
            const dpr = window.devicePixelRatio;
            if (dpr !== this._lastDpr) {
                this._array.length = 0;
            }
            this._lastDpr = dpr;
            const isNumberUpdated = this.updateDotNumber();
            if (!isNumberUpdated && this._pauseState && !this.isCanvasEmpty()) {
                return;
            }
            this._canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            for (const dot of this._array) {
                dot.updatePosition();
                dot.updateColor();
            }
            const ratio = this._options.dprDependentDimensions ? dpr : 1;
            if (this._options.actionOnHover) {
                if (this._options.onHoverDrawLines) {
                    this.drawLinesToCircleCenter(mousePosition, this._options.onHoverLineRadius * ratio, this._options.lineWidth, this._options.lineColor);
                }
                if (this._options.onHoverMove) {
                    this.moveDotsOutOfCircle(mousePosition, this._options.onHoverMoveRadius * ratio);
                }
            }
            if (isClicked && this._options.actionOnClick) {
                if (this._options.onClickMove) {
                    this.moveDotsOutOfCircle(mousePosition, this._options.onClickMoveRadius * ratio);
                }
                if (this._options.onClickCreate) {
                    this.dotFactory(this._options.onClickCreateNDots, mousePosition);
                }
            }
            if (this._options.drawLines) {
                this.drawLinesBetweenDots();
            }
            for (const dot of this._array) {
                const params = dot.getProps();
                drawCircle(this._canvasCtx, params.x, params.y, params.r, params.colorS, params.colorF);
            }
        }
        isCanvasEmpty() {
            return !this._canvasCtx
                .getImageData(0, 0, this._canvas.width, this._canvas.height)
                .data.some(channel => channel !== 0);
        }
        dotFactory(number, position = null) {
            for (let i = 0; i < number; i++) {
                const dot = this.createRandomDot(position);
                this._array.push(dot);
            }
            if (this._array.length > this._maxNumber) {
                this.deleteEldestDots(this._array.length - this._maxNumber);
            }
        }
        createRandomDot(position) {
            let x, y;
            if (position) {
                x = position.x;
                y = position.y;
            }
            else {
                x = getRandomInt(0, this._canvas.width);
                y = getRandomInt(0, this._canvas.height);
            }
            const dimRatio = this._options.dprDependentDimensions ? window.devicePixelRatio : 1;
            const offset = this._options.drawLines ? this._options.lineLength * dimRatio : 0;
            const xSpeed = getRandomArbitrary(this._options.minSpeedX, this._options.maxSpeedX) * dimRatio;
            const ySpeed = getRandomArbitrary(this._options.minSpeedY, this._options.maxSpeedY) * dimRatio;
            const radius = getRandomInt(this._options.minR, this._options.maxR) * dimRatio;
            let colorS = null;
            let colorF = null;
            if (this._options.stroke) {
                colorS = this._options.colorsStroke[Math.floor(Math.random() *
                    this._options.colorsStroke.length)];
            }
            if (this._options.fill) {
                colorF = this._options.colorsFill[Math.floor(Math.random() *
                    this._options.colorsFill.length)];
            }
            const opacitySMin = this._options.opacityStrokeMin;
            const opacitySMax = this._options.opacityStroke ?
                Math.max(opacitySMin, this._options.opacityStroke) :
                getRandomInt(opacitySMin, 100);
            const opacitySStep = this._options.opacityStrokeStep;
            const opacityFMin = this._options.opacityFillMin;
            const opacityFMax = this._options.opacityFill ?
                Math.max(opacityFMin, this._options.opacityFill) :
                getRandomInt(opacityFMin, 100);
            const opacityFStep = this._options.opacityFillStep;
            return new Dot(this._canvas, offset, x, y, xSpeed, ySpeed, radius, colorS, colorF, opacitySMin, opacitySMax, opacitySStep, opacityFMin, opacityFMax, opacityFStep);
        }
        deleteEldestDots(number) {
            this._array = this._array.slice(number);
            for (let i = 0; i < number; i++) {
                this._array.shift();
            }
        }
        getDotNumber() {
            const densityRatio = this._options.dprDependentDensity ? window.devicePixelRatio : 1;
            const calculatedNumber = Math.floor(this._canvas.width * this._canvas.height * this._options.density / densityRatio);
            return this._options.number ? this._options.number : calculatedNumber;
        }
        updateDotNumber() {
            this._maxNumber = this.getDotNumber();
            if (this._maxNumber < this._array.length) {
                this.deleteEldestDots(this._array.length - this._maxNumber);
                return true;
            }
            else if (this._maxNumber > this._array.length) {
                this.dotFactory(this._maxNumber - this._array.length);
                return true;
            }
            else {
                return false;
            }
        }
        getCloseDotPairs(maxDistance) {
            const dotArray = this._array;
            const closePairs = [];
            for (let i = 0; i < dotArray.length; i++) {
                for (let j = i; j < dotArray.length; j++) {
                    const dotIParams = dotArray[i].getProps();
                    const dotJParams = dotArray[j].getProps();
                    const distance = Math.floor(getDistance(dotIParams.x, dotIParams.y, dotJParams.x, dotJParams.y));
                    if (distance <= maxDistance) {
                        closePairs.push([dotIParams.x, dotIParams.y, dotJParams.x, dotJParams.y, distance]);
                    }
                }
            }
            return closePairs;
        }
        getDotsInsideCircle(position, radius) {
            const dotsInCircle = [];
            for (const dot of this._array) {
                const dotParams = dot.getProps();
                const distance = getDistance(position.x, position.y, dotParams.x, dotParams.y);
                if (distance < radius) {
                    dotsInCircle.push([dot, distance]);
                }
            }
            return dotsInCircle;
        }
        moveDotsOutOfCircle(position, radius) {
            const dotsInCircle = this.getDotsInsideCircle(position, radius);
            for (const item of dotsInCircle) {
                const dot = item[0];
                const dotParams = dot.getProps();
                const distance = item[1];
                const x = (dotParams.x - position.x) * (radius / distance) + position.x;
                const y = (dotParams.y - position.y) * (radius / distance) + position.y;
                dot.moveTo({ x: x, y: y });
            }
        }
        drawLinesBetweenDots() {
            const ratio = this._options.dprDependentDimensions ? window.devicePixelRatio : 1;
            const lineLength = this._options.lineLength * ratio;
            const pairs = this.getCloseDotPairs(lineLength);
            const width = this._options.lineWidth;
            for (const pair of pairs) {
                const opacity = (1 - pair[4] / lineLength) / 2;
                const color = hexToRgba(this._options.lineColor, opacity);
                drawLine(this._canvasCtx, pair[0], pair[1], pair[2], pair[3], width, color);
            }
        }
        drawLinesToCircleCenter(position, radius, lineWidth, lineColor) {
            const dotsInCircle = this.getDotsInsideCircle(position, radius);
            for (const item of dotsInCircle) {
                const dot = item[0];
                const dotParams = dot.getProps();
                const opacity = (1 - item[1] / radius);
                const color = hexToRgba(lineColor, opacity);
                drawLine(this._canvasCtx, position.x, position.y, dotParams.x, dotParams.y, lineWidth, color);
            }
        }
    }
    class DotsAnimation {
        constructor(parent, options, constructor) {
            this._timer = undefined;
            this._isMouseClicked = false;
            this._parent = parent;
            this._mousePosition = {
                x: 0,
                y: 0,
            };
            this._fps = options.expectedFps;
            this._canvas = document.createElement("canvas");
            this._canvas.id = getRandomUuid();
            this._canvas.style.display = "block";
            this._canvas.style.width = "100%";
            this._canvas.style.width = "100%";
            this._canvas.style.height = "100%";
            this._canvas.style.filter = `blur(${options.blur}px)`;
            this.resize();
            parent.appendChild(this._canvas);
            window.addEventListener("resize", () => { this.resize(); });
            this._animationControl = DotsAnimation
                .animationControlFactory(constructor, this._canvas, options);
        }
        static animationControlFactory(constructor, canvas, options) {
            return new constructor(canvas, options);
        }
        resize() {
            const dpr = window.devicePixelRatio;
            this._canvas.width = this._parent.offsetWidth * dpr;
            this._canvas.height = this._parent.offsetHeight * dpr;
        }
        draw() {
            this._animationControl.draw(this._mousePosition, this._isMouseClicked);
            this._isMouseClicked = false;
        }
        start() {
            this._animationControl.setPauseState(false);
            if (this._timer !== undefined) {
                return;
            }
            this._timer = window.setInterval(() => {
                window.requestAnimationFrame(() => { this.draw(); }) ||
                    window.webkitRequestAnimationFrame(() => { this.draw(); });
            }, 1000 / this._fps);
            window.addEventListener("mousemove", this.onMouseMove.bind(this));
            window.addEventListener("click", this.onClick.bind(this));
        }
        pause() {
            this._animationControl.setPauseState(true);
        }
        stop() {
            clearInterval(this._timer);
            this._timer = undefined;
            const canvasCtx = this._canvas.getContext("2d");
            window.setTimeout(() => {
                if (canvasCtx !== null) {
                    canvasCtx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                }
            }, 20);
        }
        onClick() {
            this._isMouseClicked = true;
        }
        onMouseMove(e) {
            const dpr = window.devicePixelRatio;
            const parentRect = this._parent.getBoundingClientRect();
            const xRelToDoc = parentRect.left +
                document.documentElement.scrollLeft;
            const yRelToDoc = parentRect.top +
                document.documentElement.scrollTop;
            const xDpr = (e.clientX - xRelToDoc + window.pageXOffset) * dpr;
            const yDpr = (e.clientY - yRelToDoc + window.pageYOffset) * dpr;
            this._mousePosition.x = xDpr;
            this._mousePosition.y = yDpr;
        }
    }
    class AnimationFactory {
        static createDotsAnimation(containerSelector, options = null) {
            const combinedOptions = Object.assign({}, defaultOptions, options || {});
            const container = document.querySelector(containerSelector);
            if (!container) {
                throw new Error("Container not found");
            }
            if (window.getComputedStyle(container).getPropertyValue("position") === "static") {
                throw new Error("Container is not positioned");
            }
            return new DotsAnimation(container, combinedOptions, DotControl);
        }
    }

    exports.AnimationFactory = AnimationFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
