const express = require("express")
const path = require("path")
const rw = require("./routes/rw")
const app = express()
const port = 5000

app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.static(path.join(__dirname, "public")))
app.use("/rw", rw)

app.get("/", (req, res) => {
    res.redirect("/editor.html")
})

app.listen(port, function () {
    console.log(`Listening on port ${port} ...`)
})

module.exports = app
