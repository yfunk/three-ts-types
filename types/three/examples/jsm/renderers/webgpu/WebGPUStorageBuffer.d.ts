import { BufferAttribute } from './../../../../src/Three';

import WebGPUBinding from './WebGPUBinding.js';

export default class WebGPUStorageBuffer extends WebGPUBinding {
    type: string;
    usage: string;

    attribute: BufferAttribute;

    bufferGPU: null;

    isStorageBuffer: boolean;

    constructor(name: string, attribute: BufferAttribute);
}
