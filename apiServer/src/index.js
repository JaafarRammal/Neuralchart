
const express = require('express')
const generateScript = require('./scriptGeneration')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send("Script generation service")
})

app.post('/download', (req, res) => {
    generateScript(req.body)
    res.download('../scripts/example.py', 'model.py', (err) => {
        if (err) {
            res.send("Error!")
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})