//
// Thanks to Fairfield University and University of Huddersfield
// for all the tips, help, and code!
//

$(document).ready(function() {

  var cssPath = '//gvsuliblabs.com/labs/summon2.0/',libDetailPageId, newHref, libCurrentURL, record, recordParts, thisID,libCurrentURL = window.location.hash.substring(1);
  // Add custom styles
  $('head').append('<link rel="stylesheet" type="text/css" href="' + cssPath + 'summon2.css" />');
  console.log('Added custom stylesheet.');


    
  setTimeout(function() {
   /* $(".savedItemsFolderContainer").append('<div id="libchat_6290b3d40228a9e708fa7066d01f56bf"></div>');
    var chatScript = document.createElement('script');
	  chatScript.type = 'text/javascript';
	  chatScript.src = '//v2.libanswers.com/load_chat.php?hash=6290b3d40228a9e708fa7066d01f56bf';
	  document.body.appendChild(chatScript); */

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
    $('form.flowLogin').find('input[type="submit"]').attr('title', 'Save and organize citations to make research and writing easier.').val('Log in to ProQuest Flow');
    console.log('Changed the label and title for the ProQuest Flow log in link.');

    
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

    // Record accurate Search usage
   var searchQuery = libGetQueryVariable('s.q', window.location.search);

    if((typeof searchQuery === 'undefined') || (searchQuery == null)) {
          searchQuery = libGetQueryVariable('q', window.location.href);
    }

    console.log(searchQuery);
    var topicTitle, topicFrom, topicSummary, hasTopic = false;

    // Check to see if there is a Topic Explorer entry
    if($('[aria-summary="Topic Summary"]').length > 0) {

      hasTopic = true;
      topicTitle = $('div.rightBar[aria-label="Topic Summary"]').find('h1:first').text();
      topicFrom = $('div.rightBar[aria-label="Topic Summary"]').find('div.from.ng-binding').text();
      topicFrom = $('div.rightBar[aria-label="Topic Summary"]').find('div.snippet.hidden-phone.ng-binding').text();

      console.log('This search has a Topic Explorer entry of ' + topicTitle);
    }

    if(typeof searchQuery !== 'undefined') {

      var searchRequest = $.ajax({
        url: "https://gvsuliblabs.com/labs/summon2.0/summon2.php",
        method: "POST",
        data: { search : searchQuery, topic: hasTopic, title: topicTitle, from: topicFrom, summary: topicSummary }
      });
       
      searchRequest.done(function( msg ) {
        console.log('Saved search query: ' + msg);
      });
       
      searchRequest.fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
      });
    }

    // Record eBook referrers
  $('div#results ul.list-unstyled > li[ng-repeat="item in feed.items"]').each(function() { 
    var result = $(this);
    var format = $(this).find('div.contentType').find('span:nth-child(2)').text();

    if(format == 'eBook') {
      //console.log(format);
      var openURL = $(result).find('span.Z3988').attr('title');
      var opacNo = getParameterByName('rft.externalDocID');
      opacNo = opacNo.slice(0, - 1);
      console.log(opacNo);

      // Now load the part of the catalog record that has the 856 link
      var recordChunk = document.createElement('div');
      recordChunk.className = 'providerHack';
      recordChunk.style.display = 'none';
      $(result).append(recordChunk);
      $(result).find('.providerHack').load('http://gvsuliblabs.com/labs/ebooks/summonHelper.php?record='+opacNo);
      console.log(opacNo);

      $(result).find('a[role="link"]').click(function() {
        var eBookProvider = $(this).closest('li[ng-repeat="item in feed.items"]').find('.providerHack').text();
        var eBookTracker = document.createElement('img');
        eBookTracker.src = '//labs.library.gvsu.edu/labs/ebooks/?source=summon&prov=' + encodeURIComponent(eBookProvider.trim());
        document.body.appendChild(eBookTracker);
      });

    }   

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(openURL);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

  });

  }, 6000);

  
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

/*
  // If this is a book detail page, update the Request button to either
  // request the book from the shelf or from the ASRS

  if( libCurrentURL.indexOf("gvsu_catalog") > 0 ) {
    		record = libGetQueryVariable('id',libCurrentURL);
        libDetailPageId = libGetBibID(record);
        libLog(libDetailPageId);

      $.ajax({
        type: "GET", //Change to whatever method type you are using on your page
        url: cssPath + "summon2.php",
        data: { record: libDetailPageId }
     }).done(function(result) {
        newHref = result;
        $("a.secondary.btn.ng-binding").attr('href',newHref);

        //alert(newHref);
     });
  }
  */

  // Remove the text in availability links



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

  function logClickGA( eventName, eventValue ) {
  //	libLog(eventName+'='+eventValue);
  	_gaq.push(['_trackEvent', 'gvsuCustomClick', eventName, eventValue]);
  }
});
