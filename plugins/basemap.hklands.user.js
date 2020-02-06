// ==UserScript==
// @id             iitc-plugin-basemap-hklands@charlielok
// @name           IITC plugin: Hong Kong Lands Department Map
// @category       Map Tiles
// @version        0.1.20200206
// @description    [release-20200206] Add map tiles from Hong Kong Lands Department Map as an optional layer.
// @updateURL      https://github.com/charlielok/iitc/raw/master/plugins/basemap.hklands.user.js
// @downloadURL    https://github.com/charlielok/iitc/raw/master/plugins/basemap.hklands.user.js
// @namespace      https://github.com/charlielok/iitc
// @include        https://intel.ingress.com/*
// @match          https://intel.ingress.com/*
// @author         charlielok
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'alpha';
plugin_info.dateTimeVersion = '0.0001';
plugin_info.pluginId = 'basemap-hklands';
//END PLUGIN AUTHORS NOTE


// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.mapTileHKLands = {
  addLayer: function() {
    var hkmapOpt = {
      attribution: '<u href="https://api.portal.hkmapservice.gov.hk/disclaimer" target="_blank" class="copyrightDiv">&copy; The Government of the Hong Kong SAR</u>&nbsp;<div style="width:20px;height:20px;display:inline-flex;background:url(https://api.hkmapservice.gov.hk/mapapi/landsdlogo.jpg);background-size:20px;"></div>',
      maxNativeZoom: 18,
      minZoom: 10,
      maxZoom: 20,
    };

    var basemaps = {
      'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/basemap/wgs84/{z}/{x}/{y}.png': 'Map',
      'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/imagery/wgs84/{z}/{x}/{y}.png': 'Satellite',
    };

    var labels = {
      'none': '',
      'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/label/hk/tc/wgs84/{z}/{x}/{y}.png': 'Chinese',
      'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/label/hk/en/wgs84/{z}/{x}/{y}.png': 'English',
    };

    for(var bmurl in basemaps) {
      for(var lburl in labels) {
        var bm = new L.TileLayer(bmurl, hkmapOpt);
        var maptitle = 'Hong Kong '+basemaps[bmurl]+((labels[lburl] == '')?'':' in '+labels[lburl]);

        if (labels[lburl] == '') {
          layerChooser.addBaseLayer(bm, maptitle);
        } else {
          var lb = new L.TileLayer(lburl, hkmapOpt);
          var layers = L.layerGroup([bm, lb]);
          layerChooser.addBaseLayer(layers, maptitle);
        }
      }
    }
  },
};

var setup =  window.plugin.mapTileHKLands.addLayer;

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
