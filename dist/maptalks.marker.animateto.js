/*!
 * maptalks.marker.animateto v0.1.0-alpha.1
 * LICENSE : MIT
 * (c) 2016-2021 maptalks.org
 */
/*!
 * requires maptalks@>=0.47.0 
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('maptalks')) :
	typeof define === 'function' && define.amd ? define(['maptalks'], factory) :
	(factory(global.maptalks));
}(this, (function (maptalks) { 'use strict';

var layerName = maptalks.INTERNAL_LAYER_PREFIX + '_marker_animateto';
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

maptalks.Marker.include({
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
        var line = new maptalks.LineString(coords);
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
    if (target instanceof maptalks.Coordinate) {
        return [thisCoords, target]; // coords
    }

    if (Array.isArray(target)) {
        if (target[0] instanceof maptalks.Coordinate) {
            return [thisCoords].concat(target); // coords[]
        }

        if (typeof target[0] === 'number') {
            return [thisCoords, new maptalks.Coordinate(target)]; // number[]
        }

        if (typeof target[0][0] === 'number') {
            target = target.map(function (item) {
                return new maptalks.Coordinate(item);
            });
            return [thisCoords].concat(target); // number[][]
        }
    }
};

var getLayer = function getLayer() {
    return map.getLayer(layerName) || new maptalks.VectorLayer(layerName, { style: layerStyle }).addTo(map);
};

typeof console !== 'undefined' && console.log('maptalks.marker.animateto v0.1.0-alpha.1, requires maptalks@>=0.47.0.');

})));
