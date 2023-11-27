const nav = document.getElementById("nav");

const paths = location.pathname.split("/");
const pathname = paths[paths.length - 1];

window.addEventListener("scroll",function() {
    if (scrollY > 20)    {
        nav.classList.add("white");
    } else nav.classList.remove("white");
}); 

let cards = document.querySelectorAll("#products .card .image-container");

for (let i = 0;i < cards.length;i++) {
    cards[i].onmouseover = function() {
        this.querySelector('video').play();
    }
    
    cards[i].onmouseout = function() {
        this.querySelector('video').pause();
    }
}



let SHOP = new (function() {
    const items_container = {};
    
    this.display = function(target,element) {
        let containers = document.querySelectorAll("#item-collections .contents .content-item");

        if (target == "") {
            for (let i = 0;i < containers.length;i++) 
                 containers[i].classList.remove("hide");
        } else {
            for (let i = 0;i < containers.length;i++) {
                if (containers[i].id == target) containers[i].classList.remove("hide");
                else containers[i].classList.add("hide");
            }
        }

        let activeElement = document.querySelector("#item-collections .navigator button.active");
        activeElement.classList.remove("active");
        element.classList.add("active");
    }

    

    this.cart = new function() {
        this.datas = [];
        this.add = function(data) {
            this.datas.push(data);
        }
    }

    this.addToCart = function({}) {
        this.cart.add({

        });
        
    }   
});
/*
 ***************************
 *******************
 ****************
 **********  
            __ADD CART SECTION__
            
                                 ****************
                             ********************
                        *************************
                     ****************************
*/

const CART = new function() { 
    this.element = document.getElementById("cart");
    this.items_container = document.querySelector("#cart .cart-items");
    this.checkout_button = document.querySelector(".checkout button");
    this.total_price = 0;
    this.cart_data = [];

    this.updateItemTotal = function(item_name,number) {
        let index = this.getItemIndex(item_name);
        let item = this.cart_data[index];

        item.total += number;
        this.total_price += item.current_price * (number < 0 ? -1 : 1);

        if (item.total == 0) this.removeItem(item_name,true);
        else this.displayItems();
    }   

    this.getItemIndex = function(item_name) {
        let result = -1;
        item_name = item_name.replace("_"," ");
        for (let i = 0;i < this.cart_data.length;i++) {
            if (this.cart_data[i].name == item_name) result = i;
        }
        return result;
    }

    this.removeItem = function(item_name,reduced) {
        let index = this.getItemIndex(item_name);
        let item = this.cart_data[index];

        this.cart_data.splice(index,1);
        if (!reduced)
            this.total_price -= item.total * item.current_price;
        
        item.total = 1;
        this.displayItems();
    }
    

    this.showHiddenCart =  function() {
        this.element.style.transform = "translateX(0)";
        document.body.style.overflow = "hidden";
        document.getElementById("main").classList.add("cover");
    }

    this.hideHiddenCart = function hideHiddenCart() {
        nav.classList.remove("white");
        this.element.style.transform = "translateX(100%)";
        document.body.style.overflow = "auto";
        document.getElementById("main").classList.remove("cover");
        setTimeout(() => {
              if (scrollY > 20) nav.classList.add("white");
        },100);
    }

    this.addItem = function(item) {
        let index = this.getItemIndex(item);
        console.log(index) 
        if (index == -1) {
            this.cart_data.push(this.items[item]);
            this.total_price += this.items[item].current_price;
        }  
        else this.updateItemTotal(item,1);
        this.displayItems();
    }

    this.displayItems = function(){
        let cart_greeting = document.querySelector("#cart .cart-greeting");
        if (this.cart_data.length === 0) cart_greeting.classList.remove("hide");
        else cart_greeting.classList.add("hide");

        document.querySelector("#cart .checkout").innerHTML = this.cart_data.length === 0 ? `<a href="${pathname !== "shop.html" ? "./subpages/shop.html" : ""}">Go Shop</a>` 
                : `<button>$${this.total_price} - Checkout</button>`;
        
        localStorage.setItem("cart-items",JSON.stringify(this.cart_data));
        localStorage.setItem("previous-total",String(this.total_price));

        let items = "";
        for (let i = 0;i < this.cart_data.length;i++) {
            let {name,image,subname,type,previous_price,current_price,total} = this.cart_data[i];

            if (/subpages\/shop.html/.test(location.pathname)) image = "../" + image;
        
            items += `
            <div class="cart-item">
                <div class="image">
                    <img src="${image}" alt="" class="h-100" style="width: 130px;">
                </div>
                <div class="text d-flex flex-column justify-content-start w-100">
                    <a class="name" href="#" style="text-decoration: none;color: black;">
                        ${name}
                    </a>
                    <h5 class="text-secondary">${subname}</h5>
                    <p>${type}</p>
                    <button class="remove">
                        <i class="fa-solid fa-trash" onclick="CART.removeItem('${name.replace(" ","_")}')"></i>
                    </button>
                    <div class="actions">
                        <div class="amount">
                            <button onclick="CART.updateItemTotal('${name.replace(" ","_")}',1)"><i class="fa-solid fa-plus" ></i></button>
                            <div class="number">${total}</div>
                            <button onclick="CART.updateItemTotal('${name.replace(" ","_")}',-1)"><i class="fa-solid fa-minus" ></i></button>
                        </div>
                        <div class="price">
                            <p class="current">${current_price > 0 ? "$" + current_price : "Free"}</p>
                            <p class="previous">${previous_price ? "$" + previous_price : ""}</p>
                        </div>
                    </div>
                </div>
            </div>
           `;
        }

        nav.querySelector("a.cart-nav").setAttribute("data-cart-items-total",this.cart_data.length);
        this.items_container.innerHTML = items;
    }
}


window.onload = function() {
    fetch("../data.json")
    .then(response => response.json())
    .then(data => CART.items = data);

    let cart_data = localStorage.getItem("cart-items");
    let previous_total = localStorage.getItem("previous-total");
    if (cart_data) {
        CART.cart_data = JSON.parse(cart_data);
        CART.total_price = Number(previous_total);
         
        let cartNav = nav.querySelectorAll(".nav-icons a")[1];
            cartNav.classList.add("cart-nav");  
            cartNav.setAttribute("data-cart-items-total",CART.cart_data.length);

        CART.displayItems();
    }
}
