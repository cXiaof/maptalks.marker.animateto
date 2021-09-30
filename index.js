import * as maptalks from 'maptalks'

const layerName = `${maptalks.INTERNAL_LAYER_PREFIX}_marker_animateto`
const optsDefault = {
    speed: 1.2,
    showPath: false,
    easing: 'out',
    pathSymbol: {
        lineColor: '#97999b',
        lineOpacity: 0.3,
        lineDasharray: [15, 5],
    },
}

maptalks.Marker.include({
    animateTo(target, options) {
        clearLastAnimate(this)
        options = Object.assign({}, optsDefault, options)
        const line = getPathLine(target, options, this)
        if (line) {
            line.on('shapechange', () => {
                this.setCoordinates(line.getLastCoordinate())
            })
            this._animateToLine = line
        }
        return this
    },
})

const clearLastAnimate = (marker) => {
    if (marker._animateToLine) {
        marker._animateToLine.remove()
    }
}

const getPathLine = (target, options, marker) => {
    const map = marker.getMap()
    if (!map) return

    const thisCoords = marker.getCoordinates()
    const coords = getLineCoords(target, thisCoords)
    if (coords) {
        const layer = getLineLayer(map)
        const symbol = getLineSymbol(options)
        const line = new maptalks.LineString(coords, { symbol })
        line.hide().addTo(layer)
        animateShowLine(line, options)
        return line
    }
}

const getLineCoords = (target, thisCoords) => {
    if (target instanceof maptalks.Coordinate) {
        return [thisCoords, target] // coords
    }

    if (Array.isArray(target)) {
        if (target[0] instanceof maptalks.Coordinate) {
            return [thisCoords].concat(target) // coords[]
        }

        if (typeof target[0] === 'number') {
            return [thisCoords, new maptalks.Coordinate(target)] // number[]
        }

        if (typeof target[0][0] === 'number') {
            target = target.map((item) => new maptalks.Coordinate(item))
            return [thisCoords].concat(target) // number[][]
        }
    }
}

const getLineLayer = (map) => {
    return (
        map.getLayer(layerName) ||
        new maptalks.VectorLayer(layerName).addTo(map)
    )
}

const getLineSymbol = (options) => {
    const symbol = Object.assign({}, options['pathSymbol'])
    if (!options['showPath']) symbol.lineOpacity = 0
    return symbol
}

const animateShowLine = (line, options) => {
    const duration = getAnimateShowDuration(line, options)
    const easing = options['easing']
    line.animateShow({ duration, easing }, (frame) => {
        if (frame.state.playState === 'finished') {
            line.remove()
        }
    })
}

const getAnimateShowDuration = (line, options) => {
    const length = line.getLength()
    let duration = options['duration']
    if (!duration) duration = 1000 * (length / options['speed'])
    if (options['maxDuration'])
        duration = Math.min(duration, options['maxDuration'])
    return duration
}
