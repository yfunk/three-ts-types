import { LightsNode } from '../../nodes/Nodes';

export class WebGPURenderState {
    constructor() {
        this.lightsNode = new LightsNode();

        this.lightsArray = [];
    }

    init() {
        this.lightsArray.length = 0;
    }

    pushLight(light) {
        this.lightsArray.push(light);
    }

    getLightsNode() {
        return this.lightsNode.fromLights(this.lightsArray);
    }
}

export default class WebGPURenderStates {
    constructor() {
        this.renderStates = new WeakMap();
    }

    get(scene /* camera */) {
        const renderStates = this.renderStates;

        let renderState = renderStates.get(scene);

        if (renderState === undefined) {
            renderState = new WebGPURenderState();
            renderStates.set(scene, renderState);
        }

        return renderState;
    }

    dispose() {
        this.renderStates = new WeakMap();
    }
}
