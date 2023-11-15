const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonbody'))

morgan.token('jsonbody', (req, res) => {
    if (req.headers['content-type'] !== 'application/json') {
        return null
    }
    return JSON.stringify(req.body, null, 2)
})

let persons = [
    {
        id: 1,
        name: "Antti A",
        number: "123-456789"
    },
    {
        id: 2,
        name: "Joonatan J",
        number: "456-789012"
    },
    {
        id: 3,
        name: "Veeti V",
        number: "789-012345"
    },
    {
        id: 4,
        name: "Niina N",
        number: "012-345678"
    },
    {
        id: 5,
        name: "Tarmo T",
        number: "345-678901"
    }
];


app.get('/', (req, res) => {
    res.send('<p>Welcome to the darkside</p>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (request, response) => {
    const len = persons.length
    const currentTime = new Date().toString()
    response.send(`<p>Puhelinluettelossa on ${len} tietoa</p>
                   <p>Date: ${currentTime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
        console.log(person.name)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    if (!persons.find(p => p.id === id)) {
        return response.status(404).json({
            error: 'Person not found'
        })
    }
    persons = persons.filter(person => person.id !== id)
    console.log('persons:', persons.map(p => p.id))
    response.status(204).end()

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})




