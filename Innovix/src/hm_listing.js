document.addEventListener('DOMContentLoaded', function () {
    let listProductHTMl = document.querySelector('.listProduct');
    let iconCartSpan = document.querySelector('.icon-cart span');

    let carts = [];
    let listProducts = [];

    const addDataToHTML = () => {
        listProductHTMl.innerHTML = "";
        if (listProducts.length > 0) {
            listProducts.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.classList.add('item');
                newProduct.dataset.id = product.id;
                newProduct.innerHTML = `
                    <img src="${product.image}" alt="">
                    <h2>${product.name}</h2>
                    <div class="price">$${product.price}</div>
                    <button class="addCart">
                        Agregar al carrito
                    </button>
                `;
                listProductHTMl.appendChild(newProduct);
            })
        }
    }

    listProductHTMl.addEventListener('click', (event) => {
        let totalQuantity = 0;
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let product_id = positionClick.parentElement.dataset.id;
            addToCart(product_id);
            // update quantity cart
            if (carts) {
                carts.forEach(item => {
                  totalQuantity += item.quantity;
                });
              }

              iconCartSpan.innerText = totalQuantity;
        }
    });

    const addToCart = (product_id) => {
        let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
        if(carts.length <= 0){
            carts = [{
                product_id: product_id,
                quantity: 1
            }]
            }else if(positionThisProductInCart < 0){
                carts.push({
                    product_id: product_id,
                    quantity: 1
                })
            } else {
                carts[positionThisProductInCart].quantity++;
            }
            addCartToMemory();
    }

    const addCartToMemory = () => {
        localStorage.setItem('cart', JSON.stringify(carts));
    }

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
        }
    }
    
    const initApp = () => {
        fetch('hm_products.json')
            .then(response => response.json())
            .then(data => {
                listProducts = data;
                addDataToHTML();
                //get cart from memory
                if(localStorage.getItem('cart')){
                    carts = JSON.parse(localStorage.getItem('cart'));
                }
            })
    }

    initApp();
});
