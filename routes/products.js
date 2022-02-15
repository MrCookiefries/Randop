const { Router } = require("express");
const router = Router();

const catchErrors = require("../middleware/catchErrors");
const Product = require("../models/Product");
const parseStringNums = require("../helpers/parseStringNums");
const handleJsonValidator = require("../helpers/handleJsonValidator");
const getManySchema = require("../jsonschemas/products/getMany.json");
const addNewSchema = require("../jsonschemas/products/addNew.json");
const updateSchema = require("../jsonschemas/products/update.json");
const filterIdsSchema = require("../jsonschemas/products/filterIds.json");
const { ensureAdmin, ensureUser } = require("../middleware/auth");

router.get("/", catchErrors(async (req, res) => {
	parseStringNums(req.query, ["limit", "offset"]);
	handleJsonValidator(req.query, getManySchema);
	const products = await Product.getMany(req.query);
	return res.status(200).json({ products });
}));

router.get("/:id", catchErrors(async (req, res) => {
	const product = await Product.getById(req.params.id);
	return res.status(200).json({ product });
}));

router.get("/count", catchErrors(async (req, res) => {
	const { count } = await Product.getCount();
	return res.status(200).json({ count: count.toString() });
}));

router.post("/", [ensureUser, ensureAdmin],
	catchErrors(async (req, res) => {
		handleJsonValidator(req.body, addNewSchema);
		const product = await Product.addNew(req.body);
		return res.status(201).json({ product });
	})
);

router.post("/getByIds", catchErrors(async (req, res) => {
	handleJsonValidator(req.body, filterIdsSchema);
	const products = await Product.filterByIds(req.body.ids);
	return res.status(201).json({ products });
}));

router.patch("/:id", [ensureUser, ensureAdmin],
	catchErrors(async (req, res) => {
		handleJsonValidator(req.body, updateSchema);
		const product = await Product.updateById(req.params.id, req.body);
		return res.status(200).json({ product });
	})
);

router.delete("/:id", [ensureUser, ensureAdmin],
	catchErrors(async (req, res) => {
		await Product.deleteById(req.params.id);
		return res.status(204).send();
	})
);

module.exports = router;
