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
          var row;
          var col;
          var match;
          // check rows
          for (row=0; row<3; row+=1) {
            match = true;
            for (col=0; col<3; col+=1) {
              if (this.is_not_equal(row*3+col,color)) { match = false }
            }
            if (match) { return true }
          }
          // check cols
          for (col=0; col<3; col+=1) {
            match = true;
            for (row=0; row<3; row+=1) {
              if (this.is_not_equal(row*3+col,color)) { match = false }
            }
            if (match) { return true }
          }
          // check downward diagonal
          match = true;
          for (row=0; row<3; row+=1) {
            col=row;
            if (this.is_not_equal(row*3+col,color)) { match = false }
          }
          if (match) { return true }
          // check upward diagonal
          match = true;
          for (row=0; row<3; row+=1) {
            col=2-row;
            if (this.is_not_equal(row*3+col,color)) { match = false }
          }
          if (match) { return true }    
          return false;
        },
        is_full: function() {
          if (this.occupied_spaces >= 9) { return true }
          return false;
        },
        mark: function(index, color) {
          console.log("Board.mark invoked with "+index+", "+color)
          console.log(this.board);
          if (this.is_valid(index)) {
            this.set_cell(index, color)
            this.occupied_spaces += 1
            return true
          }
          return false
        },
        is_valid: function(index) {
          return this.is_equal(index,"")
        },
        set_cell: function(index,color) {
          this.board[index] = color
          console.log(this.board)
        },
        get_cell: function(index) {
          return this.board[index]
        },
        is_equal: function(index,value) {
          return this.get_cell(index) === value
        },
        is_not_equal: function(index,value) {
          return !this.is_equal(index,value)
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
            // .off().on() was required to fix double event problem
            $('.square').off('click').on('click', function() {

              var id_index = this.id.substring(1,2)
              // call GameController.mark with this and id_index
              // id_index could be extracted from this, but i think this is a view concern
              //View.renderSquare(this)              
              GameController.mark(this,id_index)

            }) 
            alert("Batman goes first!!")
            console.log("ALERT")
          }) // document.ready
        },
        clear: function() {
          var grids = $('.square');
          console.log("grids")
          console.log(grids) // this shouldnt be called for just one click event
        },      
        render_square: function(e,attr,image) { 
          console.log("render invoked")              
          $(e).empty(); // referring to the jQuery this object
          $(e).append(View.template(attr,image));
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
         //Controller.setRenderAfterPrefetch(true);
         //Controller.getQuoteFromService(0)
       }
    };

    var GameController = {
      mark: function(e, index) {
        console.log("GameController.mark invoked")
        var current_player = Game.current_player()
        var player_wins = false
        var draw        = false
        if (Board.mark(index, current_player) ) {
          View.render_square(e, Game.current_attr(), Game.current_image())
          if (Board.is_winner(current_player)) {
            console.log(current_player+" wins")
            player_wins = true;
            // alert message
          } else if (Board.is_full()) {
              console.log("Draw")
              draw = true
              // alert message
          } else {
              Game.next_player()
          }
          if (player_wins || draw) {
            GameController.init()
            View.clear()
          }
          console.log("Here")
        }
      },
      init: function() { 
        Game.init()
        Board.init()
        View.init()
      }
    };

    GameController.init();
});
