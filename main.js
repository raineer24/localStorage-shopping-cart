'use strict';

const CART = {
    KEY: 'bkasjbdfkjasdkfjhaksdfjskd',
    contents: [],
    init(){
        //check localStorage and initialize the contents of CART.contents
        let _contents = localStorage.getItem(CART.KEY);
        if(_contents){
            CART.contents = JSON.parse(_contents);
        }else{
            //dummy test data
            CART.contents = [
                // {id:1, title:'Apple', qty:5, itemPrice: 0.85},
                // {id:2, title:'Banana', qty:3, itemPrice: 0.35},
                // {id:3, title:'Cherry', qty:8, itemPrice: 0.05}
                          ];
            // in production use an empty array here only
            CART.sync();
        }
    },
    async sync(){
        let _cart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, _cart);
    },
    find(id){
        //find an item in the cart by it's id
        let match = CART.contents.filter(item=>{
            if(item.id == id)
                return true;
        });
        if(match && match[0])
            return match[0];
    },
    add(id){
        //add a new item to the cart
        //check that it is not in the cart already
        if(CART.find(id)){
            CART.increase(id, 1);
        }else{
            let arr = PRODUCTS.filter(product=>{
                if(product.id == id){
                    return true;
                }
            });
            if(arr && arr[0]){
                let obj = {
                    id: arr[0].id,
                    title: arr[0].title,
                    qty: 1,
                    itemPrice: arr[0].price
                    // desc: arr[0].desc
                    //add another property which is description
                };
                CART.contents.push(obj);
                //update localStorage
                CART.sync();
            }else{
                //product id does not exist in products data
                console.error('Invalid Product');
            }
        }
    },
    increase(id, qty=1, itemPrice){
        //increase the quantity of an item in the cart
        CART.contents = CART.contents.map(item=>{
            //console.log(item);
            
            if(item.id === id) {
                //linePrice = item.qty * item.price
                item.qty = item.qty + qty;
             itemPrice = item.itemPrice * item.qty;
            // console.log('item price: ' + itemPrice +  ' item name: ' + item.title)
            }
            return item;
        });
        //update localStorage
        CART.sync()
    },
    reduce(id, qty=1){
        //reduce the quantity of an item in the cart
        CART.contents = CART.contents.map(item=>{
            if(item.id === id)
                item.qty = item.qty - qty;
               return item;
        });
        CART.contents.forEach(async item=>{
            if(item.id === id && item.qty === 0)
                CART.remove(id);
        });
        //update localStorage
        CART.sync()
    },
    remove(id){
        //remove an item entirely from CART.contents based on its id
        CART.contents = CART.contents.filter(item=>{
            if(item.id !== id)
                return true;
        });
        //update localStorage
        CART.sync()
    },
    empty(){
        //empty whole cart
        CART.contents = [];
        //update localStorage
        CART.sync()
    },
    sort(field='title'){
        //sort by field - title, price
        //return a sorted shallow copy of the CART.contents array
        let sorted = CART.contents.sort( (a, b)=>{
            if(a[field] > b[field]){
                return 1;
            }else if(a[field] < a[field]){
                return -1;
            }else{
                return 0;
            }
        });
        return sorted;
        //NO impact on localStorage
    },
    logContents(prefix){
        console.log(prefix, CART.contents)
    }
};

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
    
}

function ready(){
    
     //when the page is ready
     getProducts( showProducts, errorMessage );
     //get the cart items from localStorage
     CART.init();
     //load the cart items
     showCart();
     //countCartTotal();
   
}
 let PRODUCTS = [];
// document.addEventListener('DOMContentLoaded', () =>{
   
// });



