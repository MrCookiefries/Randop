const {
	commonBeforeAll, commonBeforeEach,
	commonAfterEach, commonAfterAll
} = require("../commonSetups");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const User = require("./User");
const ExpressError = require("../ExpressError");

describe("helpers", () => {
	test("duplicates", async () => {
		// new ID
		await expect(
			User.checkDuplicate("no@mail")
		).resolves.toBeUndefined();
		// already used ID
		await expect(
			User.checkDuplicate("u@1")
		).rejects.toThrowError(ExpressError);
	});
});

const newLogin = {
	email: "test@mail",
	password: "password"
};
const name = "name";

describe("register", () => {
	test("duplicate", async () => {
		await expect(
			User.register({ ...newLogin, name, email: "u@1" })
		).rejects.toThrowError(ExpressError);
	});

	test("new account", async () => {
		const user = await User.register({ ...newLogin, name });

		expect(user).toEqual(expect.objectContaining({
			email: newLogin.email,
			name,
			isAdmin: false,
			id: expect.any(Number),
			stripeId: null
		}));
	});
});

describe("login", () => {
	test("not found", async () => {
		await expect(
			User.login({ ...newLogin })
		).rejects.toThrowError(ExpressError);
	});

	test("wrong password", async () => {
		await expect(
			User.login({ email: "u@1", password: "wrong" })
		).rejects.toThrowError(ExpressError);
	});

	test("right password", async () => {
		const credentials = { email: "u@1", password: "password" };
		const user = await User.login(credentials);

		expect(user).toEqual(expect.objectContaining({
			email: credentials.email,
			name,
			isAdmin: true,
			id: expect.any(Number),
			stripeId: null
		}));
	});
});

describe("update", () => {
	test("not found", async () => {
		await expect(
			User.updateById("nope")
		).rejects.toThrowError(ExpressError);
	});

	test("update one", async () => {
		const newVals = { stripeId: "aklgjl3at499agk" };
		const user = await (
			await User.register({ ...newLogin, name })
		).update(newVals);

		expect(user).toEqual(expect.objectContaining({
			email: newLogin.email,
			...newVals,
			isAdmin: false,
			id: expect.any(Number)
		}));
	});
});

describe("get", () => {
	test("by id", async () => {
		const user = await User.getById(1);
		expect(user).toEqual(expect.objectContaining({
			id: 1, email: "u@1", name: "name",
			isAdmin: true, stripeId: null
		}));
	});

	test("not found id", async () => {
		await expect(
			User.getById(0)
		).rejects.toThrowError(ExpressError);
	});
});
