"use strict"

console.log("app is up")


///////////////////////////////////////////////////////////////


$(function(){

    var Opponent = {


        init: function() {
          this.number_of_turns = 0; // keep track of which turn
          this.joker_has_center = false;
          //console.log("Opponent.init invoked")
        },

        choose_square: function() {
          //console.log("Opponent.choose_square invoked")

          function canonical_distance(sq1, sq2) {
            return Math.max(Math.abs(sq1.row-sq2.row),
                            Math.abs(sq1.column-sq2.column))
          }          
// If I could somehow use a constructor to build a new Board for each open space and then iterate through
// each board and check if_winner, then it could be really simple. like my Ruby chess game
          var possible_moves = GameController.open_squares()
          var joker_squares = GameController.joker_squares();
          var match;
          var corners;
          var sides;
          var valid_corners
          var distance_sum

          // Check all remaining open squares to see if the Joker wins
          //console.log(possible_moves)
          match = possible_moves.filter(function(elem) {
            var board_copy = GameController.clone_board()
            board_copy.mark(elem.row,elem.column,"Joker")
            return board_copy.is_winner("Joker")
          })
          if (match.length != 0) {
            //console.log("Winner Found. Pick first")
            this.number_of_turns += 1
            return {
              row:    match[0].row,
              column: match[0].column
            } 
          }
          // Check all remaining open squares to see if the Joker needs to
          // block Batman from the win
          //console.log(possible_moves)
          match = possible_moves.filter(function(elem) {
            var board_copy = GameController.clone_board()
            board_copy.mark(elem.row,elem.column,"Batman")
            return board_copy.is_winner("Batman")
          })
          if (match.length != 0) {
            //console.log("Block Found. Pick first")
            this.number_of_turns += 1
            return {
              row:    match[0].row,
              column: match[0].column
            } 
          }
          //If center is open, grab it
          if (GameController.is_square_open(1,1)) {
            //console.log("Center Square Found.")
            this.joker_has_center = true;
            this.number_of_turns += 1
            return {
              row: 1,
              column: 1
            }
          }
          
          // go on the attack, see if you can force batman's move
          // look if the next move will be 2 in a row with the next spot open
          match = possible_moves.filter(function(elem) {
          //match = [{row: 0, column: 0}].filter(function(elem) {
            var board_copy = GameController.clone_board()
            board_copy.mark(elem.row,elem.column,"Joker")
            return board_copy.has_one_move_to_win("Joker")
          })
          //console.log("Opponent: On The Attack")
          //console.log(match)
          //console.log(possible_moves)
          distance_sum = match.map(function(elem) {
            console.log("JOKER squares")
            console.log(joker_squares)
            return joker_squares
              .reduce(function(prev,cur,index,array) {
                 return prev + canonical_distance(elem,cur)
              }, 0)
            })
           console.log("Canonical matches")
           console.log(match)

          if (match.length != 0) {
            console.log("Canonical Found. Pick first. NO PICK BEST")
            console.log(distance_sum)
            // find index of largest distance_sum, use that for match
            var index = distance_sum.indexOf(Math.max.apply(Math, distance_sum))
            console.log("best index = "+index)
            this.number_of_turns += 1
            return {
              row:    match[index].row,
              column: match[index].column
            } 
          }            

// not sure if the following is needed.
// MAY WANT TO SKIP THIS
          // handle case where joker has center space and batman goes for opposite corners
          if (this.joker_has_center && this.number_of_turns === 1) {
            sides = [ {row: 0, column: 1}, {row: 1, column: 0}, 
                      {row: 1, column: 2}, {row: 2, column: 1}]
            // pick a side
            match = sides.filter(function (elem) {
              return GameController.is_square_open(elem.row,elem.column)
            })
            // there has to be one side open, so pick the first
            this.number_of_turns +=1
            return {
              row: match[0].row,
              column: match[0].column
            }
          }        
          //Else choose an available corner position
          corners = [ {row: 0, column: 0}, {row: 0, column: 2}, 
                      {row: 2, column: 0}, {row: 2, column: 2}]
          match = corners.filter(function(elem) {    
            return GameController.is_square_open(elem.row,elem.column)
          })
// lets sort the corners based on their batman_distance, higher is prefered
          distance_sum = match.map(function(elem) {
            console.log("BATMAN squares")
            console.log(batman_squares)
            return batman_squares
              .reduce(function(prev,cur,index,array) {
                 return prev + canonical_distance(elem,cur)
              }, 0)
            })
           console.log("Canonical corners")
           console.log(match)


          if (match.length != 0) {
            console.log("Corner Found. Pick first. NO PICK BEST")
            console.log(distance_sum)
            var index = distance_sum.indexOf(Math.max.apply(Math, distance_sum))
            console.log("best index = "+index)
            this.number_of_turns += 1
            return {
              row:    match[index].row,
              column: match[index].column
            } 
          }          
          //Else choose first available position
          this.number_of_turns += 1
          return {
            row:    possible_moves[0].row,
            column: possible_moves[0].column
          }
        }

    }


/* Encapsulation in JavaScript
(The Best Object Creation Pattern: Combination Constructor/Prototype Pattern)
http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
*/

//    var Board = {
    function Board(init_ary) {  // = 

      if (!init_ary) {
        this.grid = ["", "", "", "", "", "", "", "", ""] // [0] -> top_left, [8] -> bottom_right
        this.occupied_spaces = 0;
      } else {
        // allow to create a new board from input arg, may need to change argument
        this.grid = init_ary.map(function(e) { return e } )
        this.occupied_spaces = this.grid
          .filter(function(elem) {
            return elem !== ""
          }).length;
      }
      //console.log("Board constructor invoked")
      //console.log(this.grid)
      //console.log("occupied_spaces = "+this.occupied_spaces)
    }

    // setting the prototype using this literal notation requires that we explicityly
    // set the constructor. Otherwise it will get overwritten.
    Board.prototype = {
        
        constructor: Board,

        init: function() {
          this.grid = ["", "", "", "", "", "", "", "", ""] // [0] -> top_left, [8] -> bottom_right
          this.occupied_spaces = 0          
        },

        clone: function() {
          return new Board(this.grid)
        },
      
        // will return false if not possible, otherwise will return the open space        
        has_one_move_to_win: function(color) {
          var color_count;
          var open_count; // other_color_count always is 3 - color - open

          // go through all the rows and do a count
          var row;
          var col;

          var open_row
          var open_col

          //check rows
          for (row=0; row<3; row+=1) {
            color_count = 0
            open_count  = 0
            for (col=0; col<3; col+=1) {
              if (this.square_is_equal(row,col,color)) color_count += 1
              else if (this.square_is_valid(row,col)) {
                open_count += 1
                open_row    = row
                open_col    = col
              }
            }
            //console.log("row = "+row+"column = "+col+" color = "+color+"equal = "+
            //  this.is_equal(row,col,color)+"is_open = "+)
            if (color_count === 2 && open_count === 1) { 
              return { row: open_row, column: open_col}
            }
          }

          //check columns
          for (col=0; col<3; col+=1) {
            color_count = 0
            open_count  = 0
            for (row=0; row<3; row+=1) {
              if (this.square_is_equal(row,col,color)) color_count += 1
                else if (this.square_is_valid(row,col)) {
                open_count += 1
                open_row    = row
                open_col    = col
              }
            }
            if (color_count === 2 && open_count === 1) { 
              return { row: open_row, column: open_col}
            }
          }

          // check downward diagonal
          color_count = 0
          open_count  = 0
          for (row=0; row<3; row+=1) {
            col=row;
              if (this.square_is_equal(row,col,color)) color_count += 1
              else if (this.square_is_valid(row,col)) {
                open_count += 1
                open_row    = row
                open_col    = col
              }
          }
          if (color_count === 2 && open_count === 1) { 
            return { row: open_row, column: open_col}
          }

          // check upward diagonal
          color_count = 0
          open_count  = 0
          for (row=0; row<3; row+=1) {
            col=2-row;
              if (this.square_is_equal(row,col,color)) color_count += 1
              else if (this.square_is_valid(row,col)) {
                open_count += 1
                open_row    = row
                open_col    = col
              }
          }
          if (color_count === 2 && open_count === 1) { 
            return { row: open_row, column: open_col}
          }
          return false
        },

        // is_winner returns either false or else an array of the winning indices, this array is truthy
        is_winner: function(color) {
          //console.log("Board.prototype.is_winner invoked")
          var row;
          var col;
          var match;
          var indices;

          // check rows
          for (row=0; row<3; row+=1) {
            match = true;
            indices = []
            for (col=0; col<3; col+=1) {
              if (this.square_is_not_equal(row,col,color)) { match = false }
              else indices.push({row: row, column: col})
            }
            if (match) { return indices }
          }
          // check cols
          for (col=0; col<3; col+=1) {
            match = true;
            indices = []
            for (row=0; row<3; row+=1) {
              if (this.square_is_not_equal(row,col,color)) { match = false }
              else indices.push({row: row, column: col})
            }
            if (match) { return indices }
          }
          // check downward diagonal
          match = true;
          indices = []
          for (row=0; row<3; row+=1) {
            col=row;
            if (this.square_is_not_equal(row,col,color)) { match = false }
            else indices.push({row: row, column: col})
          }
          if (match) { return indices }
          // check upward diagonal
          match = true;
          indices = []
          for (row=0; row<3; row+=1) {
            col=2-row;
            if (this.square_is_not_equal(row,col,color)) { match = false }
            else indices.push({row: row, column: col})
          }
          if (match) { return indices }
          return false;
        },
        
        is_full: function() {
          if (this.occupied_spaces >= 9) { return true }
          return false;
        },
        
        mark: function(row, column, color) {
          //console.log("Board.prototype.mark invoked with "+row+", "+column+", "+color)
          if (this.square_is_valid(row, column)) {
            this.set_cell(row, column, color)
            this.occupied_spaces += 1
            return true
          }
          return false
        },
        
        square_is_valid: function(row, column) {
          return this.square_is_equal(row, column, "")
        },
        
        set_cell: function(row, column, color) {
          var index = Number(row)*3 + Number(column)
          //console.log("set_cell: index = "+index)
          this.grid[index] = color
          //console.log(this.grid)
        },
        
        get_cell: function(row, column) {
          var index = Number(row)*3 + Number(column)
          //console.log("get_cell: index = "+index)
          return this.grid[index]
        },
        
        square_is_equal: function(row, column, value) {
          return this.get_cell(row, column) === value
        },
        
        square_is_not_equal: function(row, column, value) {
          return this.get_cell(row, column) !== value
        },

        all_squares: function() {

          function index2_row_col(index) {  // DRT - now should be shared
            return {
            row:    Math.floor(index / 3),
            column: (index % 3)
            }
          }

          return [0,1,2,3,4,5,6,7,8].map(function(index) {
            return index2_row_col(index)
          })
        },

        open_squares: function() {
          return this.filter_squares("")

        },


        // provide a general mechanism for the opponent to select possible moves
        filter_squares: function(color) {
      
          var this_boards = this
          return this.all_squares().filter(function(elem) {
            return this_boards.square_is_equal(elem.row,elem.column,color)
          })

        }

    };


    var View = {
        
        init: function() {
          //console.log("View.init invoked")
          this.is_first_time = true
          this.reset()

        },

        reset: function() {

          var template = function(row,column) {
            var html_template = ""
            html_template += "<div id='r"+row+"_c"+column+"' class='square'>"
            html_template += "  <div class='content'>"
            html_template += "  </div>"
            html_template += "</div>"
            return html_template
          }
          // Note that the order of the following code is important, building the DOM must happen
          // prior to setting up the click handler. I believe there is another way to accomplish this.
          var game_board = $('#game_board');
          game_board.empty()
          GameController.all_squares().forEach(function(elem) {
            game_board.append(template(elem.row,elem.column))
          })
          //console.log("game_board")          
          //console.log(game_board)
          $(document).ready(function() {                            
            $('.square').off('click').on('click', function() {
              // id_row and col could be extracted from jQuery object 'this' downstream, but i think this is a view concern  
              var id_row = this.id.substring(1,2) // r0_c0
              var id_col = this.id.substring(4,5) // 01234       
              console.log("CLICK")
              console.log(GameController.is_humans_turn())
              if (GameController.is_humans_turn()) {
                GameController.mark(this,id_row,id_col)
              }
            })                     
          }) // document.ready 

          if (this.is_first_time) { alert("Batman goes first!!") }
          this.is_first_time = false
        },  

        select_square: function(row, column) {
          return $("#r"+row+"_c"+column)
        },

        render_square: function(e,attr,image) { 
          //console.log("render invoked")         

          // if image is not given, then an empty square will be returned and that is ok
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

          // Array.prototype.indexOf does not work with objects so we use this deep indexOf
          // http://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array
          function arrayObjIndexOf(ary, elem) {
            for(var i = 0, len = ary.length; i < len; i++) {
              if (ary[i].row === elem.row && ary[i].column === elem.column) return i;
            }
            return -1;
           }
          // render winner squares by fading others
          GameController.all_squares()
            .filter(function(elem) {
              return arrayObjIndexOf(winner_ary,elem) === -1
            })
            .forEach( function(elem) {
              $("#r"+elem.row+"_c"+elem.column+" div").addClass("fade")
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
         // not sure if image and attr should be inside of game. more of a view thing unless it 
         // can be changed, ie selected by the user
         /*
         this.images = ["https://d13yacurqjgara.cloudfront.net/users/121576/screenshots/1111290/batman_logo_final.png", 
                        "https://s-media-cache-ak0.pinimg.com/236x/aa/6e/8d/aa6e8d0ba1ee3a0fea3df7c7d5b00f6b.jpg"]
         this.attr   = ["class='circle'", ""] // batman is a circle, jocker is a square
         */
         
         this.images = ["images/batman_logo_final.png", "images/aa6e8d0ba1ee3a0fea3df7c7d5b00f6b.jpg"]
         this.attr   = ["class='circle'", ""] // batman is a circle, jocker is a square
         
         this.current_player_index = 0
       }


    };

    var GameController = {
      
      // note board refees to the main board instance
      all_squares: function() {
        return board.all_squares()
      },

      mark: function(e, row, column) {
        //console.log("GameController.mark invoked")
        var current_player = Game.current_player()
        var player_wins = false
        var draw        = false
        var winner
        var joker
        var joker_move

        if (board.mark(row, column, current_player) ) {
          View.render_square(e, Game.current_attr(), Game.current_image())
          winner = board.is_winner(current_player)
          if (winner) {
            //console.log(winner)
            player_wins = true;
            View.render_winner(winner)
            alert(current_player+" wins. Click OK to begin a new game.")
          } else if (board.is_full()) {
              draw = true
              alert("The game is a draw. Click OK to begin a new game")
          } else {
              Game.next_player()
          }
          if (player_wins || draw) {
            Game.init()
            board.init()
            Opponent.init()
            View.reset()
          } else {
          // check for 1 player game and if so then AI's moves
            setTimeout( function() { 
              if (!this.is_a_two_player_game) {
                joker_move = Opponent.choose_square()
                console.log(joker_move)
                current_player = Game.current_player()
                board.mark(joker_move.row, joker_move.column, current_player)
                View.render_square(
                  View.select_square(joker_move.row,joker_move.column),
                  Game.current_attr(),
                  Game.current_image()
                )
                winner = board.is_winner(current_player)
                if (winner) {
                  player_wins = true
                  View.render_winner(winner)
                  alert(current_player+" wins. Click OK to begin a new game.")
                } else if (board.is_full()) { // not possible since human has last move
                  draw = true
                  alert("The game is a draw. Click OK to begin a new game")
                } else {
                  Game.next_player()
                }
                if (player_wins || draw) {
                  Game.init()
                  board.init()
                  Opponent.init()
                  View.reset()
                }
              } // if not this.is_a_...
            }
            ,1000) // setTimeout            
          } // else
        } // if board.mark

      },

      // make alert into View.game_over(game_is_won,player)

      // need View.select_square(row,column) => returns jQuery object
      // actually I can change render_square to now only accept the row and column
      // and not use the jQuery object any more but first lets implement select_square


      // need check winner routine

      open_squares: function() { 
        return board.open_squares() 
      },
      
      is_square_open: function(row, column) {
        return board.square_is_valid(row, column) // is_Valid should be changed to is_open
      },

      is_humans_turn: function() {
        if (this.is_a_two_player_game) {
          return true
        } else {
          return Game.current_player() === 'Batman'
        }
      },

      clone_board: function() {
        return board.clone()
      },

      joker_squares: function() {
        return board.filter_squares("Joker")
      },

      init: function() { 
        Game.init()        
        board = new Board()
        Opponent.init()
        View.init()
        this.is_a_two_player_game = false // change to false for AI
      }
    };

    var board; // this is needed else an error is generated from board = new Board() above, why?
    GameController.init();
});
