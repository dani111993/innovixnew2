document.addEventListener('DOMContentLoaded', function () {
    let listCartHTML = document.querySelector('.listCart');
    let iconCartSpan = document.querySelector('.icon-cart span');

    let carts = [];
    let listProducts = [];

    const addCartToMemory = () => {
        localStorage.setItem('cart', JSON.stringify(carts));
        
    }

    const addCartToHTML = () => {
        listCartHTML.innerHTML = "";
        let totalQuantity = 0;
        if(carts.length > 0){
            carts.forEach(cart => {
                totalQuantity += cart.quantity;
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.dataset.id = cart.product_id;
                let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
                let info = listProducts[positionProduct];
                newCart.innerHTML = `
                    <div class="image">
                        <img src="${info.image}" alt="">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">
                        $${info.price * cart.quantity}
                    </div>
                    <div class="quantity">
                        <span class="minus"><</span>
                        <span>${cart.quantity}</span> 
                        <span class="plus">></span>
                    </div>
                `;
                listCartHTML.appendChild(newCart);
            })
        }
        iconCartSpan.innerText = totalQuantity;
    }



    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
           let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = 'minus';
            if(positionClick.classList.contains('plus')){
                type = 'plus';
            }
            changeQuantity(product_id, type);
        }   
    });

    const changeQuantity = (product_id, type) => {
        let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
        if(positionItemInCart >= 0){
            switch (type) {
                case 'plus':
                    carts[positionItemInCart].quantity++;
                    break;
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
            } else {
                carts.splice(positionItemInCart, 1);
            }
            break;
        }
        
        addCartToMemory();
        addCartToHTML();
        }
    }

    const initApp = () => {
        fetch('todos_products.json')
            .then(response => response.json())
            .then(data => {
                listProducts = data;
                console.log(listProducts);
                //get cart from memory
                if(localStorage.getItem('cart')){
                    carts = JSON.parse(localStorage.getItem('cart'));
                    console.log(carts);
                    addCartToHTML();
                }

            })
    }

    initApp();
});