function showCart(){
    
    let cartSection = document.getElementById('cart');
   // cartSection.className = 'cart-ner'
    cartSection.innerHTML = '';
    //cartSection.innerHTML = '';
    let s = CART.sort('title');
    //let s = CART.sort('title');
    s.forEach( item =>{
   //    console.log(item)
        let cartitem = document.createElement('div');
        cartitem.className = 'cart-item';
        //console.log(cartitem);
        
        let title = document.createElement('h3');
        title.textContent = item.title;
        title.className = 'title'
        cartitem.appendChild(title);
        
        let controls = document.createElement('div');
        controls.className = 'controls';
        cartitem.appendChild(controls);
        
        let plus = document.createElement('span');
        plus.textContent = '+';
        plus.setAttribute('data-id', item.id)
        plus.setAttribute('data-action', 'INCREASE__ITEM');
        controls.appendChild(plus);
        plus.addEventListener('click', incrementCart)
        
        let qty = document.createElement('span');
        qty.className = 'quantity';
        qty.textContent = item.qty;
        controls.appendChild(qty);
        
        let minus = document.createElement('span');
        minus.textContent = '-';
        minus.setAttribute('data-id', item.id);
        minus.setAttribute('data-action', 'MINUS__ITEM');
        controls.appendChild(minus);
        minus.addEventListener('click', decrementCart)
        
        let price = document.createElement('div');
        

        price.className = 'price';
       // console.log(typeof price.textContent);
        price.textContent = "wazzzaah";
        //console.log(price.textContent);
        let cost = new Intl.NumberFormat('en-CA', 
                        {style: 'currency', currency:'CAD'}).format(item.qty * item.itemPrice);
                        
        price.textContent = cost;
       // console.log(price.textContent);
        //console.log(price)
    //    console.log(price.textContent);
        cartitem.appendChild(price);
            //console.log(itemPrice);
  let linePrice = document.createElement('div');
    linePrice.className = 'linePrice';
 linePrice.textContent = "wazzzaah";
   cartitem.appendChild(linePrice);
    //console.log(s);
        
        cartSection.appendChild(cartitem);
        
        
    
    });
}



function incrementCart(ev){
    ev.preventDefault();
    //console.log(ev.target);
    let cartSection = document.getElementById('cart');
    
    let id = parseInt(ev.target.getAttribute('data-id'));
    CART.increase(id, 1);
    let controls = ev.target.parentElement;
    let qty = controls.querySelector('span:nth-child(2)');
 
    let item = CART.find(id);
   // console.log(document.querySelector('.linePrice').textContent = qty);
   
//     let linePriceElement = document.querySelector('.linePrice').textContent;
//    let linePrice = item.itemPrice * item.qty;
//    //console.log(linePrice)
//     console.log(linePriceElement)
//     linePriceElement = linePrice;

// start
      //  cartItem = document.querySelectorAll('.cart-item');

       let cartItem = ev.target.parentElement.parentElement;
       let linePrice = item.itemPrice * item.qty;
   cartItem.querySelector('.price').innerHTML = `$${linePrice.toFixed(2)}`;


// end

   // let linePriceElement = cartSection.getElementsByClassName('linePrice');
 
    //console.log(cartItem.querySelector('.price').innerHTML = linePrice);
//    // let linePriceCost  = new Intl.NumberFormat('en-CA', 
//                         {style: 'currency', currency:'CAD'}).format(item.qty * item.itemPrice);
   // linePriceElement.textContent = linePriceCost;
   // console.log(linePriceElement);

    //console.log(linePriceElement);
  
 //  let cartItem = document.getElementsByClassName('cart-item');
   // console.log(cartItem);
  //cartItem.appendChild(linePriceElement);
   //cartSection.appendChild(cartItem);
   // console.log(cartItem)
    //console.log(document.getElementsByClassName('quantity')[0]);
   // console.log(document.querySelector('.quantity')[0]);
//     const cartItemContainer = document.getElementsByClassName('cart1')[0];
//     const cartItems = cartItemContainer.getElementsByClassName('cart-item');
 //console.log(item.title)
    // if(item.id === id) {
    //     for (let i = 0; i < cartItems.length; i++) {
    //         const cartItem = cartItems[i];
    //         console.log(cartItem.getElementsByClassName('quantity')[0]);
            
    //     }
       
    // }
   // let linePrice = document.querySelector('linePrice');
  //console.log(document.getElementsByClassName('linePrice'));
    //let linePrice = 0;
    //const cartDOM = document.querySelector('.cart-item');
    //const cartItemsDOM = cartDOM.querySelectorAll('.cart-item');
    // cartItemsDOM.forEach((cartItemDOM) => {
    //     console.log(cartDOM);
    // });

    //console.log(cartItemsDOM);

    // let cart = CART.contents;
    //  cart.forEach(cartItem => {
    //      console.log(cartItem)
    //  })
    //console.log(cartItems);
    // console.log(item.title);
    // console.log(id);
    // console.log(item);
    // CART.contents = CART.contents.map(item=>{
        // if(item.id === id) {
        //     console.log(item.title)
           
        // }
         
    
    
    // let cart = CART.contents;

    // ;
    // cart = cart.filter(item => {
    //     console.log(item.title)
    // })
    


   //console.log(x.getElementsByClassName('title')[0])
    
   if(item){
    
    // console.log(item.id);
    // console.log(id);
    //console.log(linePrice.textContent)
    //console.log(item);
    //let price = cartItemDOM.querySelector('.price').textContent;
  // let linePriceElement = cartItemDOM.querySelector('.linePrice');
   // console.log(linePriceElement);
   //linePrice = parseFloat(linePriceElement);
    qty.textContent = item.qty;
    //console.log(item.itemPrice);
    //console.log(item.qty * item.itemPrice)
   // linePrice = item.qty * item.itemPrice;
   // price.textContent = linePrice;
 //  console.log( linePrice);
  // linePriceElement.textContent = linePrice;
    //cartItemsDOM.appendChild(linePrice);
    
    

}else{
    document.getElementById('cart').removeChild(controls.parentElement);
}
    
   // console.log(item.itemPrice * item.qty)
}

