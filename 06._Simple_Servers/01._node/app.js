import express from "express"

const app = express()

app.get("/", () => {
    res.send({ data: "Route"})
})

app.listen(3000)