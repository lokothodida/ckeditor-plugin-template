/**
  * Given an .oxpoint div with suitable 'data-' tags, it produces the corresponding
  * Google Map.
  */
  
(function($){
  $.fn.oxpointmap = function(options) {
    /* PROPERTIES */
    var obj = this;
    var _settings = $.extend({
      
    }, options);
    
    /* METHODS */
    var getDisplaySettings = function(oxpoint) {
      var settings = {};
      
      settings.uri = oxpoint.data('uri');
      
      settings.showMap = oxpoint.data('inc-map');
      settings.showAddress = oxpoint.data('inc-add');
      settings.showHome = oxpoint.data('inc-home');
      settings.showTitle = oxpoint.data('inc-title');
      
      return settings;
    }
    
    var displayMap = function(oxpoint, settings) {
      var wrapper = $('<div class="oxpointmap"/>');
      var explodedurl = settings.uri.split('/');
      var id = explodedurl[explodedurl.length-1];
      var url = 'http://api.m.ox.ac.uk/places/oxpoints:' + id;
      console.log(url);
      
      $.ajax({
        url: url,
        dataType: 'json',
        success: function(json) {
          console.log(json);
          //json = json[0];
          
          // map
          if (settings.showMap && $.fn.goMap) {
            map = $('<div class="map"/>');
            map.goMap({
              latitude: json.lat,
              longitude: json.lon,
              zoom: 16,
              /*markers: [{
                title: json.name,
                latitude: json.lat,
                longitude: json.lon
              }]*/
            });
            wrapper.append(map);
          }
          // title
          if (settings.showTitle) {
            var h2 = $('<h2 class="title"/>');
            h2.html(json.name);
            wrapper.append(h2);
          }
          // address
          if (settings.showAddress && json.address) {
            var address = $('<div class="address"/>');
            address.html(json.address);
            wrapper.append(address);
          }
          // homepage
          if (settings.showHome) {
            var homepage = $('<div class="homepage"/>');
            var a = $('<a/>');
            
            a.attr('href', json.website)
             .attr('target', '_blank')
             .html(json.website);
            
            homepage.append(a);
            wrapper.append(homepage);
          }
        },
        error: function(e, s, t) {
          console.log('not working');
          console.log(e);
          console.log(s);
          console.log(t);
          wrapper.append('<p>Error in fetching information.</p>');
        },
        complete: function() {
          oxpoint.hide().after(wrapper);
          oxpoint.remove();
        }
      });
    };
    
    return this.each(function() {
      var $this = $(this);
      displayMap($this, getDisplaySettings($this));
    });
  };
}(jQuery));
