const uuidv4 = require("uuid").v4;

const db = require("../database");
const ExpressError = require("../ExpressError");
const sqlPartialUpdate = require("../helpers/sqlPartialUpdate");

// represents a product row in the products table
class Product {
	constructor({ id, name, image, option1, option2, price }) {
		this.id = id;
		this.name = name;
		this.image = image;
		this.option1 = option1;
		this.option2 = option2;
		this.price = price.toString();
	}

	/**
	 * check if a product already exists with a given id
	 * if so throws an error
	 */
	static async checkDuplicate(id) {
		const result = await db.query(
			`SELECT id FROM products
			WHERE id = $1`,
			[id]
		);
		if (result.rows[0]) {
			throw new ExpressError(`Duplicate product id: ${id}`, 400);
		}
	}

	// creates a new product instance to return
	static async addNew({
		name, image, price, id = uuidv4(), option1, option2
	}) {
		// pruducts can't have the same id
		await this.checkDuplicate(id);

		const result = await db.query(
			`INSERT INTO products
			(id, name, image, price, option1, option2)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING id, name, image, option1, option2, price`,
			[id, name, image, price, option1, option2]
		);

		return new this(result.rows[0]);
	}

	// creates multiple new product instances in an array to return
	static addMultiple(products) {
		return products.map(p => new this(p));
	}

	// deletes a product by ID
	static async deleteById(id) {
		const result = await db.query(
			`DELETE FROM products
			WHERE id = $1
			RETURNING id`,
			[id]
		);

		if (!result.rows[0]) {
			throw new ExpressError(`No product found with ID: ${id}`, 400);
		}
	}

	// delete a product from instance
	async delete() {
		await Product.deleteById(this.id);
	}

	// updates a product's information by the ID & returns it
	static async updateById(id, data = {}) {
		// generate the set portion of the query & the values array
		const { setColumns, values } = sqlPartialUpdate(data);
		const result = await db.query(
			`UPDATE products
			SET ${setColumns}
			WHERE id = $${values.length + 1}
			RETURNING id, name, image, option1, option2, price`,
			[...values, id]
		);

		const product = result.rows[0];
		if (!product) {
			throw new ExpressError(`No product found with ID: ${id}`, 400);
		}

		return new this(product);
	}

	// update a product from instance
	async update(data) {
		return await Product.updateById(this.id, data);
	}

	// returns all the products or the amount specified
	static async getMany({ limit, offset } = {}) {
		// only add in the filtering clauses if applicable
		const result = await db.query(
			`SELECT id, name, image, option1, option2, price
			FROM products
			${limit ? "LIMIT " + limit : ""}
			${offset ? "OFFSET " + offset : ""}`
		);

		return this.addMultiple(result.rows);
	}

	// return a product found by its ID
	static async getById(id) {
		const result = await db.query(
			`SELECT id, name, image, option1, option2, price
			FROM products WHERE id = $1`,
			[id]
		);

		const product = result.rows[0];
		if (!product) {
			throw new ExpressError(`No product found with id: ${id}`, 400);
		}

		return new this(product);
	}

	// get products by an id set
	static async getByIdSet(ids) {
		// format ids for IN query
		const idSet = ids.map(id => `'${id}'`).join(", ");
		const result = await db.query(
			`SELECT JSON_AGG(JSON_BUILD_OBJECT(
				id, price
			))
			FROM products
			WHERE id IN ($1)
			GROUP BY id`,
			[idSet]
		);

		return result.rows; // nothing log the query
	}
}

module.exports = Product;
