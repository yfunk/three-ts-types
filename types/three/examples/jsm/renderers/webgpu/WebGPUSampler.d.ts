import WebGPUBinding from './WebGPUBinding.js';

export default class WebGPUSampler extends WebGPUBinding {
    texture: string;
    type: string;

    samplerGPU: null; // set by the renderer
    isSampler: boolean;

    constructor(name: string, texture: string);
}
