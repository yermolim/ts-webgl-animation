function getRandomUuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join("-");
}

class Vec2 {
    constructor(x = 0, y = 0) {
        this.length = 2;
        this.x = x;
        this.y = y;
    }
    static multiplyByScalar(v, s) {
        return new Vec2(v.x * s, v.y * s);
    }
    static addScalar(v, s) {
        return new Vec2(v.x + s, v.y + s);
    }
    static normalize(v) {
        return new Vec2().setFromVec2(v).normalize();
    }
    static add(v1, v2) {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }
    static substract(v1, v2) {
        return new Vec2(v1.x - v2.x, v1.y - v2.y);
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static applyMat3(v, m) {
        return v.clone().applyMat3(m);
    }
    static lerp(v1, v2, t) {
        return v1.clone().lerp(v2, t);
    }
    static rotate(v, center, theta) {
        return v.clone().rotate(center, theta);
    }
    static equals(v1, v2, precision = 6) {
        return v1.equals(v2);
    }
    static getDistance(v1, v2) {
        const x = v2.x - v1.x;
        const y = v2.y - v1.y;
        return Math.sqrt(x * x + y * y);
    }
    clone() {
        return new Vec2(this.x, this.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    setFromVec2(vec2) {
        this.x = vec2.x;
        this.y = vec2.y;
        return this;
    }
    multiplyByScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const m = this.getMagnitude();
        if (m) {
            this.x /= m;
            this.y /= m;
        }
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    substract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    dotProduct(v) {
        return Vec2.dotProduct(this, v);
    }
    applyMat3(m) {
        if (m.length !== 9) {
            throw new Error("Matrix must contain 9 elements");
        }
        const { x, y } = this;
        const [x_x, x_y, , y_x, y_y, , z_x, z_y,] = m;
        this.x = x * x_x + y * y_x + z_x;
        this.y = x * x_y + y * y_y + z_y;
        return this;
    }
    lerp(v, t) {
        this.x += t * (v.x - this.x);
        this.y += t * (v.y - this.y);
        return this;
    }
    rotate(center, theta) {
        const s = Math.sin(theta);
        const c = Math.cos(theta);
        const x = this.x - center.x;
        const y = this.y - center.y;
        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;
        return this;
    }
    equals(v, precision = 6) {
        return +this.x.toFixed(precision) === +v.x.toFixed(precision)
            && +this.y.toFixed(precision) === +v.y.toFixed(precision);
    }
    toArray() {
        return [this.x, this.y];
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
}

class DotAnimationOptions {
    constructor(item = null) {
        this.expectedFps = 60;
        this.number = null;
        this.density = 0.00005;
        this.dprDependentDensity = true;
        this.dprDependentDimensions = true;
        this.minR = 1;
        this.maxR = 6;
        this.minSpeedX = -0.5;
        this.maxSpeedX = 0.5;
        this.minSpeedY = -0.5;
        this.maxSpeedY = 0.5;
        this.blur = 1;
        this.fill = true;
        this.colorsFill = ["#ffffff", "#fff4c1", "#faefdb"];
        this.opacityFill = null;
        this.opacityFillMin = 0;
        this.opacityFillStep = 0;
        this.stroke = false;
        this.colorsStroke = ["#ffffff"];
        this.opacityStroke = 1;
        this.opacityStrokeMin = 0;
        this.opacityStrokeStep = 0;
        this.drawLines = true;
        this.lineColor = "#717892";
        this.lineLength = 150;
        this.lineWidth = 2;
        this.actionOnClick = true;
        this.actionOnHover = true;
        this.onClickCreate = false;
        this.onClickMove = true;
        this.onHoverMove = true;
        this.onHoverDrawLines = true;
        this.onClickCreateNDots = 10;
        this.onClickMoveRadius = 200;
        this.onHoverMoveRadius = 50;
        this.onHoverLineRadius = 150;
        if (item) {
            Object.assign(this, item);
        }
    }
}

class AnimationWebGl {
    constructor(container, options, controlType) {
        this._resolution = new Vec2();
        this._pointerPosition = new Vec2();
        this._animationStartTimeStamp = 0;
        this._lastFrameTimeStamp = 0;
        this._lastFrameTime = 0;
        this._lastFramePreparationTime = 0;
        this._lastFrameRenderTime = 0;
        this.onResize = (e) => {
            const dpr = window.devicePixelRatio;
            const rect = this._container.getBoundingClientRect();
            const x = rect.width * dpr;
            const y = rect.height * dpr;
            this._canvas.width = x;
            this._canvas.height = y;
            this._resolution.set(x, y);
        };
        this.onPointerMove = (e) => {
            const dpr = window.devicePixelRatio;
            const parentRect = this._container.getBoundingClientRect();
            const xRelToDoc = parentRect.left +
                document.documentElement.scrollLeft;
            const yRelToDoc = parentRect.top +
                document.documentElement.scrollTop;
            const x = (e.clientX - xRelToDoc + window.pageXOffset) * dpr;
            const y = (e.clientY - yRelToDoc + window.pageYOffset) * dpr;
            this._pointerPosition.set(x, y);
        };
        this.onPointerDown = (e) => {
            this._pointerIsDown = true;
        };
        this.onPointerUp = (e) => {
            this._pointerIsDown = false;
        };
        this._options = options;
        this._container = container;
        this._controlType = controlType;
        this.initCanvas();
        this.initControl();
        this.addEventListeners();
    }
    destroy() {
        this.stop();
        this.removeEventListeners();
        this._control.destroy();
        this._canvas.remove();
    }
    start() {
        if (this._animationStartTimeStamp) {
            const timeSinceLastFrame = performance.now() - this._lastFrameTimeStamp;
            this._animationStartTimeStamp += timeSinceLastFrame;
        }
        this._animationTimerId = setInterval(() => {
            const framePreparationStart = performance.now();
            const elapsedTime = framePreparationStart - this._animationStartTimeStamp;
            this._control.prepareNextFrame(this._resolution, this._pointerPosition, this._pointerIsDown, elapsedTime);
            this._lastFramePreparationTime = performance.now() - framePreparationStart;
            requestAnimationFrame(() => {
                const frameRenderStart = performance.now();
                this._control.renderFrame();
                const frameRenderEnd = performance.now();
                this._lastFrameTimeStamp = frameRenderEnd;
                this._lastFrameRenderTime = frameRenderEnd - frameRenderStart;
                this._lastFrameTime = frameRenderEnd - framePreparationStart;
            });
        }, 1000 / this._options.expectedFps);
    }
    pause() {
        if (this._animationTimerId) {
            clearInterval(this._animationTimerId);
            this._animationTimerId = null;
        }
    }
    stop() {
        this.pause();
        this._animationStartTimeStamp = 0;
        window.setTimeout(() => this._control.clear(), 20);
    }
    initCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = getRandomUuid();
        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.filter = `blur(${this._options.blur}px)`;
        this._container.append(canvas);
        this._canvas = canvas;
        this.onResize(null);
    }
    initControl() {
        this._control = new this._controlType(this._canvas.getContext("webgl"), this._options);
    }
    addEventListeners() {
        this._resizeObserver = new ResizeObserver(this.onResize);
        this._resizeObserver.observe(this._container);
        this._container.addEventListener("pointermove", this.onPointerMove);
        window.addEventListener("pointerdown", this.onPointerDown);
        window.addEventListener("pointerup", this.onPointerUp);
    }
    removeEventListeners() {
        this._resizeObserver.unobserve(this._container);
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
        this._container.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("pointerdown", this.onPointerDown);
        window.removeEventListener("pointerup", this.onPointerUp);
    }
}
class DotWebGlAnimationControl {
    constructor(gl, options) {
        this._vertexShader = `
    #pragma vscode_glsllint_stage : vert

    attribute vec4 position;

    void main() {
      gl_Position = position;
    }
  `;
        this._fragmentShader = `
    #pragma vscode_glsllint_stage : frag

    precision highp float;

    void main() {
      gl_FragColor = vec4(1, 0, 0, 1);
    }
  `;
        this._options = options;
        this._gl = gl;
    }
    prepareNextFrame(resolution, pointerPosition, pointerDown, elapsedTime) {
        this.resize(resolution);
    }
    renderFrame() {
    }
    clear() {
        this._gl.clearColor(0, 0, 0, 0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }
    destroy() {
    }
    resize(resolution) {
        if (this._gl.canvas.width !== resolution.x) {
            this._gl.canvas.width = resolution.x;
        }
        if (this._gl.canvas.height !== resolution.y) {
            this._gl.canvas.height = resolution.y;
        }
    }
}
class AnimationFactory {
    static createDotsAnimation(containerSelector, options = null) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error("Container not found");
        }
        if (window.getComputedStyle(container).getPropertyValue("position") === "static") {
            throw new Error("Container is not positioned");
        }
        const combinedOptions = new DotAnimationOptions(options);
        return new AnimationWebGl(container, combinedOptions, DotWebGlAnimationControl);
    }
}

export { AnimationFactory };
