// example: https://github.com/ox-it/wl-course-signup/blob/master/tool/src/main/webapp/static/lib/signup-split.js

// jquery plugin to turn any element you want into a youtube video
(function($) {
  $.fn.ytembed = function(options) {
    // defaults
    
    
    // 1. define all the needed methods
      function getParams(embed) {
        // function for setting default if parameters doesn't exist
        function getParam(param, def) {
          var value = def;
          // for youtube-embed tags
          if (embed.is('[' + param + ']'))
            value = embed.attr(param);
          // for any other element that has youtube-embed class
          else if (embed.is('[data-' + param + ']'))
            value = embed.data(param);
          return value;
        }
        
        // object literal to return
        return {
          width:           getParam('width', 560),
          height:          getParam('height', 315),
          src:             'http://www.youtube.com/embed/' + getParam('src', '') + '?t=' + getParam('startfrom', '0s'),
          frameborder:     getParam('frameborder', 0),
          allowfullscreen: getParam('allowfullscreen', false),
          autoplay:        getParam('autoplay', false),
        }
      }
      
      // given parameters, outputs string for an embedded youtube video
      // if youtube ever changes its embedding method, this is the function to change
      function embedVideo(params) {
        var html = '<iframe ';
        
        // go through each parameter and add it to the iframe
        $.each(params, function(key, value) {
          html = html + key + '="' + value + '" ';
        });
        
        html = html + '></iframe>';
        
        return html;
      }
  
    // 2. with all methods defined, we can replace the necessary html and return
    //    the desired object
      this.each(function() {
        $item = $(this);
        $item.replaceWith(embedVideo(getParams($item)));
      }); // end each
      return this;
  }; // end ytembed
}(jQuery)); // end function
