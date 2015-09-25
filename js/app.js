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


$(function(){

    var Board = {
        init: function() {
          this.board           = ["", "", "", "", "", "", "", "", ""] // [0] -> top_left, [8] -> bottom_right
          this.occupied_spaces = 0
          console.log("Board.init invoked")                    
        },
        is_winner: function(color) {
          console.log("Board.is_winner invoked")
          return false; // testing
        },
        mark: function(index, color) {
          console.log("Board.mark invoked with "+index+", "+color)
          if (this.is_valid(index,color)) {
            this.set_cell(index, color)
            this.occupied_spaces += 1
            return true
          }
          return false
        },
        is_valid: function(index,color) {
          return this.is_cell(index,"")
        },
        set_cell: function(index,color) {
          this.board[index] = color
        },
        get_cell: function(index) {
          return this.board[index]
        },
        is_cell: function(index,value) {
          return this.get_cell(index) === value
        }
    };


    var View = {
        init: function() {
          console.log("View.init invoked")
          //this.quote = $("#quote")  // change this to View later 
          //this.render(Controller.getQuote()) // change this to View later
          
          $(document).ready(function() {                      
           /* $('#next_quote').on('click', function() {
              if (Controller.quoteIsReady()) {
                console.log("Path A")
                View.render( Controller.getQuote() )
                Controller.getQuoteFromService(0)
                Controller.setRenderAfterPrefetch(false)
              } else {
                console.log("Path B")
                  Controller.setRenderAfterPrefetch(true) // user clicked while fetch in progress
              }
            }) */
            $('.square').on('click', function() {

              var id_index = this.id.substring(1,2)
              // call GameController.mark with this and id_index
              // id_index could be extracted from this, but i think this is a view concern
              //View.renderSquare(this)              
              GameController.mark(this,id_index)

            }) 
          }) // document.ready
        },
        clear: function() {
          var grids = $('.square');
          console.log("grids")
          console.log(grids)
        },      
        renderSquare: function(e,attr,image) { 
          console.log("render invoked")
          var test = ['a', 'b', 'c', 'd']
              
          $(e).empty(); // referring to the jQuery this object
          console.log("DRT here")
          $(e).append(View.template(attr,image));
          var id_index = e.id.substring(1,2) // just for testing
          console.log( e.id );
          console.log(test[id_index%test.length]) // testing        
        },
        // this should be private, not sure how
        // if image is not given, then it will be an empty square returned
        template: function(attr,image) {
          var template = "";
          template += "<div class='content'>"
          if (image) { template +=   "<img "+attr+" src='"+image+"'>" }
          template += "</div>"
          console.log(template)
          return template
        }            
    };

    var Game = {
       current_player: function() {
          return this.pieces[this.current_player_index]
        },
       current_image: function() {
          return this.images[this.current_player_index]
       },
       current_attr: function() {
          return this.attr[this.current_player_index]
       },
       next_player: function() {
         this.current_player_index = (this.current_player_index + 1) % 2
       },      
       init: function() { 
         this.pieces = ["B", "J"] // Batman, Joker
         // not sure if I should be storing image and attr inside of game. more of a view thing unless it 
         // can be changed, selected by the user
         this.images = ["images/batman_logo_final.png", "images/aa6e8d0ba1ee3a0fea3df7c7d5b00f6b.jpg"]
         this.attr   = ["class='circle'", ""] // batman is a circle, jocker is a square
         this.current_player_index = 0
         Board.init()
         //Controller.setQuoteIsReady(false);
         //QuoteService.init()         
         View.init()
         //Controller.setRenderAfterPrefetch(true);
         //Controller.getQuoteFromService(0)
       }
    };

    var GameController = {
        mark: function(e, index) {
          if (Board.mark(index, Game.current_player())) {
            View.renderSquare(e, Game.current_attr(), Game.current_image())
            Game.next_player()
            // Checkforwinner()
            console.log("Here")
          }
          else {   // WHY IS THIS BEING CALLED??????????????????
            console.log("Not here")
            View.clear()
          }
        },
       /*render: function() {
         View.render( Quote.get() )
       },*/      
       init: function() { 
         Game.init()
         Board.init()
         //Controller.setQuoteIsReady(false);
         //QuoteService.init()         
         View.init()
         //Controller.setRenderAfterPrefetch(true);
         //Controller.getQuoteFromService(0)
       }
    };

    GameController.init();
});
