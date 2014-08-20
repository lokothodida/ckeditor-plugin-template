$(document).ready(function() {
  // search query object (just a literal of all the search properties)
  // sets the defaults for the query
  var query = {
    orderby: 'relevance',
    maxresults: 5,
  }; 
  
  // behaviour for changing query parameters
  // order
  $('#yt-searchbox #orderby').change(function(){
    searchProperties.orderby = $(this).val();
    search();
  });
  
  // max results
  $('#yt-searchbox #maxresults').change(function(){
    searchProperties.maxresults = $(this).val();
    search();
  });
  
  // button (first enable it)
  $('#yt-button').attr('disabled', false);
  $('#yt-button').click(function () {
    search();
    return false; // prevent normal functionality
  });
  
  // search function
  function search() {
    // pull and sanitize the term
    var term = $('#yt-query').val().trim();
    
    // get base Youtube API URL and build up the string
    var url = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyDov_EJkjxi_Qqu8oS4YFoH8TFp9eGKXBY&part=snippet'
    
    // build the string using the query
    query.forEach(function(key, value) {
      url = url + '&' + key '=' + value;
    });
    
    // now perform the JSON call to get the results
    $.getJSON(url, function(results) {
      if (results.items) {
        // if we have items, loop through and display them
        // build up an html string and use that to fill the results box
        
        var html = "";
        
        resullts.items.forEach(function(item){
          html += '<p><a href="http://youtu.be/' + item.id.videoId + '"></p>';
        }); // end foreach
        
        $('#yt-results').html(html);
      }
      else {
        // no items
        $('#yt-results').html('<p>Sorry, no videos found.</p>');
      }
    }); // end getJSON
  }
}); // end ready
