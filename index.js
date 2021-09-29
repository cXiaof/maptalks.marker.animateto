import * as maptalks from 'maptalks'

const layerName = `${maptalks.INTERNAL_LAYER_PREFIX}_marker_animateto`
const layerStyle = {
    symbol: {
        lineColor: '#97999b',
        lineOpacity: 0.3,
        lineDasharray: [15, 5],
    },
}
const opts = {
    speed: 1.2,
    showPath: false,
    easing: 'inAndOut',
}

maptalks.Marker.include({
    animateTo(target, options = opts) {
        const line = getPathLine(target, options, this)
        console.log(line)
        return this
    },
})

const getPathLine = (target, options, marker) => {
    const map = marker.getMap()
    if (!map) return
    const thisCoords = marker.getCoordinates()
    const coords = getLineCoords(target, thisCoords)
    if (coords) {
        const layer = getLayer(map)
        const line = new maptalks.LineString(coords)
        line.hide().addTo(layer)
        if (options['showPath']) {
            const length = line.getLength()
            const duration =
                options['duration'] || 1000 * (length / options['speed'])
            const easing = 'inAndOut'
            line.animateShow({ duration, easing })
        }
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

const getLayer = () => {
    return (
        map.getLayer(layerName) ||
        new maptalks.VectorLayer(layerName, { style: layerStyle }).addTo(map)
    )
}
