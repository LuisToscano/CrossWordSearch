/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function createCrossword(jsonURL, container) {

container.prop("asdas",{});
var resps = container.prop("asdas");

    $.getJSON(jsonURL, function (data) {

        if (data.width !== null && data.width > 0 && data.height !== null && data.height > 0) {
            var wrapper = jQuery('<div/>', {'class': "crossWrapper"});
            container.append(wrapper);
            for (var i = 0; i < data.height; i++) {
                var row = jQuery('<div/>', {'class': "crossRow"});
                wrapper.append(row);
                for (var j = 0; j < data.width; j++) {
                    var cell = jQuery('<div/>', {'crossWrapperX': i, 'crossWrapperY': j, 'class': "crossCell"});
                    row.append(cell);
                }

                $.each(data.words, function (key, val) {
                    if (val.starting_x !== null && $.isNumeric(val.starting_x) && val.starting_x>=0 &&
                        val.starting_y !== null && $.isNumeric(val.starting_y) && val.starting_y>=0) {

                            if (val.direction !== null && val.word !== null) {

                                var maxWidth = data.width - 1;
                                var maxHeight = data.height - 1;
                                switch (val.direction) {
                                    case "up":
                                    {
                                     
                                      var ejex = val.starting_x;
                                      if(ejex > maxWidth){
                                          ejex = maxWidth;
                                      }
                                        
                                      var inicio = val.starting_y;
                                      if(inicio > maxHeight){
                                          inicio = maxHeight;
                                      }
                                      
                                      var final =  inicio - val.word.length;
                                      if(final<0){
                                          final = 0;
                                      }
                                      
                                      for(var i = inicio; i>=final; i--){
                                         $("[crossWrapperX="+ejex+"][crossWrapperY="+i+"]", container);
                                      }
                                    }
                                }
                            }

                            var input = jQuery('<input/>', {'crossInput': start_point[0] + "_" + j, 'type': "text", 'maxlength': "1"});
                    }
                });
            }
        }
    });

}

/*******************************************************************************************/

function existsAndis(value, obj) {

    return obj !== null && obj === value;
}

