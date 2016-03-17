//
// Thanks to Fairfield University and University of Huddersfield
// for all the tips, help, and code!
//

$(document).ready(function() {
setTimeout(function() {
  libMyScope = angular.element('html').scope();
  libInitWithScope( );
}, 1000);


  var cssPath = '//gvsuliblabs.com/labs/summon2.0/',libDetailPageId, newHref, libCurrentURL, record, recordParts, thisID,libCurrentURL = window.location.hash.substring(1);
  // Add custom styles
  $('head').append('<link rel="stylesheet" type="text/css" href="' + cssPath + 'summon2.css?date=20160304" />');
  console.log('Added custom stylesheet.');


    
  setTimeout(function() {

    var li = document.createElement('div');
    li.id = 'library-chat';
    var libChatDiv = document.createElement('a');
    libChatDiv.appendChild(document.createTextNode('Ask a Question'));
    libChatDiv.className = 'btn btn-default';
    li.appendChild(libChatDiv);
    document.querySelector('.savedItemsFolderContainer').appendChild(li);
    var chatWindow = function() {
      window.open('http://labs.library.gvsu.edu/labs/chat', 'Ask a Question', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,left=20,top=20,width=460,height=460');
    }
    if (libChatDiv.addEventListener) {
      libChatDiv.addEventListener('click', chatWindow, false);
    } else {
      libChatDiv.attachEvent('onclick', chatWindow);
    }
    console.log('Added the chat button.');

    // Accessability titles
    $('div.searchBox div.queryBox span.caret').parent().attr('title','advanced search');
    console.log('Provided accessibility to advanced search link.');

    // Fix the homepage banner links, which are invisible because
    // they are white on a white background
    if($("div.home").css("display") !== 'none') {
      $("div.home").prepend('<div id="home-banner" style="height:6em;background-color:#0065a4;">&nbsp;</div>');
    }

    // I want the logo to be a bit bigger
    $(".siteHeader .Logo img").attr("src", "//gvsu.edu/homepage/files/img/gvsu_logo.png");
    console.log('Made the logo bigger.');

    // Proquest has 2 links both labeled "Log in" that go to different places
    // because they cannot do Internet. Fix that
    $('form.flowLogin').find('input[type="submit"]').attr('title', 'Save and organize citations to make research and writing easier.');
    console.log('Changed the title attribute for the RefWorks log in link.');

    
    // Overwrite any mention of Zumberge Library because we moved out of there 2 years ago and 
    // what are you guys even doing over there at ProQuest I can't even
    $('li[row-value="document.libraries"]').find('span[ng-class="valueClass"]:contains("Zumberge")').text('Mary Idema Pew Library');
    console.log('Replaced a mention of Zumberge Library with Mary I.');

    var sillyLinkText,newText;
    $("a.availabilityLink:contains(' Browse Similar,')").each(function() {
      sillyLinkText = $(this).text();
      newText = sillyLinkText.replace(' Browse Similar','');
      $(this).text(newText);
      console.log('Removed silly text in book availability statement');
    });

  //recordSearch();

  }, 4000);

  
  	//Track what type of content user actually click on (with GA)
  	$('div.inner').on('click','a[ng-class="linkClass"] , a.availabilityLink', function() {
  		var libContentType = $(this).closest('div.summary').find('div.contentType span.ng-binding').text();
  		_gaq.push(['_trackEvent', 'gvsuCustomClick', 'clickOnMainResult', 'contentType:' + tidyContentType(libContentType)]);
  	});
  	//preview pane - can't think of less stupid way to do this
  	var contentTypeOfLastHoveredOn;
  	$('div.inner').on('mouseenter','div.documentSummary', function() {
  		contentTypeOfLastHoveredOn = $(this).find('div.contentType span.ng-binding').text();
  	});
  	$('div.previewPane').on('click','a[ng-class="linkClass"] , div.previewOptions a.btn.span4:first', function() {
  		_gaq.push(['_trackEvent', 'gvsuCustomClick', 'clickOnPreview', 'contentType:' + tidyContentType(contentTypeOfLastHoveredOn)]);
  	});
  	//saved item dialog
  	$('div.savedItemsDialog').on('click','a[ng-class="linkClass"] , a.availabilityLink', function() {
  		var libContentType = $(this).closest('div.summary').find('div.contentType span.ng-binding').text();
  		_gaq.push(['_trackEvent', 'gvsuCustomClick', 'clickOnSavedItem', 'contentType:' + tidyContentType(libContentType)]);
  	});

  	$('.advancedBtn').click(function() { logClickGA('clickOnInterface','Advanced Search'); });


  // Extract a bib Number from a Summon docID (thanks, Dave Pattern!)
  function libGetBibID(str) {
  	var bibID = 0;
  	if( str ) {
  		bibID = str.replace(/^.*gvsu_catalog_([0-9]*)([0-9])$/, "$1" );
  		if( bibID === str ) { bibID = 0; }
  	}
  	return(bibID);
  }


  // PARSE THE QUERY STRING FOR SOMETHING

  function libGetQueryVariable(variable,query) {
  	if( query ) {
  		var chunks = query.split('?');
  		if( chunks[1] ) {
  			var vars = chunks[1].split('&');
  			for (var i = 0; i < vars.length; i++) {
  				var pair = vars[i].split('=');
  				if (decodeURIComponent(pair[0]) == variable) {
  					return decodeURIComponent(pair[1]);
  				}
  			}
        if(chunks[2]) {
          var vars = chunks[2].split('&');
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
          }
        }
        }
        console.log('Query variable %s not found', variable);
  		}
  	}
  }

  // Clean up events sent to GA
  function tidyContentType( text ) {
  	if( text ) {
  		res = text.split(" (");
  		text = res[0];
  	}
  	return( text );
  }

  // Record a log to the console for debugging
  function libLog(message) {
  	var date = new Date();
  	var time = date.toLocaleTimeString();
  	console.log(message+' ['+time+']');
  }

  function recordSearch() {
     // Record accurate Search usage
   var searchQuery = libGetQueryVariable('q', window.location.href);

    if((typeof searchQuery === 'undefined') || (searchQuery == null)) {
          searchQuery = libGetQueryVariable('s.q', window.location.search);
    }

    console.log(searchQuery);

    var topicTitle, topicFrom, topicSummary, hasTopic = false, databaseRecommendations, expansion;

    // Check to see if there is a Topic Explorer entry
    if($('[aria-label="Topic Summary"]').length > 0) {

      hasTopic = true;
      topicTitle = $('div.rightBar[aria-label="Topic Summary"]').find('h1:first').text();
      topicFrom = $('div.rightBar[aria-label="Topic Summary"]').find('div.from.ng-binding').text();
      topicSummary = $('div.rightBar[aria-label="Topic Summary"]').find('div.snippet.hidden-phone.ng-binding').text();

      console.log('This search has a Topic Explorer entry of ' + topicTitle + ' from ' + topicFrom);

      // Append an error reporting link and about link to the Topic Explorer

      var thisUrl = encodeURIComponent(window.location);

      // First remove all old help lines
      if($('.gvsu-te-help').length > 0) { 
        $('.gvsu-te-help').remove();
      }
      var topicExplorerButton = '<p class="gvsu-te-help" style="margin:.75em 0; border-bottom: 1px solid #999; padding: .75em 0;"><a href="http://labs.library.gvsu.edu/status/?problem&url=' + thisUrl + '" class="te_problem">Report a Problem with this Result</a><a style="float:right;display: inline-block; margin-left: 1em;" href="#" id="te-why">Why is this here?</a></p>';
      
      $('div.rightBar[aria-label="Topic Summary"]').find('.sourceLink.customPrimaryLink').addClass('btn').css('margin-top','.75em').addClass('btn-default').parent('div').append(topicExplorerButton);

       $('.te_problem').click(function(e) {
         e.preventDefault();

        var problemMessage = 'Search: ' + searchQuery + "\n\r" + 'Topic: ' + topicTitle + "\n\r" + 'Source: ' + topicFrom +  "\n" + 'Summary: ' + topicSummary;
        console.log(problemMessage);
       
        var teProblem = $.ajax({
        url: "https://gvsuliblabs.com/labs/te/index.php",
        method: "POST",
        data: { feedback : problemMessage, url: thisUrl }
      });
       
      teProblem.done(function( msg ) {
        console.log('Saved search query: ' + msg);
        $('.te_problem').css('color', 'green').removeClass('te_problem').html(msg);
      });
       
      teProblem.fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
      });
      
    });

      $('#te-why').click(function(e) {

        e.preventDefault();

        // Insert a modal dialog box to direct users to Document Delivery
        $("body").append('<div class="overlay"><div class="modal-box"><h4 style="text-align:center;margin-bottom: 1em;">What is this?</h4><p>This library search attempts to match your search terms with reference material related to the topic you are interested in.</p><p>This process is automated but isn&#8217;t always perfect. At times, words in your search or synonyms might cause unrelated topics to appear here.</p><p>If that&#8217;s the case, you can always <a href="http://labs.library.gvsu.edu/status/?problem&url=' + thisUrl + '">let us know there is a problem</a>. We work closely with the team that built this search tool to improve these results.</p><div class="close-button">[x]</div></div></div>');

        $(".close-button").click(function() {
          $(".overlay").hide();
        });
    
    });
}

    if($('.databaseRecommendations').length > 0) { // Check for database recommender

      databaseRecommendations = $('.databaseRecommendations').find('ul.list-unstyled').text();
      console.log(databaseRecommendations);

    }

    if($('.expansionTerms').length > 0) { // Check for query expansion terms

      expansion = $('.expansionTerms').text();
      expansion = expansion.replace('including ', '');

    }

    if(typeof searchQuery !== 'undefined') {

      var searchRequest = $.ajax({
        url: "https://gvsuliblabs.com/labs/summon2.0/summon2.php",
        method: "POST",
        data: { search : searchQuery, topic: hasTopic, title: topicTitle, source: topicFrom, summary: topicSummary, expansion: expansion, databases: databaseRecommendations }
      });
       
      searchRequest.done(function( msg ) {
        console.log('Saved search query: ' + msg);
      });
       
      searchRequest.fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
      });
    }
}

  function logClickGA( eventName, eventValue ) {
  //	libLog(eventName+'='+eventValue);
  	_gaq.push(['_trackEvent', 'gvsuCustomClick', eventName, eventValue]);
  }

function libInitWithScope( ){
    console.log('initialising...');

    // WATCH FOR RESULTS FEED CHANGES...
    libMyScope.$watchCollection('feed', function(){
      // give AngularJS time to update the DOM
      setTimeout(function() { 
        libUpdateResultsPage(); 
        recordSearch();
      }, 1000);
      console.log('Scope.feed changed! - loading finished');
    });

}

function libUpdateResultsPage() {

  /* Tell Zotero new COinS records have been created */
  try {
    var libZoteroEvent = document.createEvent('HTMLEvents');
    libZoteroEvent.initEvent('ZoteroItemUpdated', true, true);
    document.dispatchEvent(libZoteroEvent);
  }
  catch(err) {
    console.log('Zotero error trapped');
  }
}


});
