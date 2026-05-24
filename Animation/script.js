$(document).ready(function(){

$("#start").click(function(){

let w = $(window).width() - 100;
let h = $(window).height() - 100;

$(".box").animate(
    { left: w }, 
    1000,
    function(){
        $(this).css("background","blue");

        $(this).animate(
            { top: h },
            1000,
            function(){
                $(this).css("background","green");

                $(this).animate(
                    { left: 0 },
                    1000,
                    function(){
                        $(this).css("background","orange");

                        $(this).animate(
                            { top: 0 },
                            1000,
                            function(){
                                $(this).css("background","red");
                            }
                        );

                    }
                );

            }
        );

    }
);

});

});