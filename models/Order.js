const db = require("../database");

// represents an order row in the orders table
class Order {
	constructor({ id, userId, checkoutDate, items }) {
		this.id = id;
		this.userId = userId;
		this.checkoutDate = checkoutDate;
		this.items = items;
	}

	// checks if an order exists by the cart id
	static async checkDuplicate(cartId) {
		const result = await db.query(
			`SELECT id FROM orders
			WHERE id = $1`,
			[cartId]
		);

		if (result.rows[0]) {
			throw new ExpressError(`Order already exists with ID: ${cartId}`, 400);
		}
	}

	// creates a new order for a user from cart
	// & copies items over as well - deleting the old cart
	static async addNew(cartId) {
		// can't have the same order twice
		await this.checkDuplicate(cartId);

		const result = await db.query(
			`WITH order_ins AS (
				INSERT INTO orders (
					SELECT id, user_id
					FROM carts WHERE id = $1
				)
				RETURNING id, user_id, checkout_date
			),
			items_ins AS (
				INSERT INTO orders_products (
					SELECT cart_id AS "order_id",
					product_id, quantity
					FROM carts_products
					WHERE cart_id = $1
				)
				RETURNING order_id, product_id, quantity
			)
			SELECT id, user_id AS "userId",
			checkout_date AS "checkoutDate",
			JSON_AGG(JSON_BUILD_OBJECT(
				'quantity', quantity, 'productId', product_id
			)) AS items
			FROM order_ins JOIN items_ins
			ON id = order_id
			GROUP BY id, user_id, checkout_date`,
			[cartId]
		);

		return new this(result.rows[0]);
	}

	// creates multiple new order instances in an array to return
	static addMultiple(orders) {
		return orders.map(o => new this(o));
	}

	// returns all the orders or the amount specified
	// including the order items
	static async getMany({ limit, offset } = {}) {
		// only add in the filtering clauses if applicable
		const result = await db.query(
			`SELECT id, user_id AS "userId",
			checkout_date AS "checkoutDate",
			JSON_AGG(JSON_BUILD_OBJECT(
				'quantity', quantity, 'productId', product_id
			)) AS items
			FROM orders JOIN orders_products
			ON id = order_id
			GROUP BY id, user_id, checkout_date
			${limit ? "LIMIT " + limit : ""}
			${offset ? "OFFSET " + offset : ""}`
		);

		return this.addMultiple(result.rows);
	}

	// get the total count of orders
	static async getCount() {
		const result = await db.query(
			`SELECT COUNT(id) AS "count" FROM orders`
		);

		return result.rows[0];
	}
}

module.exports = Order;
