(function($){
  $.fn.ccsearch = function(options) {
    // initialize settings
    var settings = $.extend({
      params: {},
      results: '#results',
      service: 'Google',
      displayResult: function(item) {
        var html = '';
        html = html + '<li>' + item.htmlTitle;
        
        if (item.pagemap.cse_thumbnail)
          html = html + '<img src="' + item.pagemap.cse_thumbnail[0].src + '"/>';
        html = html + '</li>';
               
        return html;
      }
    }, options);
    
    // methods
    var getSearchParams = function(form) {
      var params = {};
      
      form.find('[name]').each(function() {
        var $this = $(this);
        params[$this.attr('name')] = $this.val();
      });
      
      params = $.extend(settings.params, params);
      
      return params;
    }
    
    var buildSearchQuery = function(params) {
      var url = '';
      if (settings.service == 'Google') {
        url = 'https://www.googleapis.com/customsearch/v1?q=' + params.q + '&key=' + settings.key;
      }
      else if (settings.service == 'Flickr') {
        url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + settings.key + '&format=json&nojsoncallback=1&text=' + params.text;
      }
      
      $.each(params, function(key, value) {
        if (key != 'q' && key != 'text')
          url = url + '&' + key + '=' + value;
      });

      return url;
    }
    
    var getSearchResults = function(url) {
      return $.ajax({
        url: url,
        dataType: 'json',
        success: function(results) {
          console.log(results);
          var div = $(settings.results).empty();
          
          if (results.items) {
            $.each(results.items, function(key, item) {
              div.append(settings.displayResult(item));
            });
          }
          else if (results.photos.photo) {
            $.each(results.photos.photo, function(key, item) {
              div.append(settings.displayResult(item));
            });
          }
          
          
        },
        error: function() {
          console.log('error');
        }
      });
    }
    
    var thisobj = this;
    
    this.on('submit', 'form', function() {
      if (!settings.key)
        alert('You must provide a valid API key for this plugin to work.');
      else {
        var params = getSearchParams(thisobj),
            query = buildSearchQuery(params);
        
        getSearchResults(query);
        console.log(query);
      }
      return false;
    });
    
    
    /*
    if (!settings.key)
      alert('You must provide a valid API key for this plugin to work.');
    else {
      this.on('submit', 'form', function() {
        getSearchResults(
          buildSearchQuery(
            getSearchParams(
              this
            )
          )
        );
        return false;
      });
      
    }*/
    return this;
  }
}(jQuery));
