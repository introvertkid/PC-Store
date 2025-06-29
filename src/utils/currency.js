// Currency formatting utility for VND
export const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numPrice);
};

export const formatPriceNumber = (price) => {
  const numPrice = parseFloat(price) || 0;
  return new Intl.NumberFormat("vi-VN").format(numPrice) + " ₫";
};
