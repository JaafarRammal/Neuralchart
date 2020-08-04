const express = require('express')
const app = express()
const port = 3000

app.get('/download', (req, res) => {


    res.download('../scripts/example.py', 'model.py', (err) => {
        if (err) {
            res.send("Error!")
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})