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
                                    
                                    if(i===inicio)
                                    {
                                        $("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "]", container).attr("horizontalTag", key);
                                    }
                                    
                                    if ($("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "] input", container).length === 0) {
                                        var inputObj = jQuery('<input/>', {'type': 'text', 'maxlength': 1});
                                        $("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "]", container).addClass("active");
                                        $("[crossWrapperX=" + ejex + "][crossWrapperY=" + i + "]", container).append(inputObj);
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
                                    
                                    if(i===inicio)
                                    {
                                        $("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "]", container).attr("verticalTag", key);
                                    }
                                    
                                    if ($("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "] input", container).length === 0) {
                                        var inputObj = jQuery('<input/>', {'type': 'text', 'maxlength': 1});
                                        $("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "]", container).addClass("active");
                                        $("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "]", container).append(inputObj);
                                        typeof matrixLetras[i] === "undefined" ? matrixLetras[i] = [] : false;
                                        matrixLetras[i][ejey] = finalWord.charAt(contLetras);
                                    }
                                    else
                                    {
                                        if (matrixLetras[i][ejey] != finalWord.charAt(contLetras)) {
                                            $("[crossWrapperX=" + i + "][crossWrapperY=" + ejey + "]", container).addClass("error");
                                        }
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
            editTags();
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
                var answer_container = jQuery('<div/>', {'class': "answer_container"});
                var right_answer_container = jQuery('<div/>', {'class': "right_answer_container"});
                var wrong_answer_container = jQuery('<div/>', {'class': "wrong_answer_container"});
                var right_answer = jQuery('<span class="right_answer">' + resp.word.charAt(contLetras).toUpperCase() + '</span>', {});
                var wrong_answer;
                if (letra !== resp.word.charAt(contLetras)) {
                    wrong_answer = jQuery('<span class="wrong_answer">' + letra.toUpperCase() + '</span>', {});
                }
                right_answer_container.append(right_answer);
                if (wrong_answer !== null) {
                    wrong_answer_container.append(wrong_answer);
                }
                answer_container.append(right_answer_container);
                answer_container.append(wrong_answer_container);
                $("[crossWrapperX=" + val.x + "][crossWrapperY=" + val.y + "]", container).html(answer_container);
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

function editTags() {
  $.each($("div [horizontalTag]"),function(key, val){
      val = $(val);
      val.css("display","flex");
      val.css("flex-direction","row-reverse");
      var tag = jQuery('<div/>', {'class': "horizontalTag"});
      tag.html(val.attr("horizontalTag"));
      $("input", val).css("width","70%");
      $("input", val).css("margin-right","15%");
      val.append(tag);
  });
  
  $.each($("div [verticalTag]"),function(key, val2){
      val2 = $(val2);
      val2.css("display","flex");
      val2.css("flex-direction","column-reverse");
      var tag2 = jQuery('<div/>', {'class': "verticalTag"});
      tag2.html(val2.attr("verticalTag"));
      $("input", val2).css("height","70%");
      $("input", val2).css("margin-bottom","15%");
      val2.append(tag2);
  });
}

/*******************************************************************************************/

function existsAndis(value, obj) {

    return obj !== null && obj === value;
}

/*****************
 
 return obj !== null && obj === value;
 }**************************************************************************/