function decrementCart(ev){
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-id'));
    CART.reduce(id, 1);
    let controls = ev.target.parentElement;
    let qty = controls.querySelector('span:nth-child(2)');
    let item = CART.find(id);
    if(item){
        qty.textContent = item.qty;
        
    }else{
        document.getElementById('cart').removeChild(controls.parentElement);
    }

}



function getProducts(success, failure){
    //request the list of products from the "server"
    const URL = "https://prof3ssorst3v3.github.io/media-sample-files/products.json?";
    fetch(URL, {
        method: 'GET',
        mode: 'cors'
    })
    .then(response=>response.json())
    //then(success)
    .then(showProducts)
    .catch(err=>{
        errorMessage(err.message);
    });
    //.catch failure
    // more cleaner
    
}

function showProducts( products ){
    PRODUCTS = products;
    //take data.products and display inside <section id="products">
    let imgPath = 'https://prof3ssorst3v3.github.io/media-sample-files/';
    let productSection = document.getElementById('products');
    productSection.innerHTML = "";
    products.forEach(product=>{
        //console.log(product);
        let card = document.createElement('div');
        card.className = 'card';
        //add the image to the card
        let img = document.createElement('img');
        img.alt = product.title;
        img.src = imgPath + product.img;
        card.appendChild(img);
        //add the price   
        let price = document.createElement('p');
        let cost = new Intl.NumberFormat('en-CA', 
                                {style:'currency', currency:'CAD'}).format(product.price);
        price.textContent = cost;
        price.className = 'price';
        card.appendChild(price);
        
        //add the title to the card
        let title = document.createElement('h2');
        title.textContent = product.title;
        card.appendChild(title);
        //add the description to the card
        let desc = document.createElement('p');
        desc.textContent = product.desc;
        card.appendChild(desc);
        //add the button to the card
        let btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = 'Add Item';
        btn.setAttribute('data-id', product.id);
        btn.setAttribute('data-action', 'ADD_TO_CART');
        btn.addEventListener('click', addItem);
        card.appendChild(btn);
        //add the card to the section
        productSection.appendChild(card);
    });
    
    //console.log(document.querySelectorAll('[data-action="ADD_TO_CART"]'))
    const addToCartButtonsDOM = document.querySelectorAll('[data-action="ADD_TO_CART"]');
    addToCartButtonsDOM.forEach(addToCartButtonDOM => {
       //console.log(addToCartButtonDOM.parentNode);
    })


    
   
    
}
function addItem(ev){
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-id'));
    console.log('add to cart item', id);
    CART.add(id, 1);
    showCart();
}

function errorMessage(err){
    //display the error message to the user
    console.error(err);
}