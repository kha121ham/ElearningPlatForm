export const addDecimal = (num) => (Math.round(num*100)/100).toFixed(2);

export const updateCart = (state) => {
    
    state.itemsPrice = addDecimal(state.cartItems.reduce((acc, item) => acc + item.price, 0));
    state.taxPrice = addDecimal(Number(state.itemsPrice * (15 / 100)).toFixed(2));
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.taxPrice)
    ).toFixed(2);

    
    localStorage.setItem('cart', JSON.stringify(state));

    return state;
};