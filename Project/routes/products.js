const express = require('express');
const router = express.Router();

const Product = require('../models/Product');


router.get('/', async (req, res) => {
  const products = await Product.find({});

  try {
    res.send(products);
  } catch (error) {
    res.status(500).send("Error: "+error);
  }
});

router.post('/', async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    await newProduct.save();
    res.send(newProduct);
  } catch (error) {
    res.status(500).send("Error: "+error+"\n Required data:\n"+'nazwa: {type:String,require:true},\n\
    cena: {type:Number,require:true, min:0.01},\n\
    opis:{type:String,default:"",require:false},\n\
    ilosc:{type:Number,require:true, min:0},\n\
    jednostkaMiary:{type:String,require:true}\n');
  }
});
router.get('/:id', async (req, res) => {
  let product = await Product.findById(req.params.id)
  try {
    if(product==null)
    {
      res.send("No item with such id in database.")
    }
    res.send(product)
  } catch (error) {
    res.status(500).send("Error: "+error);
  }
});
router.put('/:id', async (req, res) => {
  try {
    let deletedProduct = await Product.findById(req.params.id);
    const body=req.body;
    await Product.findByIdAndUpdate(req.params.id, req.body);
    //await Product.save();
    res.send(body);
  } catch (error) {//4. (15%) Sprawdź czy podana nazwa produktu jest unikalna. I resolved it by adding unique value in schema.
    res.status(500).send("Error: "+error+"\n Required data:\n"+'nazwa: {type:String,require:true},\n\
    cena: {type:Number,require:true, min:0.01},\n\
    opis:{type:String,default:"",require:false},\n\
    ilosc:{type:Number,require:true, min:0},\n\
    jednostkaMiary:{type:String,require:true}\n');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let deletedProduct = await Product.findById(req.params.id);
    await Product.findByIdAndDelete(req.params.id)
    //6. (15%) Jeśli produkt jest obecnie w magazynie,
    if(deletedProduct==null)
    {
      res.send("No item with such id in database.")
    }
    //należy sprawdzić czy możliwe jest usunięcie go (np. czy nie jest w trakcie realizacji zamówienia).
    if (deletedProduct.czyWTrakcieRealizacji==true) res.status(404).send("Item is in progress of shipping. Can't delete. It must be modified first.");
    res.status(200).send(deletedProduct);
  } catch (error) {
    res.status(500).send("Error: "+error);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    await Product.save();
    res.send(req.body);
  } catch (error) {
    res.status(500).send("Error: "+error+"\n Required data:\n"+'nazwa: {type:String,require:true},\n\
    cena: {type:Number,require:true, min:0.01},\n\
    opis:{type:String,default:"",require:false},\n\
    ilosc:{type:Number,require:true, min:0},\n\
    jednostkaMiary:{type:String,require:true}\n');
  }
});


module.exports = router;
