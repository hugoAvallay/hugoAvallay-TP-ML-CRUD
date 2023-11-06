const fs = require('fs');
const path = require('path');
const db = require('../database/models');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		db.Product.findAll()
			.then(products => {
				return res.render('products', {
					products,
					toThousand
				})
			}).catch(error => console.log(error))
		
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		db.Product.findByPk(req.params.id)
			.then(product => {
				return res.render('detail',{
					...product.dataValues,
					toThousand
				})
			}).catch(error => console.log(error))
		
		
	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic

		db.Category.findAll()
			.then(categories => {
				console.log(categories);
				return res.render('product-create-form', {
					categories
				})
			})

		
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic

		const {name, price, description, discount,categoryId}  = req.body;

		db.Product.create({
			name : name.trim(),
			price,
			discount,
			categoryId,
			description : description.trim(),
			image : null
		})
			.then(product => {
				console.log(product);
				return res.redirect('/products')
			}).catch(error => console.log(error))

		
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic

		const categories = db.Category.findAll()

		const product = db.Product.findByPk(req.params.id)

		Promise.all([categories,product])
			.then(([categories,product]) => {
				return res.render('product-edit-form', {
					categories,
					...product.dataValues					
				})
			}).catch(error => console.log(error))
		
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const {name, price, description, discount,category}  = req.body;

		const productsModify = products.map(product => {
			
			if(product.id === +req.params.id){
				product.name = name.trim()
				product.price = +price
				product.discount = +discount
				product.category
				product.description = description.trim()
			}
			
			return product
		})

		fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'),JSON.stringify(productsModify,null,3))

		return res.redirect('/products')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		const productsModify = products.filter(product => product.id !== +req.params.id)
		fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'),JSON.stringify(productsModify,null,3))

		return res.redirect('/products')
	}
};

module.exports = controller;