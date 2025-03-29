function addDecimals(num) {
  // Ensure the result is always a string with 2 decimal places
  return (Math.round(num * 100) / 100).toFixed(2);
}

  // NOTE: the code below has been changed from the course code to fix an issue
  // with type coercion of strings to numbers.
  // Our addDecimals function expects a number and returns a string, so it is not
  // correct to call it passing a string as the argument.
  
  export const calcPrices = (orderItems) => {
    const itemsPrice = orderItems.reduce((acc, item) => acc + Number(item.price), 0);
    const taxPrice = 0.15 * itemsPrice; // 10% tax
    const totalPrice = itemsPrice + taxPrice;
  
    return {
      itemsPrice: parseFloat(itemsPrice).toFixed(2), // Ensure 2 decimal places
      taxPrice: parseFloat(taxPrice).toFixed(2),     // Ensure 2 decimal places
      totalPrice: parseFloat(totalPrice).toFixed(2), // Ensure 2 decimal places
    };
  };