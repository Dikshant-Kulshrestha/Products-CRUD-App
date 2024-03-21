const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const Product = require('./models/product')
const { urlencoded } = require('body-parser')
const methodOverride = require('method-override')


mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
.then(()=> {
    console.log("Connection successful to MongoDB")
})
.catch(e => {
    console.log(`MongoDB connection Failed. Error ${e}`)
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


app.get('/products', async (req,res) => {
    const products = await Product.find()
    res.render('index', { products})
})

app.get('/products/new', (req,res) => {
    res.render('new')
})

app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body)
    console.log(newProduct)
    await newProduct.save()
    res.redirect('/products')
})

app.get('/products/:id', async (req,res) => {
    try{
    const {id} = req.params 
    const product = await Product.findById(id)
    res.render('show', {product})
    }
    catch(e) {
        res.send(`Error is ${e}`)
    }
})

app.get('/products/:id/edit', async (req,res) => {
        const {id} = req.params
        const product = await Product.findById(id)
        res.render('edit', {product})

})

app.put('/products/:id', async(req,res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/products/${product._id}`)
})

app.delete('/products/:id', async(req,res) => {
    const {id} = req.params;
    const deletedProd = await Product.findByIdAndDelete(id)
    console.log(deletedProd)
    res.redirect('/products')

})


app.get('/', (req,res)=> {
    res.send("Home")
})


app.listen(3000, ()=> {
    console.log("Listening on Port 3000")
})

