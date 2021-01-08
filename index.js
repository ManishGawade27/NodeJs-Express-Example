const Joi = require('joi');
const express = require('express');
const app = express();

// // gives these methods 
// app.get();
// app.put();
// app.post();
// app.delete();

app.use(express.json());

const validateCourse = (course) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}

const courses = [
    {
        id: 1,
        name: "Algo"
    },
    {
        id: 2,
        name: "Data Structure"
    }
];

app.get('/', (req, res) => {
    res.send("Hellow Manish");
})

app.get('/api', (req, res) => {
    res.send([1, 2, 3]);
})


//returns an object of parameter that u have passed in endpoint
app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
})

//returns a query parameter  that u have passed in endpoint
//  /api/shoes?order=desc&shoe[color]=blue&shoe[type]=converse
app.get('/api/shoes', (req, res) => {
    // res.send(req.query.shoe);
    // res.send(req.query.order);
    res.send(req.query.shoe.type);
})


//returns an course id
app.get('/api/courses', (req, res) => {
    res.send(courses);
})


//returns an course having given id
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c =>
        c.id === parseInt(req.params.id)
    );
    if (!course) res.status(404).send("Invalid Course Id");
    res.send(course);
})

//create a new course using body 
app.post('/api/courses', (req, res) => {
    // //without validation
    // if (!req.body.name || req.body.name.length < 3) {
    //     //400 bad request
    //     res.status(400).send("Name is required and must have at least 4 characters");
    //     return;
    // }

    //with JOI validation
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const result = schema.validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

//create a new course using query parameter
app.post('/api/courses/query', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.query.name
    }
    courses.push(course);
    res.send(course);
})

//update Course
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c =>
        c.id === parseInt(req.params.id)
    );
    if (!course) return res.status(404).send("Invalid Course Id");

    const { error } = validateCourse(req.body); // result.error obj destructuring
    if (error)  return res.status(400).send(error.details[0].message);
        
    course.name = req.body.name;
    res.send(course);
})

//delete Course
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c =>
        c.id === parseInt(req.params.id)
    );
    if (!course) return res.status(404).send("Invalid Course Id");

    const ind = courses.indexOf(course);
    courses.splice(ind, 1);
    res.send(course);
})


app.listen(3000, () => {
    console.log("Server Is Ready At localhost:3000");
})