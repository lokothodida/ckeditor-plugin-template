/**
  * Title:        YoutubeEmbed (ytEmbed)
  * Description:  Turn any element into an embedded Youtube video
  * Author:       Lawrence Okoth-Odida
  * Version:      0.1
  * Date:         04/06/2014
  
  * BASIC USE
      1. Create a div with a class (e.g. 'youtube-embed') and give it the pseudo
         data attribute src (e.g. 'data-src="vidID"'), where its value is the id 
         of the YouTube video
      2. Call ytembed on the div (e.g. $('.youtube-embed').ytembed())
      
  * ADVANCED USE
      ytembed takes an object literal as a parameter for the options. Set the
      defaults for the videos on the page with them. For example, if you want
      all the videos on the page to be large and allow for full screen, use:
      
        $('.youtube-embed').ytembed({
          width: 1280,
          height: 720,
          allowfullscreen: true
        });
        
      Available parameters are src, height, width, frameborder, allowfullscreen,
      startfrom and autoplay.
  
  * @param {object} options are the page-wide defaults for any given video
  */
(function($) {
  $.fn.ytembed = function(options) {
    // settings
    var settings = $.extend({
      src:             '',
      width:           560,
      height:          315,
      frameborder:     0,
      allowfullscreen: false,
      startfrom:       '0s',
      autoplay:        false
    }, options);
    
    /**
      * This pulls the parameters out of the object we are replacing
      * @param {object} embed is an element selected for replacement
      */
    var getParams = function(embed) {
      return {
        width:           getParam(embed, 'width', settings.width),
        height:          getParam(embed, 'height', settings.height),
        src:             'http://www.youtube.com/embed/' + getParam(embed, 'src', settings.src) + '?t=' + getParam(embed, 'startfrom', settings.startfrom),
        frameborder:     getParam(embed, 'frameborder', settings.frameborder),
        allowfullscreen: getParam(embed, 'allowfullscreen', settings.allowfullscreen),
        autoplay:        getParam(embed, 'autoplay', settings.autoplay),
      }
    }

    /**
      * This gets a single parameter from the object we are replacing
      * @param {object} embed is an element selected for replacement
      * @param {string} param is the name of the parameter being searched for
      * @param {string} def is the default value for the parameter
      */
    var getParam = function(embed, param, def) {
      var value = def;
      // if embed has the attribute 'param'
      if (embed.is('[' + param + ']'))
        value = embed.attr(param);
      // if embed uses the 'data-' prefix 
      else if (embed.is('[data-' + param + ']'))
        value = embed.data(param);
      return value;
    }
    
    /**
      * Build the correct Youtube Embed markup
      * @param {object} params is a literal of all of the parameter keys and values
      */
    var embedVideo = function(params) {
      var iframe = $('<iframe/>');
      
      // go through each parameter and add it to the iframe
      $.each(params, function(key, value) {
        iframe.attr(key, value);
      });
      
      return iframe;
    }
    
    return this.each(function() {
      $item = $(this);
      $item.replaceWith(embedVideo(getParams($item)));
    });
  };
}(jQuery));
