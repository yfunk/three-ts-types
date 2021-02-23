import { WebGLRenderTarget, Scene, WebGLRenderTargetOptions, Texture, Camera } from '../../../../src/Three';

import WebGPURenderer from './WebGPURenderer';

export default class WebGPUTextureRenderer {
    renderer: WebGPURenderer;
    renderTarget: WebGLRenderTarget;

    constructor(renderer: WebGPURenderer, options?: WebGLRenderTargetOptions);

    getTexture: () => Texture;

    setSize: (width: number, height: number) => void;

    render: (scene: Scene, camera: Camera) => void;
}
