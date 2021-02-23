import WebGPUBinding from './WebGPUBinding';

import {
    FloatUniform,
    ColorUniform,
    Matrix3Uniform,
    Matrix4Uniform,
    Vector2Uniform,
    Vector3Uniform,
    Vector4Uniform,
    UniformTypes,
} from './WebGPUUniform';

export default class WebGPUUniformsGroup extends WebGPUBinding {
    uniforms: UniformTypes[];

    bytesPerElement: number;
    type: string;
    visibility: string;

    onBeforeUpdate: () => void;

    usage: string;

    array: null;
    bufferGPU: null;

    isUniformsGroup: boolean;

    constructor(name: string);

    addUniform: (uniform: UniformTypes) => WebGPUUniformsGroup;

    removeUniform: (uniform: UniformTypes) => WebGPUUniformsGroup;

    setOnBeforeUpdate: (callback: () => void) => WebGPUUniformsGroup;

    getByteLength: () => number;

    update: () => boolean;

    updateByType: (uniform: UniformTypes) => void;

    updateNumber: (uniform: FloatUniform) => boolean;

    updateVector2: (uniform: Vector2Uniform) => boolean;

    updateVector3: (uniform: Vector3Uniform) => boolean;

    updateVector4: (uniform: Vector4Uniform) => boolean;

    updateColor: (uniform: ColorUniform) => boolean;

    updateMatrix3: (uniform: Matrix3Uniform) => boolean;

    updateMatrix4: (uniform: Matrix4Uniform) => boolean;
}
