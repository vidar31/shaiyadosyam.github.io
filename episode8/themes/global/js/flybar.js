/**
 * Flybar features setup
 * This code requires MooTools to work
 *
 * Following settings can be passed to the Flybar object:
 *
 * Flybar.Settings.slots - array with two strings which are the DFP tag id/name
 *     ex.: Flybar.Settings.slots = ['/1016164/Meebo_Replace_01', '/1016164/Meebo_Replace_02']
 * Flybar.Settings.fbURL - URL of the facebook page to be liked
 *     ex.: Flybar.Settings.fbURL = 'https://www.facebook.com/aeria'
 *
 * @author Jonas Hartmann <jhartmann at aeriagames.com>
 */
(function(window, document, undefined){
  'use strict';
  var Flybar = window.Flybar || {};

  // Load settings locally with default values if they are not set.
  Flybar.Settings = Flybar.Settings || {};
  var _settings = {
    fbURL: Flybar.Settings.fbURL || 'https%3A%2F%2Fwww.facebook.com%2Faeria',
    slots: Flybar.Settings.slots || ['/1016164/Meebo_Replace_01', '/1016164/Meebo_Replace_02']
  };

  // Main loader function to be executed after the page finishes loading
  var loader = function loader() {
    _loadFB(_settings.fbURL);

    // Add a toggle button to show/hide the flybar
    var flybarFXout = new Fx.Tween('flybar', {
        duration: 'normal',
        transition: 'sine:out',
        link: 'ignore',
        property: 'height'
    });
    var flybarFXin = new Fx.Tween('flybar', {
        duration: 'normal',
        transition: 'sine:in',
        link: 'ignore',
        property: 'height'
    });

    if (flybarFXout && flybarFXin) {
      var flybarToggle = $$('.flybar-toggle');
      if (flybarToggle && flybarToggle.length > 0) {
        flybarToggle.addEvent('click', function(event){
            event.stop();
            flybarToggle.toggleClass('flip-v');
            if ($('flybar').style.height != '0px') {
              // Close flybar
              flybarFXout.start(0);
            } else {
              // Open flybar
              flybarFXin.start(36);
            }
        });
      }

      return true;
    } else {
      var console = window.console || false;
      if (console) {
        console.error('Could not load flybar effects. Is MooTools available?');
      }
      return false;
    }
  };

  function _loadFB(url) {
    var socialContainer = $$('#flybar .flybar-social')[0];
    if (socialContainer) {
      socialContainer.innerHTML = '<iframe src="//www.facebook.com/plugins/like.php?href=' +
        url +
        '&amp;send=false' +
        '&amp;layout=button_count'+
        '&amp;width=170'+
        '&amp;show_faces=true'+
        '&amp;font=verdana'+
        '&amp;colorscheme=light'+
        '&amp;action=like'+
        '&amp;height=21" '+
        'scrolling="no" '+
        'frameborder="0" '+
        'style="border:none; overflow:hidden; width:170px; height:21px;" '+
        'allowTransparency="true" '+
        '></iframe>';
    }
  }

  function _loadSlots(slots) {
    var googletag = window.googletag || {};
    googletag.cmd = googletag.cmd || [];
    googletag.cmd.push(function() {
      for (var i = 0; i < slots.length; i++) {
        googletag.defineSlot(slots[i], [150, 32], 'slot' + (i+1)).addService(googletag.pubads());
      }
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
    });
  }

  if (window.addEventListener) window.addEventListener("load", loader, false);
  else if (window.attachEvent) window.attachEvent("onload", loader);
  else window.onload = loader;

  (function() {
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
  })();

  // Google Ads need to be setup while loading the page
  _loadSlots(_settings.slots);

})(window, document);