// new Map
const map = new maptalks.Map('map', {
    center: [121.443, 31.2166],
    zoom: 14,
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate:
            'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution:
            '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
        maxAvailableZoom: 14,
        placeholder: true,
    }),
    scaleControl: { position: 'bottom-right', metric: true, imperial: true },
    zoomControl: {
        position: { top: 80, right: 20 },
        slider: false,
        zoomLevel: true,
    },
    spatialReference: {
        projection: 'EPSG:3857',
        resolutions: (function () {
            const resolutions = []
            const d = 2 * 6378137 * Math.PI
            for (let i = 0; i <= 22; i++) {
                resolutions[i] = d / (256 * Math.pow(2, i))
            }
            return resolutions
        })(),
        fullExtent: {
            top: 6378137 * Math.PI,
            bottom: -6378137 * Math.PI,
            left: -6378137 * Math.PI,
            right: 6378137 * Math.PI,
        },
    },
})
new maptalks.CompassControl({
    position: 'top-right',
}).addTo(map)

const path = [
    [121.4182378463745, 31.222545506124476],
    [121.43308655548094, 31.213957432810588],
    [121.44338623809813, 31.222545506124476],
    [121.45900742340086, 31.21190205171368],
    [121.46887795257567, 31.219609500451583],
    [121.45626084136961, 31.222398708006637],
]

const marker = new maptalks.Marker(map.getCenter())
const layer = new maptalks.VectorLayer('v', [marker]).addTo(map)
const options = {
    speed: 1200,
    showPath: true,
}
const toolbar = new maptalks.control.Toolbar({
    position: 'top-left',
    items: [
        {
            item: 'animate to point',
            click: () => {
                marker.animateTo(path[path.length - 1], options)
            },
        },
        {
            item: 'animate follow path',
            click: () => {
                marker.animateTo(path, options)
            },
        },
    ],
}).addTo(map)
