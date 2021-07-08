import * as maptalks from 'maptalks'

const uid = 'routetopo@cXiaof'
const options = {}

export class Routetopo extends maptalks.Class {
    constructor(options) {
        super(options)
        this._layerName = `${maptalks.INTERNAL_LAYER_PREFIX}${uid}`
    }
}

Routetopo.mergeOptions(options)
