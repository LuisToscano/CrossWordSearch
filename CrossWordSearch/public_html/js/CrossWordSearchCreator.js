/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function createCrossword(jsonURL, container) {


//var resps = container.prop("asdas");
    var ansArray = [];
    var matrixLetras = [];

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
            }

            $.each(data.words, function (key, val) {
                if (val.starting_x !== null && $.isNumeric(val.starting_x) && val.starting_x >= 0 &&
                        val.starting_y !== null && $.isNumeric(val.starting_y) && val.starting_y >= 0) {

                    if (val.direction !== null && val.word !== null) {

                        var maxWidth = data.width - 1;
                        var maxHeight = data.height - 1;
                        switch (val.direction) {
                            case "horizontal":
                            {
                                var ejex = val.starting_x;
                                if (ejex > maxWidth) {
                                    ejex = maxWidth;
                                }

                                var inicio = val.starting_y;

                                if (inicio > maxHeight) {
                                    inicio = maxHeight;
                                }
                                var final = inicio - 1 + val.word.length;
                                if (final > maxHeight) {
                                    final = maxHeight;
                                }

                                var finalWord = val.word.substring(0, final - inicio + 1);

                                var respObj = {"word": "", "letters": ""};
                                respObj.word = finalWord;

                                var letras = [];
                                var contLetras = 0;
                                for (var i = inicio; i <= final; i++) {
                                    
                                    if ($("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "] input", container).length === 0) {
                                        var inputObjContainer = jQuery('<div/>', {'class': 'inputContainer'});
                                        var inputObj = jQuery('<input/>', {'type': 'text', 'maxlength': 1});
                                        inputObjContainer.append(inputObj);
                                        
                                        $("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "]", container).addClass("active");
                                        $("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "]", container).append(inputObjContainer);
                                        typeof matrixLetras[ejex] === "undefined" ? matrixLetras[ejex] = [] : false;
                                        matrixLetras[ejex][i] = finalWord.charAt(contLetras);
                                    }
                                    else
                                    {
                                        if (matrixLetras[ejex][i] != finalWord.charAt(contLetras)) {
                                            $("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "]", container).removeClass("active");
                                            $("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "]", container).addClass("error");
                                        }
                                    }
                                    
                                    if(i===inicio)
                                    {
                                        var tagContainer = jQuery('<div/>', {'class': 'inputContainer'});
                                        var tagObj = jQuery('<div class="horizontalTag">'+key+'</div>', {});
                                        tagContainer.append(tagObj);
                                        
                                        $("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "]", container).append(tagContainer);
                                    }
                                    
                                    var letrasObj = {"x": "", "y": ""};
                                    letrasObj.x = ejex;
                                    letrasObj.y = i;
                                    letras.push(letrasObj);
                                    contLetras++;
                                }

                                respObj.letters = letras;
                                ansArray.push(respObj);
                                break;
                            }

                            case "vertical":
                            {
                                var ejey = val.starting_y;
                                if (ejey > maxHeight) {
                                    ejey = maxHeight;
                                }

                                var inicio = val.starting_x;

                                if (inicio > maxWidth) {
                                    inicio = maxWidth;
                                }

                                var final = inicio - 1 + val.word.length;
                                if (final > maxWidth) {
                                    final = maxWidth;
                                }

                                var finalWord = val.word.substring(0, final - inicio + 1);

                                var respObj = {"word": "", "letters": ""};
                                respObj.word = finalWord;

                                var letras = [];
                                for (var i = inicio; i <= final; i++) {
                                    
                                    if ($("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "] input", container).length === 0) {
                                        
                                        var inputObjContainer = jQuery('<div/>', {'class': 'inputContainer'});
                                        var inputObj = jQuery('<input/>', {'type': 'text', 'maxlength': 1});
                                        inputObjContainer.append(inputObj);
                                        
                                        $("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "]", container).addClass("active");
                                        $("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "]", container).append(inputObjContainer);
                                        typeof matrixLetras[i] === "undefined" ? matrixLetras[i] = [] : false;
                                        matrixLetras[i][ejey] = finalWord.charAt(contLetras);
                                    }
                                    else
                                    {
                                        if (matrixLetras[i][ejey] != finalWord.charAt(contLetras)) {
                                            $("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "]", container).addClass("error");
                                        }
                                    }
                                    
                                    if(i===inicio)
                                    {
                                        var tagContainer = jQuery('<div/>', {'class': 'inputContainer'});
                                        var tagObj = jQuery('<div class="verticalTag">'+key+'</div>', {});
                                        tagContainer.append(tagObj);
                                        
                                        $("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "]", container).append(tagContainer);
                                    }
                                    
                                    var letrasObj = {"x": "", "y": ""};
                                    letrasObj.x = i;
                                    letrasObj.y = ejey;
                                    letras.push(letrasObj);
                                    contLetras++;
                                }

                                respObj.letters = letras;
                                ansArray.push(respObj);

                                break;
                            }
                        }
                    }
                }
            });

            container.prop("answers", ansArray);
            editSizes(data.width, data.height, container);
        }
    });
}

/*******************************************************************************************/

function checkAnswers(container) {

    var ans = container.prop("answers");
    var correct = true;
    for (var i = 0; i < ans.length; i++)
    {
        var resp = ans[i];
        var strAns = "";

        var contLetras = 0;
        $.each(resp.letters, function (key, val) {
            if ($("[crossWrapperX=" + val.x + "][crossWrapperY=" + val.y + "] input", container).length !== 0)
            {
                strAns += $("[crossWrapperX=" + val.x + "][crossWrapperY=" + val.y + "] input", container).val();
                var letra = $("[crossWrapperX=" + val.x + "][crossWrapperY=" + val.y + "] input", container).val();
            }
            contLetras++;
        });

        if (strAns !== resp.word) {
            correct = false;
        }
    }
    if (correct) {
        alert("correcto");
    }
    else {
        alert("incorrecto");
    }
}

/*******************************************************************************************/

function editSizes(width, height, obj) {
    var newHeight = Math.floor(100 / height);
    $(".crossRow").css("height", newHeight + "%");

    var newWidth = Math.floor(100 / width);
    $(".crossCell").css("width", newWidth + "%");
}
/*******************************************************************************************/

function existsAndis(value, obj) {

    return obj !== null && obj === value;
}

/*****************
 
 return obj !== null && obj === value;
 }**************************************************************************/

