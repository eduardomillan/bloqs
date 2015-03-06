(function(root, undefined) {

  "use strict";

  var data = {};
  // Base function.
  var field = function() {



    return data;
  };


  // Export to the root, which is probably `window`.
  root.field = field;
}(this));
