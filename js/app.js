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

          //var offset = function(row, col) { return row*3+col }  

          // check rows
          for (row=0; row<3; row+=1) {
            match = true;
            indices = []
            for (col=0; col<3; col+=1) {
              //index = offset(row,col)
              if (this.is_not_equal(row,col,color)) { match = false }
              else indices.push({row: row, column: col})
            }
            if (match) { return indices } //true }
          }
          // check cols
          for (col=0; col<3; col+=1) {
            match = true;
            indices = []
            for (row=0; row<3; row+=1) {
              //index = offset(row,col)
              if (this.is_not_equal(row,col,color)) { match = false }
              else indices.push({row: row, column: col})
            }
            if (match) { return indices } //true }
          }
          // check downward diagonal
          match = true;
          indices = []
          for (row=0; row<3; row+=1) {
            col=row;
            //index = offset(row,col)
            if (this.is_not_equal(row,col,color)) { match = false }
            else indices.push({row: row, column: col})
          }
          if (match) { return indices } //true }
          // check upward diagonal
          match = true;
          indices = []
          for (row=0; row<3; row+=1) {
            col=2-row;
            //index = offset(row,col)
            if (this.is_not_equal(row,col,color)) { match = false }
            else indices.push({row: row, column: col})
          }
          if (match) { return indices } //true }    
          return false;
        },
        
        is_full: function() {
          if (this.occupied_spaces >= 9) { return true }
          return false;
        },
        
        mark: function(row, column, color) {
          console.log("Board.mark invoked with "+row+", "+column+", "+color)
          console.log(this.board);
          //if (this.is_valid(index)) {
          if (this.is_valid(row, column)) {
            //this.set_cell(index, color)
            console.log("this.is_valid")
            this.set_cell(row, column, color)
            this.occupied_spaces += 1
            return true
          }
          return false
        },
        
        is_valid: function(row, column) {
          return this.is_equal(row, column, "")
        },
        
        //
        set_cell: function(row, column, color) {
          var index = Number(row)*3 + Number(column)
          console.log("set_cell: index = "+index)
          this.board[index] = color
          console.log(this.board)
        },
        
        get_cell: function(row, column) {
          var index = Number(row)*3 + Number(column)
          console.log("get_cell: index = "+index)
          return this.board[index]
        },
        
        is_equal: function(row, column, value) {
          return this.get_cell(row, column) === value
        },
        
        is_not_equal: function(row, column, value) {
          return this.get_cell(row, column) !== value
        },

        index2_row_col: function(index) {   // should this be private inside all_squares
          return {
            row:    Math.floor(index / 3),
            column: (index % 3)
          }
        },

        all_squares: function() {

// private function DRT
          return [0,1,2,3,4,5,6,7,8].map(function(index) {
            return Board.index2_row_col(index)
          })
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

          var template = function(row,column) { //row,column) {
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
          //this.forEach_square(function (elem) {
            game_board.append(template(elem.row,elem.column))
          })
          console.log("game_board")          
          console.log(game_board)
          $(document).ready(function() {                            
            $('.square').off('click').on('click', function() {
              // id_row and col could be extracted from jQuery object 'this' downstream, but i think this is a view concern  
              var id_row = this.id.substring(1,2) // r0_c0
              var id_col = this.id.substring(4,5) // 01234       
              //var id_index = this.id.substring(1,2)        
              GameController.mark(this,id_row,id_col)
            })                     
          }) // document.ready 

          if (this.is_first_time) { alert("Batman goes first!!") }
            console.log("this is first time = "+this.is_first_time)  
            this.is_first_time = false
            console.log("this is first time = "+this.is_first_time)

          //console.log("DRT 9/27/15")
          //console.log(GameController.all_squares())
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

          // Array.prototype.indexOf does not work with objects so we use this deep indexOf
          //http://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array
          function arrayObjIndexOf(ary, elem) {
            for(var i = 0, len = ary.length; i < len; i++) {
              if (ary[i].row === elem.row && ary[i].column === elem.column) return i;
            }
            return -1;
           }

          // render winner squares by fading others
          x = GameController.all_squares().filter(function(elem) {
            console.log(elem)
            return arrayObjIndexOf(winner_ary,elem) === -1
          })
          console.log("DRT 9.27.15")
          console.log(x)
          x.forEach( function(elem) {
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
         // not sure if I should be storing image and attr inside of game. more of a view thing unless it 
         // can be changed, selected by the user
         this.images = ["images/batman_logo_final.png", "images/aa6e8d0ba1ee3a0fea3df7c7d5b00f6b.jpg"]
         this.attr   = ["class='circle'", ""] // batman is a circle, jocker is a square
         this.current_player_index = 0
         Board.init()
       }
    };

    var GameController = {
      
      all_squares: function() {
        return Board.all_squares()
      },

      //mark: function(e, index) {
      mark: function(e, row, column) {
        console.log("GameController.mark invoked")
        var current_player = Game.current_player()
        var player_wins = false
        var draw        = false
        var winner
        //if (Board.mark(index, current_player) ) {
        if (Board.mark(row, column, current_player) ) {
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
