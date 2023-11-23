const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const newperson = process.argv[3]
const newnumber = process.argv[4]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.aqrqda0.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)
if (newperson && newnumber) {

  const person = new Person({
    name: newperson,
    number: newnumber,
  })

  person.save().then(result => {
    console.log(`added ${newperson} number ${newnumber} to phonebook`)
    mongoose.connection.close()
  })
} else {

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}