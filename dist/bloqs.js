(function(root, undefined) {

  "use strict";


  var data = {};

  data.VERSION = '0.0.0';

  data.createField = function(){
    return true;
  };

  data.createBlock = function(){

  };

  // Base function.
  var bloqs = function() {



    return data;
  };


  // Export to the root, which is probably `window`.
  root.bloqs = bloqs;
}(this));
