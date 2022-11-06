import { GPUIndexFormat, GPUTextureFormat, GPUStoreOp } from './constants';
import WebGPUAnimation from './WebGPUAnimation';
import WebGPUObjects from './WebGPUObjects';
import WebGPUAttributes from './WebGPUAttributes';
import WebGPUGeometries from './WebGPUGeometries';
import WebGPUInfo from './WebGPUInfo';
import WebGPUProperties from './WebGPUProperties';
import WebGPURenderPipelines from './WebGPURenderPipelines';
import WebGPUComputePipelines from './WebGPUComputePipelines';
import WebGPUBindings from './WebGPUBindings';
import WebGPURenderLists from './WebGPURenderLists';
import WebGPURenderStates from './WebGPURenderStates';
import WebGPUTextures from './WebGPUTextures';
import WebGPUBackground from './WebGPUBackground';
import WebGPUNodes from './nodes/WebGPUNodes';
import WebGPUUtils from './WebGPUUtils';

import { TextureEncoding, Scene, Camera, Color } from '../../../../src/Three';

export interface WebGPURendererParameters {
    antialias?: boolean;
    canvas: HTMLCanvasElement;
    context?: GPUCanvasContext;
    powerPreference?: GPUPowerPreference;
    requiredFeatures?: Iterable<GPUFeatureName>;
    requiredLimits?: Record<string, GPUSize64>;
    sampleCount?: number;
}

class WebGPURenderer {
    isWebGPURenderer: true;

    domElement: HTMLCanvasElement;

    autoClear: boolean;
    autoClearColor: boolean;
    autoClearDepth: boolean;
    autoClearStencil: boolean;

    outputEncoding: TextureEncoding;

    sortObjects: boolean;

    constructor(parameters?: WebGPURendererParameters);

    init(): Promise<void>;

    render(scene: Scene, camera: Camera): Promise<void>;

    setAnimationLoop(callback) {
        if (this._initialized === false) this.init();

        const animation = this._animation;

        animation.setAnimationLoop(callback);

        callback === null ? animation.stop() : animation.start();
    }

    getContext(): GPUCanvasContext;

    getPixelRatio(): number;

    getDrawingBufferSize(target) {
        return target.set(this._width * this._pixelRatio, this._height * this._pixelRatio).floor();
    }

    getSize(target) {
        return target.set(this._width, this._height);
    }

    setPixelRatio(value = 1) {
        this._pixelRatio = value;

        this.setSize(this._width, this._height, false);
    }

    setDrawingBufferSize(width, height, pixelRatio) {
        this._width = width;
        this._height = height;

        this._pixelRatio = pixelRatio;

        this.domElement.width = Math.floor(width * pixelRatio);
        this.domElement.height = Math.floor(height * pixelRatio);

        this._configureContext();
        this._setupColorBuffer();
        this._setupDepthBuffer();
    }

    setSize(width, height, updateStyle = true) {
        this._width = width;
        this._height = height;

        this.domElement.width = Math.floor(width * this._pixelRatio);
        this.domElement.height = Math.floor(height * this._pixelRatio);

        if (updateStyle === true) {
            this.domElement.style.width = width + 'px';
            this.domElement.style.height = height + 'px';
        }

        this._configureContext();
        this._setupColorBuffer();
        this._setupDepthBuffer();
    }

    setOpaqueSort(method) {
        this._opaqueSort = method;
    }

    setTransparentSort(method) {
        this._transparentSort = method;
    }

    getScissor(target) {
        const scissor = this._scissor;

        target.x = scissor.x;
        target.y = scissor.y;
        target.width = scissor.width;
        target.height = scissor.height;

        return target;
    }

    setScissor(x, y, width, height) {
        if (x === null) {
            this._scissor = null;
        } else {
            this._scissor = {
                x: x,
                y: y,
                width: width,
                height: height,
            };
        }
    }

    getViewport(target) {
        const viewport = this._viewport;

        target.x = viewport.x;
        target.y = viewport.y;
        target.width = viewport.width;
        target.height = viewport.height;
        target.minDepth = viewport.minDepth;
        target.maxDepth = viewport.maxDepth;

        return target;
    }

    setViewport(x: null): void;
    setViewport(x: number, y: number, width: number, height: number, minDepth?: number, maxDepth?: number): void;

    getClearColor(target: Color): Color;

    setClearColor(color: Color, alpha?: number): void;

    getClearAlpha(): number;

    setClearAlpha(alpha: number): void;

    getClearDepth(): number;

    setClearDepth(depth: number): void;

    getClearStencil(): number;

    setClearStencil(stencil: number): void;

    clear(): void;

    dispose(): void;

    setRenderTarget(renderTarget) {
        this._renderTarget = renderTarget;
    }

    async compute(...computeNodes) {
        if (this._initialized === false) return await this.init();

        const device = this._device;
        const computePipelines = this._computePipelines;

        const cmdEncoder = device.createCommandEncoder({});
        const passEncoder = cmdEncoder.beginComputePass();

        for (const computeNode of computeNodes) {
            // onInit

            if (computePipelines.has(computeNode) === false) {
                computeNode.onInit({ renderer: this });
            }

            // pipeline

            const pipeline = computePipelines.get(computeNode);
            passEncoder.setPipeline(pipeline);

            // node

            //this._nodes.update( computeNode );

            // bind group

            const bindGroup = this._bindings.get(computeNode).group;
            this._bindings.update(computeNode);
            passEncoder.setBindGroup(0, bindGroup);

            passEncoder.dispatchWorkgroups(computeNode.dispatchCount);
        }

        passEncoder.end();
        device.queue.submit([cmdEncoder.finish()]);
    }

    getRenderTarget() {
        return this._renderTarget;
    }
}

export default WebGPURenderer;
