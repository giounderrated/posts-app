import express from 'express';
import { mongoose } from 'mongoose';
import { User } from './models/User.model.js';

const app = express()
const port = 3000


const connectionURL = {place-your-url-here}// Change this based on your database connection


mongoose
  .connect(connectionURL)
  .then(() => {
    console.info("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
  });


const loginPath = '/login'
const registerPath = '/register'

app.use(express.json())

app.get('/', (req, res) => {

  const user = {
    name : 'Giovani',
    email: 'giovani@gmail.com',
    age:24
  }
  res.send(user)
})

app.post(loginPath, async(request, response)=>{

  const {email,password} = request.body 
  const user = await User.findOne({email})

  const exists = user!=null
  if(!exists){
    return response.status(401).json({
      error:'User does not exist'
    })
  }

  const passwordIsCorrect = password === user.password

  if(!passwordIsCorrect){
    return response.status(401).json({
      error:'Invalid email or password'
    })
  }

  const userData = {
    id:user.id,
    email:user.email,
    firstname:user.firstname
  }

  response
  .status(200)
  .send(userData)

})

app.post(registerPath, async(request, response)=>{
    const email = request.body.email
    const password = request.body.password
    const firstname = request.body.firstname
    const lastname = request.body.lastname
    const phone = request.body.phone

    const newUser = new User({
      email,
      password,
      firstname,
      lastname,
      phone
    });

  const created = await newUser.save();
  response.status(201).json(created);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

