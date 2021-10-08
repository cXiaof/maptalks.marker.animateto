/*!
 * maptalks.marker.animateto v0.1.0-beta.1
 * LICENSE : MIT
 * (c) 2016-2021 maptalks.org
 */
/*!
 * requires maptalks@>=0.47.0 <1.0.0 
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('maptalks')) :
	typeof define === 'function' && define.amd ? define(['maptalks'], factory) :
	(factory(global.maptalks));
}(this, (function (maptalks) { 'use strict';

var layerName = maptalks.INTERNAL_LAYER_PREFIX + '_marker_animateto';
var optsDefault = {
    speed: 1.2,
    easing: 'out',
    pathSymbol: {
        lineColor: '#97999b',
        lineOpacity: 0.3,
        lineDasharray: [15, 5]
    }
};

maptalks.Marker.include({
    animateTo: function animateTo(target, options) {
        var _this = this;

        clearLastAnimate(this);
        options = Object.assign({}, optsDefault, options);
        var line = getPathLine(target, options, this);
        if (line) {
            marker.fire('animatetostart');
            line.on('shapechange', function () {
                _this.setCoordinates(line.getLastCoordinate());
            });
            this._animateToLine = line;
        }
        return this;
    }
});

var clearLastAnimate = function clearLastAnimate(marker) {
    if (marker._animateToLine) {
        marker.fire('animatetocancel');
        marker._animateToLine.remove();
    }
};

var getPathLine = function getPathLine(target, options, marker) {
    var map = marker.getMap();
    if (!map) return;

    var thisCoords = marker.getCoordinates();
    var coords = getLineCoords(target, thisCoords);
    if (coords) {
        var layer = getLineLayer(map);
        var lineOpts = { visible: false, symbol: getLineSymbol(options) };
        var line = new maptalks.LineString(coords, lineOpts).addTo(layer);
        line.on('remove', function () {
            marker.fire('animatetoend');
        });
        animateShowLine(line, options);
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

var getLineLayer = function getLineLayer(map) {
    return map.getLayer(layerName) || new maptalks.VectorLayer(layerName).addTo(map);
};

var getLineSymbol = function getLineSymbol(options) {
    var symbol = Object.assign({}, options['pathSymbol']);
    if (!options['showPath']) symbol.lineOpacity = 0;
    return symbol;
};

var animateShowLine = function animateShowLine(line, options) {
    var duration = getAnimateShowDuration(line, options);
    var easing = options['easing'];
    line.animateShow({ duration: duration, easing: easing }, function (frame) {
        if (frame.state.playState === 'finished') {
            line.remove();
        }
    });
};

var getAnimateShowDuration = function getAnimateShowDuration(line, options) {
    var length = line.getLength();
    var duration = options['duration'];
    if (!duration) duration = 1000 * (length / options['speed']);
    if (options['maxDuration']) duration = Math.min(duration, options['maxDuration']);
    return duration;
};

typeof console !== 'undefined' && console.log('maptalks.marker.animateto v0.1.0-beta.1, requires maptalks@>=0.47.0 <1.0.0.');

})));
