const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		return res.render('index',{
			visited : products.filter(products => products.category === 'visited'),
			sale: products.filter(products => products.category === 'in-sale'),
			toThousand
		})
	},
	search: (req, res) => {
		
		// Do the magic
		const keywords = req.query.Keywords
		const results = products.filter(product => product.name.includes(keywords));
		return res.send(results)
	return res.render('results',{
			results,
			toThousand,
			keywords
		})  
	},
};

module.exports = controller;
