import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from '../../../../src/Three';

export class WebGPUUniform<Value> {
    name: string;
    value: Value | null;

    boundary: number;
    itemSize: number;

    offset: number;

    constructor(name: string, value?: Value);

    setValue: (value: Value) => void;

    getValue: () => Value;
}

export class FloatUniform extends WebGPUUniform<number> {
    isFloatUniform: number;

    constructor(name: string, value?: number);
}

export class Vector2Uniform extends WebGPUUniform<Vector2> {
    isVector2Uniform: boolean;

    constructor(name: string, value?: Vector2);
}

export class Vector3Uniform extends WebGPUUniform<Vector3> {
    isVector3Uniform: boolean;
    constructor(name: string, value?: Vector3);
}

export class Vector4Uniform extends WebGPUUniform<Vector4> {
    isVector4Uniform: boolean;

    constructor(name: string, value?: Vector4);
}

export class ColorUniform extends WebGPUUniform<Color> {
    isColorUniform: boolean;

    constructor(name: string, value?: Color);
}

export class Matrix3Uniform extends WebGPUUniform<Matrix3> {
    isMatrix3Uniform: boolean;

    constructor(name: string, value?: Matrix3);
}

export class Matrix4Uniform extends WebGPUUniform<Matrix4> {
    isMatrix4Uniform: boolean;

    constructor(name: string, value?: Matrix4);
}

export type UniformTypes =
    | FloatUniform
    | ColorUniform
    | Matrix3Uniform
    | Matrix4Uniform
    | Vector2Uniform
    | Vector3Uniform
    | Vector4Uniform;
