const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");


router.route("/create").post((req, res) => {

  console.log(req.body.productImages.length);

  const productName = req.body.productName;
  const productPrice = req.body.productPrice;
  const productCode = req.body.productCode;
  const productDescribe = req.body.productDescribe;
  const productCategories = req.body.productCategories;
  const productColors = req.body.productColors;
  const productImages = req.body.productImages;
  const productSizes = req.body.productSizes;
  const productSale = req.body.productSale;
  const productSales = req.body.productSales;
  const productSalePrice = req.body.productSalePrice;
  const productLikes = req.body.productLikes;

  const newProduct = new Product({
    productName,
    productPrice,
    productCode,
    productDescribe,
    productCategories,
    productColors,
    productImages,
    productSizes,
    productSale,
    productSalePrice,
    productLikes,
    productSales
  });

  newProduct.save();

});

router.get("/get", async (req, res) => {
  let products = await Product.find();
  res.send(products);
});


router.get(`/:id`, async (req, res) => {
  const id = req.params.id;
  console.log(req.params.id);
  let product = await Product.findOne({ _id: id });
  if (!product) return res.status(404).send("Sorry, there's no such product");
  return res.status(200).send(product);
});


router.get(`/getImage/:id`, async (req, res) => {
  const id = req.params.id;
  console.log(req.params.id);
  let product = await Product.findOne({ _id: id });
  if (!product) return res.status(404).send("Sorry, there's no such product");
  return res.status(200).send(product.productImages[0]);
});

router.route("/delete").post(async (req, res) => {
  try {
    const ids = req.body.items;
    const product = await Product.deleteMany({ _id: { $in: ids } });
    if (!product) return res.status(404).send(false);
    return res.status(200).send(true);
  }
  catch (err) {
    return res.status(200).send(err);
  }
});

router.get("/getItems").post(async (req, res) => {
  try {
    const ids = req.body.ids;
    const products = await Product.find({ _id: { $in: ids } });
    console.log(products);
    if (!products) return res.status(404).send(false);
    return res.status(200).send(true);
  }
  catch (err) {
    return res.status(200).send(err);
  }
});
module.exports = router;

router.post(`/updateLikes/:id`, async (req, res) => {
  const product = await Product.updateOne(
    { _id: req.params.id },
    [
      {
        $set: {
          productLikes: {
            $cond: [
              {
                $in: [req.body.user, "$productLikes"]
              },
              {
                $setDifference: ["$productLikes", [req.body.user]]
              },
              {
                $concatArrays: ["$productLikes", [req.body.user]]
              }
            ]
          }
        }
      }
    ]
  );
  if (!product)
    return res.status(404).send("Sorry, there's no such product");
  return res.status(200).send(true);
})

router.post('/updateStock/:id', async (req, res) => {
  const product = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        productSizes: req.body.newStock
      }
    }
  );
  if (!product)
    return res.status(404).send("Sorry, there's an issue");
  return res.status(200).send(true);
})

router.post('/updateSales/:id', async (req, res) => {
  console.log("updated", req.body.amount);
  const product = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        productSales: req.body.amount
      }
    }
  );
  if (!product)
    return res.status(404).send("Sorry, there's an issue");
  return res.status(200).send(true);
})

router.post(`/update/:id`, async (req, res) => {
  console.log("iiiiiiii");
  console.log(req.params.id);
  const product = await Product.updateOne(
    { _id: req.params.id },
    {
      $set:
      {
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productCode: req.body.productCode,
        productDescribe: req.body.productDescribe,
        productCategories: req.body.productCategories,
        productColors: req.body.productColors,
        productImages: req.body.productImages,
        productSizes: req.body.productSizes,
        productSale: req.body.productSale,
        productSales: req.body.productSales,
        productSalePrice: req.body.productSalePrice,
        productLikes: req.body.productLikes,

      }
    }
  );
  // console.log(product);
  if (!product)
    return res.status(404).send("Sorry, there's no such post");
  return res.send(true).status(200);
})

// router.post("/", async (req, res) => {
//   console.log(req.body);
//   try {
//     const newManager = new Manager({ ...req.body });
//     await newManager.save();
//     return res.send(newPost).status(200);
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });


// router.put("/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     let manager = await Manager.findOne({ _id: id });
//     if (!manager) return res.status(404).send("Sorry, there's no such post");
//     manager.name = req.body.name;
//     manager.password = req.body.password;

//     manager = await manager.save();
//     return res.send(manager).status(200);
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });

// router.delete("/:id", async (req, res) => {
//   const id = req.params.id;
//   const manager = await Manager.findOneAndDelete({ _id: id });
//   if (!manager) return res.status(404).send("Sorry, there's no such post");
//   return res.send(manager).status();
// });

