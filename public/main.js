const nav = document.getElementById("nav");

const paths = location.pathname.split("/");
const pathname = paths[paths.length - 1];

window.addEventListener("scroll",function() {
    if (scrollY > 20)    {
        nav.classList.add("white");
    } else nav.classList.remove("white");
}); 

window.addEventListener("click",function(event) {
    const shadow = document.querySelector(".cover"); 
    if (event.target === shadow && CART.shown) CART.hideHiddenCart();
});


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
    this.shown = false;

    this.updateItemTotal = function(id,number) {
        let index = this.getItemIndex(id);
        let item = this.items[id];
        let product = this.cart_data[index];
        
        product.quantity += number;
        this.total_price += item.current_price * (number < 0 ? -1 : 1);

        if (product.quantity == 0) this.removeItem(id,true);
        else this.displayItems();
    }   

    this.getItemIndex = function(id) {
        let result = -1;
        for (let i = 0;i < this.cart_data.length;i++) {
            if (this.cart_data[i].id === id) result = i;
        }
        return result;
    }

    this.removeItem = function(id,reduced) {
        let index = this.getItemIndex(String(id));
        let item = this.items[id];
        let product = this.cart_data[index];
        console.log(this.cart_data,id,index,product);

        this.cart_data.splice(index,1);
        if (!reduced)
            this.total_price -= product.quantity * item.current_price;
        
        item.total = 1;
        this.displayItems();
    }
    

    this.showHiddenCart =  function() {
        this.element.style.transform = "translateX(0)";
        document.body.style.overflow = "hidden";
        document.getElementById("main").classList.add("cover");
        this.shown = true;
    }

    this.hideHiddenCart = function hideHiddenCart() {
        nav.classList.remove("white");
        this.element.style.transform = "translateX(100%)";
        document.body.style.overflow = "";
        document.getElementById("main").classList.remove("cover");
        setTimeout(() => {
              if (scrollY > 20) nav.classList.add("white");
        },100);
        this.shown = false;
    }

    this.addItem = function(id) {
        let index = this.getItemIndex(id);
        
        if (index == -1) {
            this.cart_data.push({id,quantity: 1});
            this.total_price += this.items[id].current_price;
        }  
        else this.updateItemTotal(id,1);
        this.displayItems();
    }

    this.displayItems = function(){
        let cart_greeting = document.querySelector("#cart .cart-greeting");
        if (this.cart_data.length === 0) cart_greeting.classList.remove("hide");
        else cart_greeting.classList.add("hide");

        document.querySelector("#cart .checkout").innerHTML = this.cart_data.length === 0 ? `<a href="${pathname !== "shop.html" ? "./subpages/shop.html" : ""}">Go Shop</a>` 
                : `<button onclick="checkoutItems()">$${this.total_price} - Checkout</button>`;
        
        localStorage.setItem("cart-items",JSON.stringify(this.cart_data));
        localStorage.setItem("previous-total",String(this.total_price));

        let items = "";
        for (let i = 0;i < this.cart_data.length;i++) {
            let {id,quantity} = this.cart_data[i];
            let {name,image,subname,type,previous_price,current_price} = this.items[id];

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
                        <i class="fa-solid fa-trash" onclick="CART.removeItem(${id})"></i>
                    </button>
                    <div class="actions">
                        <div class="amount">
                            <button onclick="CART.updateItemTotal('${id}',1)"><i class="fa-solid fa-plus" ></i></button>
                            <div class="number">${quantity}</div>
                            <button onclick="CART.updateItemTotal('${id}',-1)"><i class="fa-solid fa-minus" ></i></button>
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
        
        let navCart = nav.querySelectorAll(".nav-icons a")[1];
        if (this.cart_data.length > 0) {
            navCart.classList.add("cart-nav");
            navCart.setAttribute("data-cart-items-total",this.cart_data.length);
        } else navCart.classList.remove("cart-nav");
        this.items_container.innerHTML = items;
    }
}

async function checkoutItems() {
    console.log(CART.cart_data);
    const request = await fetch("/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CART.cart_data)
    });
    const response = await request.json();
    console.log(response);
}

async function getItemData() {
    const request = await fetch("https://raw.githubusercontent.com/RafhaelHailar/Long-Stick/master/data.json")
    const data = await request.json();

    CART.items = data;
    if (window.init) init();

    let cart_data = localStorage.getItem("cart-items");
    let previous_total = localStorage.getItem("previous-total");
    if (cart_data) {
        CART.cart_data = JSON.parse(cart_data);
        CART.total_price = Number(previous_total);
         
        if (CART.cart_data.length > 0) {
            let cartNav = nav.querySelectorAll(".nav-icons a")[1];
                cartNav.classList.add("cart-nav");  
                cartNav.setAttribute("data-cart-items-total",CART.cart_data.length);
        }
        CART.displayItems();
    }
}

window.addEventListener("DOMContentLoaded",getItemData);


// UTILITIES
// format
// digit = (d | dd | ddd)
// == digit,...,digit
/* 
 * @params {number} number
 * @return {string}
*/
function numberFormatter(number) {
  return String(number).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,","); 
}

//format 
// string lowercase
// == string-string-string...-string
// input A Banna Under, output a-banana-under
/*
 * @params {string} string
 * @return {string}
*/
function stringFormatter(string) {
    return string.replace(/[^a-zA-Z]/g,"").replace(/\B(?=[A-Z])/g,"-").toLowerCase();
}

function test(func,input,expect) {
    let message = "Failed!";
    const result = func(input);
    if (result === expect) message = "Success!";
    console.log(`Testing ${func.name} with '${input}' , '${expect}'`);
    console.log(`Function output: '${result}'`);
    console.log(message);
}

test(stringFormatter,"May Onace","may-onace");
test(stringFormatter,"May - Salado _ _asdas Balls - Onace","may-saladoasdas-balls-onace");
