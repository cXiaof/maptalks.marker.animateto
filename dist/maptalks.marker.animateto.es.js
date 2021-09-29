/*!
 * maptalks.marker.animateto v0.1.0-alpha.1
 * LICENSE : MIT
 * (c) 2016-2021 maptalks.org
 */
/*!
 * requires maptalks@>=0.47.0 
 */
import { Coordinate, INTERNAL_LAYER_PREFIX, LineString, Marker, VectorLayer } from 'maptalks';

var layerName = INTERNAL_LAYER_PREFIX + '_marker_animateto';
var layerStyle = {
    symbol: {
        lineColor: '#97999b',
        lineOpacity: 0.3,
        lineDasharray: [15, 5]
    }
};
var opts = {
    speed: 1.2,
    showPath: false,
    easing: 'inAndOut'
};

Marker.include({
    animateTo: function animateTo(target) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : opts;

        var line = getPathLine(target, options, this);
        console.log(line);
        return this;
    }
});

var getPathLine = function getPathLine(target, options, marker) {
    var map = marker.getMap();
    if (!map) return;
    var thisCoords = marker.getCoordinates();
    var coords = getLineCoords(target, thisCoords);
    if (coords) {
        var layer = getLayer(map);
        var line = new LineString(coords);
        line.hide().addTo(layer);
        if (options['showPath']) {
            var length = line.getLength();
            var duration = options['duration'] || 1000 * (length / options['speed']);
            var easing = 'inAndOut';
            line.animateShow({ duration: duration, easing: easing });
        }
        return line;
    }
};

var getLineCoords = function getLineCoords(target, thisCoords) {
    if (target instanceof Coordinate) {
        return [thisCoords, target]; // coords
    }

    if (Array.isArray(target)) {
        if (target[0] instanceof Coordinate) {
            return [thisCoords].concat(target); // coords[]
        }

        if (typeof target[0] === 'number') {
            return [thisCoords, new Coordinate(target)]; // number[]
        }

        if (typeof target[0][0] === 'number') {
            target = target.map(function (item) {
                return new Coordinate(item);
            });
            return [thisCoords].concat(target); // number[][]
        }
    }
};

var getLayer = function getLayer() {
    return map.getLayer(layerName) || new VectorLayer(layerName, { style: layerStyle }).addTo(map);
};

typeof console !== 'undefined' && console.log('maptalks.marker.animateto v0.1.0-alpha.1, requires maptalks@>=0.47.0.');
