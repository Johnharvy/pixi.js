import getBufferType from './getBufferType';

/* eslint-disable object-shorthand */
const map = { Float32Array: Float32Array, Uint32Array: Uint32Array, Int32Array: Int32Array };

export default function interleaveTypedArrays(arrays, sizes)
{
    let outSize = 0;
    let stride = 0;
    const views = {};

    for (let i = 0; i < arrays.length; i++)
    {
        stride += sizes[i];
        outSize += arrays[i].length;
    }

    const buffer = new ArrayBuffer(outSize * 4);

    let out = null;
    let littleOffset = 0;

    for (let i = 0; i < arrays.length; i++)
    {
        const size = sizes[i];
        const array = arrays[i];

        const type = getBufferType(array);

        if (!views[type])
        {
            views[type] = new map[type](buffer);
        }

        out = views[type];

        for (let j = 0; j < array.length; j++)
        {
            const indexStart = ((j / size | 0) * stride) + littleOffset;
            const index = j % size;

            out[indexStart + index] = array[j];
        }

        littleOffset += size;
    }

    return new Float32Array(buffer);
}
