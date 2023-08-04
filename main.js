window.addEventListener("scroll",function() {
    if (scrollY > 20)    {
        this.document.getElementById("nav").classList.add("white");
    } else this.document.getElementById("nav").classList.remove("white");
}); 

let cart = document.getElementById("cart");

function showHiddenCart() {
    cart.style.transform = "translateX(0)";
}

function hideHiddenCart() {
    cart.style.transform = "translateX(100%)";
}

let cards = document.querySelectorAll("#products .card");

for (let i = 0;i < cards.length;i++) {
    cards[i].onmouseover = function() {
        this.querySelector('video').play();
    }
    
    cards[i].onmouseout = function() {
        this.querySelector('video').pause();
    }
}
