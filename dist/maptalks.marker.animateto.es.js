/*!
 * maptalks.marker.animateto v0.1.0-alpha.1
 * LICENSE : MIT
 * (c) 2016-2021 maptalks.org
 */
/*!
 * requires maptalks@>=0.47.0 
 */
import { Marker } from 'maptalks';

Marker.include({
    animateTo: function animateTo() {
        return this;
    }
});

typeof console !== 'undefined' && console.log('maptalks.marker.animateto v0.1.0-alpha.1, requires maptalks@>=0.47.0.');
