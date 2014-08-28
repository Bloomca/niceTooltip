$(function(){
   $('#nice1').niceTooltip({
       HTML: "Plain text."
   });
    $('#nice2').niceTooltip({
        HTML: "You can put here any HTML you like.",
        position: {
            horizontal: "left",
            vertical: "bottom"
        }
    });
    $('#nice3').niceTooltip({
        HTML: "Any of position is available.",
        position: {
            horizontal: "center",
            vertical: "bottom"
        }
    });
    $('#nice4').niceTooltip({
        HTML: "Fixed position!",
        position: {
            horizontal: "center",
            vertical: "top"
        },
        disableMove: true
    });

});