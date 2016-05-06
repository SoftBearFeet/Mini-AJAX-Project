
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Google Street API
    var streetVal = $('#street').val();
    var cityVal = $('#city').val();

    var address = streetVal + " " + cityVal;

    $(".greeting").text('So you want to live at ' + address + '?');

    var streetURL = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address;

    // Inserts the image from Google into the webpage
    $body.append('<img class= "bgimg" src=' + streetURL + '>');

    //NYTimes API
    var nytimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityVal + "&sort=newest&api-key=8bade60ef8ac7fc8d1baebec3f908e17:19:75161063";
    $.getJSON(nytimesURL, function(data) {
      $nytHeaderElem.text('New York Times Articles about ' + cityVal);

      articles = data.response.docs

      // This loops through the response and appends the URL and text to the webpage.
      for (var i=0; i < articles.length; i++) {
        var article= articles[i];
        $nytElem.append('<li class="article">' + '<a href=' + article.web_url + '>'+article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
      };
      // This is a bit of code so that if the request failed. It would change the text on the screen so that the user would be aware that it failed.
    }).error(
      $nytHeaderElem.text('Could not load New York Times'));

      //Wiki API
      var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityVal + "&format=json&callback=wikiCallback";

      $.ajax({
        url: wikiURL,
        dataType: 'jsonp',
        success: function (response) {
          var wikiArticles = response[1];
          var wikiLinks = response[3];

          // This loops though the different articles and appends them to the page.
          for (var i = 0; i < wikiArticles.length; i++) {
            articleStr = wikiArticles[i];
            linkStr = wikiLinks[i];

            $wikiElem.append('<li><a href=' + linkStr + '>' + articleStr + '</a></li>');
          };
        }
      });
    return false;
};

$('#form-container').submit(loadData);
