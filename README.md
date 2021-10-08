# maptalks.marker.animateto

## Examples

### [DEMO](https://cxiaof.github.io/maptalks.marker.animateto/demo/index.html)

## Install

-   Install with npm: `npm install maptalks.marker.animateto`.
-   Install with yarn: `yarn add maptalks.marker.animateto`.
-   Download from [dist directory](https://github.com/cXiaof/maptalks.marker.animateto/tree/main/dist).
-   Use unpkg CDN: `https://cdn.jsdelivr.net/npm/maptalks.marker.animateto/dist/maptalks.marker.animateto.min.js`

## Usage

As a plugin, `maptalks.marker.animateto` must be loaded after `maptalks.js` in browsers.

```html
<!-- ... -->
<script src="https://cdn.jsdelivr.net/npm/maptalks/dist/maptalks.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/maptalks.marker.animateto/dist/maptalks.marker.animateto.min.js"></script>
<!-- ... -->
```

```javascript
marker.animateTo([121.443, 31.2166])
```

## API Reference

```javascript
marker.animateTo(path, options)
```

-   path **number[] | number[][] | Coordinate[] | Coordinate[][]**

-   options **Object** options
    -   pathSymbol **Object** reference to the symbol of LineString.
    -   showPath **Boolean** whether to show path LineString, false by default.
    -   easing **String** animation easing, 'out' by default.
    -   duration **Number** animation duration.
    -   speed **Number** animation speed, unit is m/s, 1.2 by default, work if no duration.
    -   maxDuration **Number** animation max duration, work for both duration and speed.

## Contributing

We welcome any kind of contributions including issue reportings, pull requests, documentation corrections, feature requests and any other helps.

## Develop

The only source file is `index.js`.

It is written in ES6, transpiled by [babel](https://babeljs.io/) and tested with [mocha](https://mochajs.org) and [expect.js](https://github.com/Automattic/expect.js).

### Scripts

-   Install dependencies

```shell
$ npm install
```

-   Watch source changes and generate runnable bundle repeatedly

```shell
$ gulp watch
```

-   Package and generate minified bundles to dist directory

```shell
$ gulp minify
```

-   Lint

```shell
$ npm run lint
```

## More Things

-   [maptalks.autoadsorb](https://github.com/cXiaof/maptalks.autoadsorb/issues)
-   [maptalks.multisuite](https://github.com/cXiaof/maptalks.multisuite/issues)
-   [maptalks.geosplit](https://github.com/cXiaof/maptalks.geosplit/issues)
-   [maptalks.polygonbool](https://github.com/cXiaof/maptalks.polygonbool/issues)
-   [maptalks.geo2img](https://github.com/cXiaof/maptalks.geo2img/issues)
-   [maptalks.autogradual](https://github.com/cXiaof/maptalks.autogradual/issues)
-   [maptalks.control.compass](https://github.com/cXiaof/maptalks.control.compass/issues)
