const {
	commonBeforeAll, commonBeforeEach,
	commonAfterEach, commonAfterAll
} = require("../commonSetups");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const Cart = require("./Cart");
const ExpressError = require("../ExpressError");

const userId = 3;
const cartId = 2;

describe("fetching", () => {
	test("not found user", async () => {
		const cart = await Cart.getByUser(0);

		expect(cart).toEqual([]);
	});

	test("get by user", async () => {
		const carts = await Cart.getByUser(userId);
		const cartsJest = [];
		for (let i = 2; i <= 3; i++) {
			cartsJest.push(
				expect.objectContaining({
					id: i,
					userId
				})
			);
		}

		expect(carts).toEqual(
			expect.arrayContaining(cartsJest)
		);
	});

	test("not found id", async () => {
		await expect(
			Cart.getById(0)
		).rejects.toThrowError(ExpressError);
	});

	test("get by id", async () => {
		const cart = await Cart.getById(cartId);

		expect(cart).toEqual(expect.objectContaining({
			id: cartId,
			userId
		}));
	});
});

describe("creation", () => {
	test("add one", async () => {
		const newCartUserId = 6;
		const cart = await Cart.addNew(newCartUserId);

		expect(cart).toEqual(expect.objectContaining({
			id: expect.any(Number),
			userId: newCartUserId
		}));
	});
});

describe("deletion", () => {
	test("not found", async () => {
		await expect(
			Cart.deleteById(0)
		).rejects.toThrowError(ExpressError);
	});

	test("delete one", async () => {
		const cart = await Cart.addNew(4);

		expect(cart.delete()).resolves.toBeUndefined();
	});
});
