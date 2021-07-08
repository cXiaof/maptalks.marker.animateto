/*!
 * maptalks.routetopo v0.1.0-alpha.1
 * LICENSE : MIT
 * (c) 2016-2021 maptalks.org
 */
/*!
 * requires maptalks@>=0.47.0 
 */
import { Class, INTERNAL_LAYER_PREFIX } from 'maptalks';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var uid = 'routetopo@cXiaof';
var options = {};

var Routetopo = function (_maptalks$Class) {
    _inherits(Routetopo, _maptalks$Class);

    function Routetopo(options) {
        _classCallCheck(this, Routetopo);

        var _this = _possibleConstructorReturn(this, _maptalks$Class.call(this, options));

        _this._layerName = '' + INTERNAL_LAYER_PREFIX + uid;
        return _this;
    }

    return Routetopo;
}(Class);

Routetopo.mergeOptions(options);

export { Routetopo };

typeof console !== 'undefined' && console.log('maptalks.routetopo v0.1.0-alpha.1, requires maptalks@>=0.47.0.');
