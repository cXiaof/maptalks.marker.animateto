/*!
 * maptalks.routetopo v0.1.0-alpha.1
 * LICENSE : MIT
 * (c) 2016-2021 maptalks.org
 */
/*!
 * requires maptalks@>=0.47.0 
 */
import { Class, Eventable, INTERNAL_LAYER_PREFIX, LineString, Marker } from 'maptalks';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var uid = 'routetopo@cXiaof';

var pointsLayerStyle = [{
    filter: ['==', 'reachable', true],
    symbol: [{
        markerType: 'ellipse',
        markerFill: '#898989',
        markerWidth: 10,
        markerHeight: 10,
        markerLineWidth: 0
    }, {
        markerType: 'ellipse',
        markerFill: '#8cc220',
        markerWidth: 6,
        markerHeight: 6,
        markerLineWidth: 0
    }]
}, {
    filter: ['==', 'reachable', false],
    symbol: [{
        markerType: 'ellipse',
        markerFill: '#898989',
        markerWidth: 10,
        markerHeight: 10,
        markerLineWidth: 0
    }, {
        markerType: 'ellipse',
        markerFill: '#fbd600',
        markerWidth: 6,
        markerHeight: 6,
        markerLineWidth: 0
    }]
}];

var crossLayerStyle = {
    symbol: {
        markerType: 'ellipse',
        markerFill: '#88b04b',
        markerWidth: 12,
        markerHeight: 12,
        markerLineWidth: 0
    }
};

var resultLayerStyle = {
    symbol: {
        lineColor: '#88b04b'
    }
};

var options = {
    points: [],
    walls: [],
    distance: 4
};

var Routetopo = function (_maptalks$Eventable) {
    _inherits(Routetopo, _maptalks$Eventable);

    function Routetopo(options) {
        _classCallCheck(this, Routetopo);

        return _possibleConstructorReturn(this, _maptalks$Eventable.call(this, options));
    }

    Routetopo.prototype.addTo = function addTo(map) {
        if (map) {
            this._map = map;
            this._prepareInternalLayer();
        }
        this.fire('add');
        return this;
    };

    Routetopo.prototype.getMap = function getMap() {
        return this._map;
    };

    Routetopo.prototype.remove = function remove() {
        // ...
    };

    Routetopo.prototype.setDistance = function setDistance(distance) {
        this.options['distance'] = distance;
    };

    Routetopo.prototype.start = function start() {
        this._map.setCursor('crosshair');
        this._map.on('zoomstart', this._handleMapZoomstart, this);
        this._map.on('zoomend', this._handleMapZoomend, this);
        this._map.on('mousemove', this._handleMapMousemove, this);
        this._map.on('click', this._handleMapClick, this);
        this.fire('start');
        return this;
    };

    Routetopo.prototype.end = function end() {
        this._map.off('zoomstart', this._handleMapZoomstart, this);
        this._map.off('zoomend', this._handleMapZoomend, this);
        this._map.off('mousemove', this._handleMapMousemove, this);
        this._map.off('click', this._handleMapClick, this);
        this._map.resetCursor();
        this.fire('end');
        return this;
    };

    Routetopo.prototype._prepareInternalLayer = function _prepareInternalLayer() {
        this._pointsName = '' + INTERNAL_LAYER_PREFIX + uid + '__points';
        this._pointsLayer = new window.maptalks.VectorLayer(this._pointsName, this._getCopyPoints(), { style: pointsLayerStyle });
        this._pointsLayer.addTo(this._map).bringToFront();

        this._resultName = '' + INTERNAL_LAYER_PREFIX + uid + '__result';
        this._resultLayer = new window.maptalks.VectorLayer(this._resultName, {
            style: resultLayerStyle
        });
        this._resultLayer.addTo(this._map).bringToFront();

        this._crossName = '' + INTERNAL_LAYER_PREFIX + uid + '__cross';
        this._crossLayer = new window.maptalks.VectorLayer(this._crossName, {
            style: crossLayerStyle
        });
        this._crossLayer.addTo(this._map).bringToFront();

        this._previewName = '' + INTERNAL_LAYER_PREFIX + uid + '__preview';
        this._previewLayer = new window.maptalks.VectorLayer(this._previewName);
        this._previewLayer.addTo(this._map).bringToFront();
    };

    Routetopo.prototype._getCopyPoints = function _getCopyPoints() {
        return this.options['points'].reduce(function (target, geo) {
            if (!geo instanceof Marker) return target;
            target.push(new Marker(geo.getCoordinates(), {
                properties: {
                    reachable: false
                }
            }));
            return target;
        }, []);
    };

    Routetopo.prototype._handleMapZoomstart = function _handleMapZoomstart() {
        this._map.off('mousemove', this._handleMapMousemove, this);
    };

    Routetopo.prototype._handleMapZoomend = function _handleMapZoomend() {
        this._map.on('mousemove', this._handleMapMousemove, this);
    };

    Routetopo.prototype._handleMapMousemove = function _handleMapMousemove(param) {
        var _this2 = this;

        var coordinate = param.coordinate;

        this._coordinate = coordinate;
        var identifyOpts = {
            coordinate: coordinate,
            tolerance: this._getTolerance(),
            layers: [this._pointsName],
            includeInternals: true
        };
        param.target.identify(identifyOpts, function (geos) {
            _this2._identifyGeos = geos;
            var lines = _this2._getPreviewLines(geos);
            _this2._previewLayer.clear().addGeometry(lines);
        });
    };

    Routetopo.prototype._handleMapClick = function _handleMapClick(param) {
        var _this3 = this;

        new Marker(param.coordinate).addTo(this._crossLayer);
        this._previewLayer.forEach(function (geo) {
            new LineString(geo.getCoordinates()).addTo(_this3._resultLayer);
        });
        this._identifyGeos.forEach(function (geo) {
            geo.setProperties({ reachable: true });
        });
        this._previewLayer.clear();
    };

    Routetopo.prototype._getTolerance = function _getTolerance() {
        var distance = this.options['distance'];
        var pixel = this._map.distanceToPixel(distance, 0);
        return ~~pixel.width;
    };

    Routetopo.prototype._getPreviewLines = function _getPreviewLines(geos) {
        var crosses = this._crossLayer.getGeometries();
        var trafficLines = this._getTrafficLines(crosses);
        if (crosses.length > 0 && trafficLines.length === 0) return [];
        var targetLines = this._getTargetLines(geos);
        return [].concat(trafficLines, targetLines);
    };

    Routetopo.prototype._getTrafficLines = function _getTrafficLines(geos) {
        var _this4 = this;

        return geos.reduce(function (prev, current) {
            var symbol = { lineColor: '#f9e547', lineWidth: 2 };
            return _this4._getLineNoIntersects(prev, current, symbol);
        }, []);
    };

    Routetopo.prototype._getTargetLines = function _getTargetLines(geos) {
        var _this5 = this;

        return geos.reduce(function (prev, current) {
            var symbol = { lineColor: '#f9e547', lineDasharray: [18, 5] };
            return _this5._getLineNoIntersects(prev, current, symbol);
        }, []);
    };

    Routetopo.prototype._getLineNoIntersects = function _getLineNoIntersects(prev, current, symbol) {
        var coords = [this._coordinate, current.getCoordinates()];
        var line = new LineString(coords, { symbol: symbol });
        prev.push(line);
        return prev;
    };

    return Routetopo;
}(Eventable(Class));

Routetopo.mergeOptions(options);

export { Routetopo };

typeof console !== 'undefined' && console.log('maptalks.routetopo v0.1.0-alpha.1, requires maptalks@>=0.47.0.');
