import * as maptalks from 'maptalks'
import booleanIntersects from '@turf/boolean-intersects'

const options = {
    points: [],
    obstacles: [],
    distance: 4,
}

const uid = 'routetopo@cXiaof'

const pointsLayerStyle = [
    {
        filter: ['==', 'reachable', true],
        symbol: [
            {
                markerType: 'ellipse',
                markerFill: '#898989',
                markerWidth: 10,
                markerHeight: 10,
                markerLineWidth: 0,
            },
            {
                markerType: 'ellipse',
                markerFill: '#8cc220',
                markerWidth: 6,
                markerHeight: 6,
                markerLineWidth: 0,
            },
        ],
    },
    {
        filter: ['==', 'reachable', false],
        symbol: [
            {
                markerType: 'ellipse',
                markerFill: '#898989',
                markerWidth: 10,
                markerHeight: 10,
                markerLineWidth: 0,
            },
            {
                markerType: 'ellipse',
                markerFill: '#fbd600',
                markerWidth: 6,
                markerHeight: 6,
                markerLineWidth: 0,
            },
        ],
    },
]

const crossLayerStyle = {
    symbol: {
        markerType: 'ellipse',
        markerFill: '#88b04b',
        markerWidth: 12,
        markerHeight: 12,
        markerLineWidth: 0,
    },
}

const resultLayerStyle = {
    symbol: {
        lineColor: '#88b04b',
    },
}

const previewLayerStyle = [
    {
        filter: ['==', 'main', true],
        symbol: { lineColor: '#f9e547', lineWidth: 2 },
    },
    {
        filter: ['==', 'main', false],
        symbol: { lineColor: '#f9e547', lineDasharray: [18, 5] },
    },
]

export class Routetopo extends maptalks.Eventable(maptalks.Class) {
    constructor(options) {
        super(options)
        this.living = true
        this.working = false
    }

    addTo(map) {
        if (map) {
            this._map = map
            this._prepareInternalLayer()
        }
        this.fire('add')
        return this
    }

    getMap() {
        return this._map
    }

    remove() {
        if (!this.living) return this
        delete this._pointsName
        this._pointsLayer.remove()
        delete this._pointsLayer
        delete this._resultName
        this._resultLayer.remove()
        delete this._resultLayer
        delete this._crossName
        this._crossLayer.remove()
        delete this._crossLayer
        delete this._previewName
        this._previewLayer.remove()
        delete this._previewLayer
        this.living = false
        return this
    }

    setDistance(distance) {
        this.options['distance'] = distance
        return this
    }

    start() {
        if (!this.living) return this
        this._map.setCursor('crosshair')
        this._map.on('zoomstart', this._handleMapZoomstart, this)
        this._map.on('zoomend', this._handleMapZoomend, this)
        this._map.on('mousemove', this._handleMapMousemove, this)
        this._map.on('click', this._handleMapClick, this)

        this.working = true
        this.fire('start')
        return this
    }

    end() {
        if (!this.living) return this
        this._map.off('zoomstart', this._handleMapZoomstart, this)
        this._map.off('zoomend', this._handleMapZoomend, this)
        this._map.off('mousemove', this._handleMapMousemove, this)
        this._map.off('click', this._handleMapClick, this)
        this._map.resetCursor()

        this.working = false
        this.fire('end', {
            result: this._getGeosCopyInLayer(this._resultLayer),
            cross: this._getGeosCopyInLayer(this._crossLayer),
        })
        this.remove()
        return this
    }

    isWorking() {
        return this.working
    }

    isLiving() {
        return this.living
    }

    _prepareInternalLayer() {
        this._pointsName = `${maptalks.INTERNAL_LAYER_PREFIX}${uid}__points`
        this._pointsLayer = new window.maptalks.VectorLayer(
            this._pointsName,
            this._getCopyPoints(),
            { style: pointsLayerStyle }
        )
        this._pointsLayer.addTo(this._map).bringToFront()

        this._resultName = `${maptalks.INTERNAL_LAYER_PREFIX}${uid}__result`
        this._resultLayer = new window.maptalks.VectorLayer(this._resultName, {
            style: resultLayerStyle,
        })
        this._resultLayer.addTo(this._map).bringToFront()

        this._crossName = `${maptalks.INTERNAL_LAYER_PREFIX}${uid}__cross`
        this._crossLayer = new window.maptalks.VectorLayer(this._crossName, {
            style: crossLayerStyle,
        })
        this._crossLayer.addTo(this._map).bringToFront()

        this._previewName = `${maptalks.INTERNAL_LAYER_PREFIX}${uid}__preview`
        this._previewLayer = new window.maptalks.VectorLayer(
            this._previewName,
            { style: previewLayerStyle }
        )
        this._previewLayer.addTo(this._map).bringToFront()
    }

    _getCopyPoints() {
        return this.options['points'].reduce((target, geo) => {
            if (!geo instanceof maptalks.Marker) return target
            target.push(
                new maptalks.Marker(geo.getCoordinates(), {
                    properties: {
                        reachable: false,
                    },
                })
            )
            return target
        }, [])
    }

    _handleMapZoomstart() {
        this._map.off('mousemove', this._handleMapMousemove, this)
    }

    _handleMapZoomend() {
        this._map.on('mousemove', this._handleMapMousemove, this)
    }

    _handleMapMousemove(param) {
        const { coordinate } = param
        this._coordinate = coordinate
        const identifyOpts = {
            coordinate,
            tolerance: this._getTolerance(),
            layers: [this._pointsName],
            includeInternals: true,
        }
        param.target.identify(identifyOpts, (geos) => {
            this._identifyGeos = []
            const lines = this._getPreviewLines(geos)
            this._previewLayer.clear().addGeometry(lines)
        })
    }

    _handleMapClick(param) {
        new maptalks.Marker(param.coordinate).addTo(this._crossLayer)
        this._previewLayer.forEach((geo) => {
            geo.copy().addTo(this._resultLayer)
        })
        this._identifyGeos.forEach((geo) => {
            geo.setProperties({ reachable: true })
        })
        this._previewLayer.clear()
    }

    _getTolerance() {
        const distance = this.options['distance']
        const pixel = this._map.distanceToPixel(distance, 0)
        return ~~pixel.width
    }

    _getPreviewLines(geos) {
        const crosses = this._crossLayer.getGeometries()
        const trafficLines = this._getTrafficLines(crosses)
        if (crosses.length > 0 && trafficLines.length === 0) return []
        const targetLines = this._getTargetLines(geos)
        return [...trafficLines, ...targetLines]
    }

    _getTrafficLines(geos) {
        return geos.reduce(
            (prev, current) => this._getLineNoIntersects(prev, current, true),
            []
        )
    }

    _getTargetLines(geos) {
        return geos.reduce(
            (prev, current) => this._getLineNoIntersects(prev, current, false),
            []
        )
    }

    _getLineNoIntersects(prev, current, main) {
        const coords = [this._coordinate, current.getCoordinates()]
        const line = new maptalks.LineString(coords, { properties: { main } })
        if (!booleanIntersects(line.toGeoJSON(), this._getObstacles())) {
            prev.push(line)
            if (!main) this._identifyGeos.push(current)
        }
        return prev
    }

    _getObstacles() {
        const gc = new maptalks.GeometryCollection(this.options['obstacles'])
        return gc.toGeoJSON()
    }

    _getGeosCopyInLayer(layer) {
        return layer.getGeometries().map((geo) => geo.copy())
    }
}

Routetopo.mergeOptions(options)
