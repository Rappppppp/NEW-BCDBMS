var a = document.getElementById("userProfile")
var b = document.getElementById("address")
var c = document.getElementById("makatiInfo")

Display = () => {
    a.style.display = "block"
    b.style.display = "none"
    c.style.display = "none"
}
Display()

document.getElementById('1').onclick = toggle;
document.getElementById('2').onclick = toggle;
document.getElementById('3').onclick = toggle;

function toggle(clicked) {
    if (this.id == '1') {
        if (a.style.display === "none") {
            a.style.display = "block";
            b.style.display = "none"
            c.style.display = "none"
        }
    } else if (this.id == '2') {
        if (b.style.display === "none") {
            b.style.display = "block";
            a.style.display = "none"
            c.style.display = "none"
        }
    } else if (this.id == '3') {
        if (c.style.display === "none") {
            c.style.display = "block";
            a.style.display = "none"
            b.style.display = "none"
        }
    }
}

var btnContainer = document.getElementById("btn-group");
var btns = btnContainer.getElementsByClassName("btn");

for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = btnContainer.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}