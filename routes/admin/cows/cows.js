const express = require("express");
const CowHandler = require("../../../services/handlers/cows");
const CowsAssembler = require("../../../services/assemblers/cows");

const router = express.Router();
const handler = new CowHandler();
const assembler = new CowsAssembler();

const statusMap = {
    inactive: 1,
    active: 2,
    deleted: 0
}

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
        let { query, filter } = req.body;
        if(filter){
            filter.status = 2;
        }
        else {
            filter = { status: 2 };
        }
        
        console.log('Search query:', query, 'Filter:', filter);
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
        const cowAssembler = new CowsAssembler();
        const cow = await cowAssembler.assembleById(cowId);
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
        const cowAssembler = new CowsAssembler();
        const cowId = req.params.id;
        const cow = await cowAssembler.assembleForShares(cowId);

        if (!cow) {
            return res.status(404).json({ error: "Cow not found." });
        }

        res.status(200).json(cow);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve cow shares." });
    }
});

router.put("/activation/:id/:status", async (req, res) => {
    try {
        const cowId = req.params.id;
        const status = statusMap[req.params.status];

        console.log(`Changing status of cow ${cowId} to ${status} (${req.params.status})`);

        const updatedCow = await handler.changeStatus(cowId, status);

        res.status(200).json({
            data: updatedCow,
            details: req.body?.details || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to change cow status." });
    }
});

router.put("/farm/move/:id/:farmId", async (req, res) => {
    try {
        const cowId = req.params.id;
        const farmId = req.params.farmId;

        console.log(`Moving cow ${cowId} to farm ${farmId}`);

        const updatedCow = await handler.moveToFarm(cowId, farmId);

        res.status(200).json({
            data: updatedCow,
            details: req.body?.details || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to move cow to new farm." });
    }
});

module.exports = router;