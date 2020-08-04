
const express = require('express')
const generateScript = require('./scriptGeneration')
const app = express()
const cors = require('cors');
app.use(cors())
app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
    res.send("Script generation service")
})

app.post('/download', (req, res) => {
    console.log(req)
    generateScript(req.body)
    res.header("Content-Type", "text/x-python")
    res.download('../scripts/example.py', 'model.py', (err) => {
        if (err) {
            res.send("Error!")
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})