const express = require("express")
const tomlservice = require("../services/toml")
const router = express.Router()

router.get("/load/:id", async function (req, res, next) {
    try {
        const toml = tomlservice.read(req.params.id)
        res.send(toml)
    } catch (err) {
        console.error("error:", err.message)
        res.sendStatus(404)
    }
})

router.post("/save/:id", async function (req, res, next) {
    try {
        const contents = req.body.ed
        tomlservice.write(req.params.id, contents)
        res.send(`success: identifier "${req.params.id}" stored`)
    } catch (err) {
        console.error("error:", err.message)
        res.send(`error: identifier "${req.params.id}" could not be saved`)
    }
})

module.exports = router
