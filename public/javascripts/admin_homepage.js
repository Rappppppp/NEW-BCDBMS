var navbar_container = document.getElementById("top-navbar")
var sidebar_container = document.getElementById("sidebar")
var content_container = document.getElementById("content")
var footer_container = document.getElementById("page-footer")

var sidebar_icons = document.getElementsByClassName("sb-icon")
var sidebar_labels = document.getElementsByClassName("sb-label")
var sidebar_arrows = document.getElementsByClassName("sb-arrow")

var sidebar = "6%"
var content = "94%"

var logo = document.getElementById("logo")
var toggler = document.getElementById("q-icon-toggler")

function toggle_sidebar() {
    toggler.classList.toggle("fa-circle-chevron-left");
    toggler.classList.toggle("fa-circle-chevron-right");

    toggler.classList.toggle("fa-4x");
    toggler.classList.toggle("fa-3x");

    var client = document.body.clientWidth;
    var form = document.getElementById("sidebar").clientWidth;
    // console.log(Math.floor((form / client) * 100) + "%")

    if (Math.ceil((form / client) * 100) + "%" <= "16%") {
        navbar_container.style.marginLeft = sidebar
        sidebar_container.style.width = sidebar
        content_container.style.marginLeft = sidebar
        // footer_container.style.marginLeft = sidebar

        navbar_container.style.width = content
        content_container.style.width = content
        // footer_container.style.width = content

        logo.style.width = "100%"
        logo.style.padding = "5%"

        for (let i = 0; i < sidebar_labels.length; i++) {
            sidebar_icons[i].style = "font-size: 3em !important";
            sidebar_arrows[i].style = "display: none !important";
            sidebar_labels[i].classList.add('d-none');
        }
    } else {
        navbar_container.style.marginLeft = "15%"
        sidebar_container.style.width = "15%"
        content_container.style.marginLeft = "15%"
        // footer_container.style.marginLeft = "15%"

        navbar_container.style.width = "85%"
        content_container.style.width = "85%"
        // footer_container.style.width = "85%"

        logo.style.width = "80%"
        logo.style.padding = "10%"

        for (let i = 0; i < sidebar_labels.length; i++) {
            sidebar_icons[i].style = "font-size: 1.5em !important";
            sidebar_arrows[i].style.display = "inline";
            sidebar_labels[i].classList.remove('d-none');
        }
    }

}