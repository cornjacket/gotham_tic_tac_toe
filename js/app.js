console.log("app is up")

// Following handles the button clicking and enabling/disabling the tab-pane

$(document).ready(function() {

	console.log("document is ready")

	// change temp display state and render weather if user clicks
	$('#button1').on('click', function(event) {
	  event.preventDefault(); // prevents page scrolling upon click          
      console.log("button1 clicked")
      // remove my-active from all associated my-tab-panes
      // this is a make it work method, but not extensible
      // if the my-tab-pane is to be used for other panes.
      // Since there is no need, we can simply use this.
      $('.my-tab-pane').removeClass('my-active')

      // add my-active to the associated my-tab-pane
      $('#tab-button1').addClass('my-active')

	}); 

	$('#button2').on('click', function(event) {
	  event.preventDefault(); // prevents page scrolling upon click          
      console.log("button2 clicked")
      // remove my-active from all associated my-tab-panes
      $('.my-tab-pane').removeClass('my-active')

      // add my-active to the associated my-tab-pane
      $('#tab-button2').addClass('my-active')

	}); 


	$('#button3').on('click', function(event) {
	  event.preventDefault(); // prevents page scrolling upon click          
      console.log("button3 clicked")
      // remove my-active from all associated my-tab-panes
      $('.my-tab-pane').removeClass('my-active')

      // add my-active to the associated my-tab-pane
      $('#tab-button3').addClass('my-active')

	}); 	

}) // document ready

// String truncation method added to String type
// http://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript
String.prototype.trunc =
     function(n,useWordBoundary){
         var tooLong = this.length>n,
             s_ = tooLong ? this.substr(0,n-1) : this;
         s_ = useWordBoundary && tooLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  tooLong ? s_ + '&hellip;' : s_;
      };


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////
//
// I noticed that the ajax get request for XML data is rather slow for the user.
// Upon initial page display the script will perform the ajax get request for the 
// first and next quote prior to the user clicking the mouse, thereby doing
// a pre-fetch. When the user clicks the mouse, the pre-fetched quote will be displayed immediately
// and the next quote will be pre-fetched. It is expected that during the time the user
// is reading the current quote, that the pre-fetch will complete. This will have a
// better UX.
//
// This is my third draft of this project.
// This project uses Twitter bootstrap and jQuery's ajax().
// The program is separated into 4 modules: View, Quote (model), Quote API, and 
// QuoteController.
// This implementation of MVC requires the View and Model to use methods internal to
// the QuoteController. This version implements prefetch.
// A future enhancement of this could be re-implementing the project using Angular .
////////////////////////////////////////////////////////////////

/*
$(function(){

    var Quote = {
        init: function() {
          this.text   = "Patience is a virtue especially as you wait for the first quote to load."
          this.author = "David R. Taylor"
          console.log("Quote.init invoked")                    
        },
        set: function(obj) {
          this.text   = obj.text
          this.author = obj.author 
          console.log("Quote.set invoked with "+obj.text+", "+obj.author)
        },
        get: function() {
          return { 
                   text:   this.text,
                   author: this.author
                 }            
        }
    };

    var QuoteService = {
        init: function() {
           console.log("Quote_api.init invoked")
           this.quotes_url  = "http://www.stands4.com/services/v2/quotes.php"
           this.uid         = "?uid=4156"
           this.token_id    = "&tokenid=fJnvuOhrmejqNqUs"
           this.search_type = "&searchtype=RANDOM"
        },      
        get: function(callback) { //delayed therefore callback given           
           var quote = {};
           console.log("QuoteService.get invoked")
           $.ajax({
             type: "GET",
             url: this.quotes_url+this.uid+this.token_id+this.search_type,
             dataType: "xml",
             success: function(xml) {
               console.log("xml received")
               var error    = $(xml).find('error').text();
               if (error === "Daily Usage Exceeded") {
                 quote.text     = "Sorry, "+error;
                 quote.author   = "quotes.net"
               } else {
                 quote.text     = $(xml).find('quote').text();
                 quote.author   = $(xml).find('author').text();
               }               
               callback(quote); // this callback do with quote - setQuote and render             
               },
             error: function() {
               alert("The XML File could not be processed correctly.");
             }
           });            
        }      
    };

    var View = {
        init: function() {
          console.log("View.init invoked")
          this.quote = $("#quote")  // change this to View later 
          this.render(Controller.getQuote()) // change this to View later
          
          $(document).ready(function() {                      
            $('#next_quote').on('click', function() {
              if (Controller.quoteIsReady()) {
                console.log("Path A")
                View.render( Controller.getQuote() )
                Controller.getQuoteFromService(0)
                Controller.setRenderAfterPrefetch(false)
              } else {
                console.log("Path B")
                  Controller.setRenderAfterPrefetch(true) // user clicked while fetch in progress
              }
            })  
          }) // document.ready
        },      
        render: function(obj) { 
          console.log("render invoked")
          this.quote.empty();
          this.quote.append(this.template( obj ));          
        },
        // this should be private, not sure how
        template: function(obj) {
          var template = "";
          template += "<blockquote>"
          template += "<p>"+obj.text+"</p>"
          template += "<footer class='pull-right'>"+obj.author+"</footer>"
          template += "</blockquote>"
          return template
        }            
    };

    var Controller = {
        setQuote: function(quote) {
            Quote.set(quote)
            Controller.setQuoteIsReady(true)
        },
        getQuote: function() { 
          return Quote.get()   
        },
        getQuoteFromService: function(depth) { 
          console.log("recur: "+depth)
          Controller.setQuoteIsReady(false)
          QuoteService.get(function(quote) { 
            Controller.setQuote(quote)
            if ( Controller.renderAfterPrefetch() ) {
              Controller.render();
              Controller.setRenderAfterPrefetch(false)
              if (depth<1) Controller.getQuoteFromService(depth+1)
            }
          });  
       },
       setRenderAfterPrefetch: function(true_or_false) {
         this.render_after_prefetch = true_or_false
       },  
       renderAfterPrefetch: function() {
         return(this.render_after_prefetch)
       },          
       setQuoteIsReady: function(true_or_false) {
         this.quote_is_ready = true_or_false
       },
       quoteIsReady: function() {
         return(this.quote_is_ready)
       },
       render: function() {
         View.render( Quote.get() )
       },      
       init: function() {                
         Quote.init()
         Controller.setQuoteIsReady(false);
         QuoteService.init()         
         View.init()
         Controller.setRenderAfterPrefetch(true);
         Controller.getQuoteFromService(0)
       }
    };

    Controller.init();
});
*/
