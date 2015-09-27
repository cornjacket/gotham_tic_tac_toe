console.log("app is up")


///////////////////////////////////////////////////////////////


$(function(){

    var Board = {
        
        init: function() {
          this.board           = ["", "", "", "", "", "", "", "", ""] // [0] -> top_left, [8] -> bottom_right
          this.occupied_spaces = 0
          console.log("Board.init invoked")                    
        },
        // have is_winner return either false or else an array of the winning indices, this array is truthy
        
        is_winner: function(color) {
          console.log("Board.is_winner invoked")
          var row;
          var col;
          var match;
          var indices;

          var offset = function(row, col) { return row*3+col }  

          // check rows
          for (row=0; row<3; row+=1) {
            match = true;
            indices = []
            for (col=0; col<3; col+=1) {
              index = offset(row,col)
              if (this.is_not_equal(index,color)) { match = false }
              else indices.push(index)
            }
            if (match) { return indices } //true }
          }
          // check cols
          for (col=0; col<3; col+=1) {
            match = true;
            indices = []
            for (row=0; row<3; row+=1) {
              index = offset(row,col)
              if (this.is_not_equal(index,color)) { match = false }
              else indices.push(index)
            }
            if (match) { return indices } //true }
          }
          // check downward diagonal
          match = true;
          indices = [0, 4, 8]
          for (row=0; row<3; row+=1) {
            col=row;
            index = offset(row,col)
            if (this.is_not_equal(index,color)) { match = false }
          }
          if (match) { return indices } //true }
          // check upward diagonal
          match = true;
          indices = [ 6, 4, 2]
          for (row=0; row<3; row+=1) {
            col=2-row;
            index = offset(row,col)
            if (this.is_not_equal(index,color)) { match = false }
          }
          if (match) { return indices } //true }    
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
          return this.get_cell(index) !== value
        }      
    };


    var View = {
        
        init: function() {
          console.log("View.init invoked")
          this.is_first_time = true
          this.reset()

        },

        // each number represents a unique id in index.html which corresponds to each square
        forEach_square: function(callback) {
          [0,1,2,3,4,5,6,7,8].forEach( function(elem) {
            callback(elem)
          })
        },

        reset: function() {

          var template = function(index) {
            var html_template = ""
            html_template += "<div id='e"+index+"' class='square'>"
            html_template += "  <div class='content'>"
            html_template += "  </div>"
            html_template += "</div>"
            return html_template
          }

          // Note that the order of the following code is important, building the DOM must happen
          // prior to setting up the click handler. I believe there is another way to accomplish this.
          var game_board = $('#game_board');
          game_board.empty()
          this.forEach_square(function (elem) {
            game_board.append(template(elem))
          })
          console.log("game_board")          
          console.log(game_board)
          $(document).ready(function() {                            
            $('.square').off('click').on('click', function() {
              // id_index could be extracted from jQuery object 'this' downstream, but i think this is a view concern  
              var id_index = this.id.substring(1,2)        
              GameController.mark(this,id_index)
            })                     
          }) // document.ready 

          if (this.is_first_time) { alert("Batman goes first!!") }
            console.log("this is first time = "+this.is_first_time)  
            this.is_first_time = false
            console.log("this is first time = "+this.is_first_time)
        },  

        render_square: function(e,attr,image) { 
          console.log("render invoked")         

          // if image is not given, then an empty square will be returned
          var template = function(attr,image) {
            var html_template = "";
            html_template += "<div class='content'>"
            if (image) { html_template +=   "<img "+attr+" src='"+image+"'>" }
            html_template += "</div>"
            return html_template
          }           
          
          $(e).empty(); // referring to the jQuery this object
          $(e).append(template(attr,image));
        },

        render_winner: function(winner_ary) {
          // render winner indices by fading others
          this.forEach_square( function(elem) {
            if(winner_ary.indexOf(elem) === -1) {
              $("#e"+elem+" div").addClass("fade")
          }
          })
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
         this.pieces = ["Batman", "Joker"] // Batman, Joker
         // not sure if I should be storing image and attr inside of game. more of a view thing unless it 
         // can be changed, selected by the user
         this.images = ["images/batman_logo_final.png", "images/aa6e8d0ba1ee3a0fea3df7c7d5b00f6b.jpg"]
         this.attr   = ["class='circle'", ""] // batman is a circle, jocker is a square
         this.current_player_index = 0
         Board.init()
       }
    };

    var GameController = {
      
      mark: function(e, index) {
        console.log("GameController.mark invoked")
        var current_player = Game.current_player()
        var player_wins = false
        var draw        = false
        var winner
        if (Board.mark(index, current_player) ) {
          View.render_square(e, Game.current_attr(), Game.current_image())
          winner = Board.is_winner(current_player)
          if (winner) {
            console.log(current_player+" wins")
            console.log(winner)
            player_wins = true;
            View.render_winner(winner)
            alert(current_player+" wins. Click OK to begin a new game.")
          } else if (Board.is_full()) {
              console.log("Draw")
              draw = true
              alert("The game is a draw. Click OK to begin a new game")
          } else {
              Game.next_player()
          }
          if (player_wins || draw) {
            Game.init()
            Board.init()
            View.reset()
            //GameController.init()            
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
