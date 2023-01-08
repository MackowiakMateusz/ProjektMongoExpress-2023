const { Schema, model } = require('mongoose');

// Schema domyślnie dodaje unikalne pole _id, dlatego pomijamy je w deklaracji
const productSchema = new Schema({
    nazwa: {type:String,require:true,unique:true},//4. (15%) Sprawdź czy podana nazwa produktu jest unikalna.
    cena: {type:Number,require:true, min:0.01},
    opis:{type:String,default:"",require:false},
    ilosc:{type:Number,require:true, min:0},
    jednostkaMiary:{type:String,require:true},
    czyWTrakcieRealizacji:{type:Boolean,default:false,require:false},
},{collection: 'products'});

module.exports = model('Product', productSchema);