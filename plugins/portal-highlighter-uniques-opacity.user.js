// ==UserScript==
// @id             iitc-plugin-portal-highlighter-uniques-opacity@xificurk
// @name           IITC plugin: Highlight unique visits/captures using opacity
// @category       Highlighter
// @version        0.1.1.20181030
// @description    [release-20181030] Use stroke and fill opacity to denote player's unique visits and captures. Requires uniques plugin.
// @updateURL      https://github.com/charlielok/iitc/raw/master/plugins/portal-highlighter-uniques-opacity.user.js.js
// @downloadURL    https://github.com/charlielok/iitc/raw/master/plugins/portal-highlighter-uniques-opacity.user.js.js
// @namespace      https://github.com/charlielok/iitc
// @include        https://intel.ingress.com/*
// @match          https://intel.ingress.com/*
// @author         xificurk
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'xificurk';
plugin_info.dateTimeVersion = '20181030';
plugin_info.pluginId = 'portal-highlighter-uniques-opacity';
//END PLUGIN AUTHORS NOTE


//PLUGIN START ////////////////////////////////////////////////////////

//use own namespace for plugin
window.plugin.portalHighlighterUniquesOpacity = function () {};


window.plugin.portalHighlighterUniquesOpacity.highlighter = {
  highlight: function(data) {
    var guid = data.portal.options.ent[0];
    var uniqueInfo = window.plugin.uniques.uniques[guid];

    var style = {};

    if(uniqueInfo) {
      if(uniqueInfo.captured) {
        // captured (and, implied, visited too) - hide
        style.fillOpacity = 0;
        style.opacity = 0.25;

      } else if(uniqueInfo.visited) {
        style.fillOpacity = 0.2;
        style.opacity = 1;
      }
    } else {
      // no visit data at all
      style.fillOpacity = 0.8;
      style.opacity = 1;
    }

    data.portal.setStyle(style);
  },

  setSelected: function(active) {
    window.plugin.uniques.isHighlightActive = active;
  }
}


var setup = function() {
  if(window.plugin.uniques === undefined) {
    alert("'Portal Highlighter Uniques Opacity' requires 'uniques'");
    return;
  }

  window.addPortalHighlighter('Uniques (opacity)', window.plugin.portalHighlighterUniquesOpacity.highlighter);
}

//PLUGIN END //////////////////////////////////////////////////////////


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
