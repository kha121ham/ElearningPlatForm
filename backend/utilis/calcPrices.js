// Format number to always return string with 2 decimal places
export function addDecimals(num) {
  return (Math.round(Number(num) * 100) / 100).toFixed(2);
}

// Calculate pricing based on orderItems array
export function calcPrices(orderItems) {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error('Invalid or empty order items array');
  }

  // Ensure all item prices are numeric
  const itemsPrice = orderItems.reduce((acc, item) => {
    const price = Number(item.price);
    if (isNaN(price)) {
      throw new Error(`Invalid price value: ${item.price}`);
    }
    return acc + price;
  }, 0);

  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + taxPrice;

  return {
    itemsPrice: addDecimals(itemsPrice),
    taxPrice: addDecimals(taxPrice),
    totalPrice: addDecimals(totalPrice),
  };
}
