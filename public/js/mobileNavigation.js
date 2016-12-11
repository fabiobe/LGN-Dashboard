/**
 * Created by fabio on 20.11.2016.
 */
$('.navigation').click(() => {

    openNav();

});

function openNav() {
    document.getElementById("navigation-mobile").style.height = "100%";
}

function closeNav() {
    document.getElementById("navigation-mobile").style.height = "0%";
}