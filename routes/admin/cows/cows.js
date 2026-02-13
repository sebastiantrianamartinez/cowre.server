const express = require("express");
const CowHandler = require("../../../services/handlers/cows");
const CowsAssembler = require("../../../services/assemblers/cows");

const router = express.Router();
const handler = new CowHandler();
const assembler = new CowsAssembler();

router.post("/", async (req, res) => {
    try {
        const cowData = req.body;
        const newCow = await handler.create(cowData);

        res.status(201).json({
            data: newCow,
            details: req.body?.details || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create cow record." });
    }
});

router.post('/search', async (req, res) => {
    try {
        const { query, filter } = req.body;
        const results = await handler.search(query, filter);
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search cow records.' });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const cowId = req.params.id;
        const cowData = req.body;

        const beforeUpdate = await handler.findById(cowId);

        cowData.id = cowId;
        const updatedCow = await handler.update(cowData);

        res.status(200).json({
            data: updatedCow,
            details: {
                before: beforeUpdate,
                after: updatedCow,
                details: req.body?.details || null
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to update cow record." });
    }
});

router.get("/", async (req, res) => {
    try {
        const cows = await handler.findAll();
        res.status(200).json(cows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cow records." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const cowId = req.params.id;
        const cow = await assembler.assembleById(cowId);
        //const cow = await handler.findById(cowId);

        if (!cow) {
            return res.status(404).json({ error: "Cow not found." });
        }

        res.status(200).json(cow);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve cow record." });
    }
});

router.get("/:limit/:offset", async (req, res) => {
    try {
        const limit = parseInt(req.params.limit, 10);
        const offset = parseInt(req.params.offset, 10);

        const cows = await handler.findWithPagination(limit, offset, [['id', 'DESC']]);
        res.status(200).json(cows);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cow records with pagination." });
    }
});

router.get("/shares/:id", async (req, res) => {
    try {
        const cowId = req.params.id;
        const cow = await assembler.assembleForShares(cowId);

        if (!cow) {
            return res.status(404).json({ error: "Cow not found." });
        }

        res.status(200).json(cow);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve cow shares." });
    }
});

module.exports = router;