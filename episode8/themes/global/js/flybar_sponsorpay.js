(function (window, document, undefined){
    'use strict';

    var Flybar = window.Flybar || {};
    Flybar.Offers = Flybar.Offers || {};
    Flybar.Offers.load = function () {
        // Redirects to offer page as default
        redirectToOffersPage();
    };

    function redirectToOffersPage() {
        window.location.href = window.URL_STATIC + '/offers';
    }

    // Enabled only if user is logged in
    if (window.Profile && window.Profile.uid) {
        // Setup the video widget only after the page is loaded
        if (window.addEventListener) window.addEventListener("load", _featureLoader, false);
        else if (window.attachEvent) window.attachEvent("onload", _featureLoader);
    }

    function _featureLoader() {
        _loadSP();
        _loadVideoWidget();
    }

    /**
     * Tries to load the SponsorPay widget, if the web client service is already available.
     * If not, then it will retry later.
     */
    function _loadVideoWidget() {
        if (window.SPONSORPAY && window.SPONSORPAY.Video) {
            var _sp_has_offers = true;
            var _sp_video = new SPONSORPAY.Video.Iframe({
                appid: '15429', // the appid you get from the publisher dashboard
                uid: window.Profile.uid, // anything you want that is unique and constant per user
                height: 1000,
                width: 1000,
                display_format: 'player_and_reward',  // bare_player, will show only the video.
                                // use 'player_and_reward' to show a line
                                // describing the reward on top of the video box.
                callback_on_start: function(offer) {
                    //This function will be called if we have offer available for the user

                    //The "offer" object in params contains two icon urls
                    //These icons will be sometimes branded for the next video!
                    _sp_has_offers = true;
                },
                callback_no_offers: function(){
                    //This function will be called if we have no offer
                    _sp_has_offers = false;
                },
                callback_on_close: function(){
                    //This function will be called if our lightbox is closed
                    _sp_video.backgroundLoad();
                },
                callback_on_conversion: function(){
                    //This function will be called after user clicked the green button after watching
                    redirectToOffersPage();
                }
            });

            Flybar.Offers.backgroundLoad = _sp_video.backgroundLoad.bind(_sp_video);
            Flybar.Offers.backgroundLoad();

            var oldLoadFn = Flybar.Offers.load;
            Flybar.Offers.load = function load () {
                if (_sp_has_offers) {
                    _sp_video.showVideo();
                    return true;
                }
                // Call original load function
                if (oldLoadFn) {
                    oldLoadFn();
                    return true;
                }
            };
        } else {
            // Try again later, maybe the script didn't finish loading yet.
            setTimeout(_loadVideoWidget, 500);
        }
    }

    function _loadSP() {
        var sps = document.createElement('script');
        sps.async = true;
        sps.type = 'text/javascript';
        var useSSL = 'https:' == document.location.protocol;
        sps.src = (useSSL ? 'https:' : 'http:') + '//be.sponsorpay.com/assets/web_client.js';
        sps.charset = 'utf-8';
        var node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(sps, node);
    }

    // Exports
    window.Flybar = Flybar;
})(window, document);
