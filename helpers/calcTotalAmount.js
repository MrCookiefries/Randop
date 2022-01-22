const Product = require("../models/Product");

// takes a new payment request of cart data & calculates the amount
const calcTotalAmount = async items => {
	let total = 0n;
	const ids = items.map(i => i.productId);
	const products = await Product.getByIdSet(ids);

	for (const { productId, quantity } of items) {
		const price = products[productId];
		const amount = BigInt(quantity);
		total += (price * amount);
	}

	return Number(total);
};

module.exports = calcTotalAmount;
