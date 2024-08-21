const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// parse the data of any request to js object

app.use(express.static('dist'))

app.use(cors())

app.use(express.json())


morgan.token('type', function (req, res) { return JSON.stringify(req.body)})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :type"))

let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons' , (req ,res) => {
    res.send(persons)
})

app.get('/info' , (req ,res) => {
    const date = Date();
    res.send(`
        <div>
            <p>the phone have info for ${persons.length} people</p>
            <br/>
            <p>${date}</p>
        </div>`
    )
})

app.get('/api/persons/:id' , (req , res) => {
    const id = req.params.id
    const person = persons.find(pers => pers.id == id)
    
    if (!person) {
        res.status(404).json({ error: 'Person not found' });
    }else {
        res.json(person)
    }

})

app.delete('/api/persons/:id' , (req , res) => {
    const id = req.params.id

    const person = persons.filter(pers => pers.id != id)

    if (person.length == persons.length) {
        res.status(404).json({'error' : 'person not found'})
    }else {
        persons = person
        res.status(204).end()
    }
})


app.post('/api/persons' , (req , res) => {
    const newPerson = req.body;

    if (!newPerson.name) {
        return res.status(400).json({'error' : 'you must give me the name of the number owner'})
    }

    if (!newPerson.number) {
        return res.status(400).json({'error' : 'you must give me the number of the person'})
    }

    if ((persons.filter(per => per.name == newPerson.name)).length == 1) {
        return res.status(400).json({'error' : 'the name is already exist'})
    }

    const newPersonObject = {
        name : newPerson.name,
        number : newPerson.number,
        id : String(Math.floor(Math.random() * 1000))
    }

    persons = [...persons , newPersonObject]

    res.json(newPersonObject)

})

const port = 3001;

app.listen(port);
console.log(`server running on port ${port}`)
