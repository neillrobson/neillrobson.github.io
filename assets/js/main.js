$(document).ready(function () {

    /* ======= Sliding menu underline ====== */
    // Menu has active item
    //Ref: https://codepen.io/digistate/pen/OXXjXM

    $nav = $("#navigation"),
        $slideLine = $("#slide-line"),
        $currentItem = $("#navigation li.active");

    function refresh() {
        if ($currentItem[0]) {
            $slideLine.css({
                "width": $currentItem.width(),
                "left": $currentItem.position().left
            });
        } else {
            // Disapear
            $slideLine.width(0);
        }
    }

    refresh();

    $(window).on('resize load', refresh);

    // Underline transition
    $nav.find("li").hover(
        // Hover on
        function () {
            $slideLine.css({
                "width": $(this).width(),
                "left": $(this).position().left
            });
        },
        // Hover out
        refresh
    );


});