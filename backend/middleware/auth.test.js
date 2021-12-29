const jwt = require("jsonwebtoken");

const {
	authenticateJWT,
	ensureUser,
	ensureAdmin
} = require("./auth");
const { secretKey } = require("../config");
const ExpressError = require("../ExpressError");

const goodJwt = jwt.sign({ id: 0, isAdmin: false }, secretKey);
const badJwt = jwt.sign({ id: 0, isAdmin: false }, "different key");

describe("req token to res payload", () => {
	let req;
	let res;
	const next = err => {
		expect(err).toBeUndefined();
	};

	beforeEach(() => {
		req = { headers: {} };
		res = {};
	});

	test("good jwt", () => {
		req.headers.authorization = `Bearer ${goodJwt}`;
		authenticateJWT(req, res, next);

		expect(res.user).toEqual(
			expect.objectContaining({
				iat: expect.any(Number),
				id: 0,
				isAdmin: false
			})
		);
	});

	test("no jwt", () => {
		authenticateJWT(req, res, next);

		expect(res.user).toBeUndefined();
	});

	test("invalid jwt", () => {
		req.headers.authorization = `Bearer ${badJwt}`;
		authenticateJWT(req, res, next);

		expect(res.user).toBeUndefined();
	});
});

describe("ensure user", () => {
	const req = {};

	test("logged in", () => {
		const res = {
			user: {
				id: 1,
				isAdmin: false
			}
		};
		const next = err => {
			expect(err).toBeUndefined();
		};

		expect(ensureUser(req, res, next)).toBeUndefined();
	});

	test("anon", () => {
		const res = {};
		const next = err => {
			expect(err).toBeInstanceOf(ExpressError);
		};

		expect(ensureUser(req, res, next)).toBeUndefined();
	});
});

describe("ensure admin", () => {
	const req = {};
	const res = {
		user: {
			id: 1
		}
	};

	test("logged in", () => {
		res.user.isAdmin = true;
		const next = err => {
			expect(err).toBeUndefined();
		};

		expect(ensureAdmin(req, res, next)).toBeUndefined();
	});

	test("user", () => {
		res.user.isAdmin = false;
		const next = err => {
			expect(err).toBeInstanceOf(ExpressError);
		};

		expect(ensureAdmin(req, res, next)).toBeUndefined();
	});
});
