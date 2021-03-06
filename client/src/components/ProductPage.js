import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UserContext } from './UserProvider';

export default function ProductView() {


    const user = useContext(UserContext);
    const { id } = useParams();
    const [stock, setStock] = useState({});
    const [input, setInput] = useState([]);
    const [sizeList, setSizeList] = useState([]);
    const [sizes, setSizes] = useState({});
    const [item, setItem] = useState([]);
    const [images, setImages] = useState([]);
    const [largeImage, setImage] = useState('');
    const [isStock, setIsStock] = useState([]);
    const [isStockList, setStockList] = useState([]);
    const [valid, setValid] = useState(false);
    
    let arr = [];

    useEffect(async () => //initial
    {
        let result = await axios.get(`http://localhost:3001/product/${id}`);
        setItem(result.data);

        setImages(result.data.productImages);
        setImage(result.data.productImages[0]);
        const object = result.data.productSizes;
        if (object) {
            for (const [key] of Object.entries(object)) {
                arr.push(key);
            }
        }
        setSizeList(arr);
        setStock(result.data.productSizes);
    }, []);

    function changeImage(event) {
        const myimg = event.target.name;
        setImage(myimg);
    }


    function handleSizeChange(event) {
        const { name, value } = event.target;
        if (stock[name] < value) {
            setValid(false)
            // setIsStock(" ממידה " + name + " קיימים רק " + stock[name] + " פריטים במלאי ")
            if(!isStockList.includes( " ממידה " + name + " קיימים רק " + stock[name] + " פריטים במלאי "))
            setStockList([...isStockList, " ממידה " + name + " קיימים רק " + stock[name] + " פריטים במלאי "])
        }
        else {
            setValid(true);
            console.log(sizes);
            for (const size in sizes) {
                if (stock[size] < sizes[size]) {
                    setValid(false);
                    console.log(stock[size] ,"----" ,sizes[size])
                }
            }
            console.log(" ממידה " + name + " קיימים רק " + stock[name] + " פריטים במלאי ");
            const filteredRows = isStockList.filter((row) => {
                return !row.includes(" ממידה " + name + " קיימים רק " + stock[name] + " פריטים במלאי ");
            });
            console.log(isStockList);
            setStockList(filteredRows);
            setIsStock("")
            
        }
        setSizes(prevState => {
                return {
                    ...prevState,
                    [name]: parseInt(value, 10)
                }
            });
    }

    function getPrice(sizes) {
        let sum = 0;
        for (const size in sizes) {
            sum += parseFloat(sizes[size], 10);
        }
        let price = item.productSale ? item.productSalePrice : item.productPrice;
        let sumPrice = sum * price;
        return sumPrice;
    }


    // function getSumPrice(products) {
    //     var sum = 0;
    //     products.forEach(p => {
    //         sum += getPrice(p.productId, p.psizes);
    //     })
    //     return sum;
    // }
    function getStock(stock, sizes) {
        for (const size in sizes) {
            stock[size] = stock[size] - sizes[size];
        }
        console.log("stock: ", stock);

        return stock;

    }
    const getNewStock = async (sizes, productId) => {
        let result = await axios.get(`http://localhost:3001/product/${productId}`);
        result = result.data.productSizes;
        for (const size in sizes) {
            result[size] = result[size] - sizes[size];
        }
        return result;
    }

    const getAmount = async (sizes, productId) => {
        let result = await axios.get(`http://localhost:3001/product/${productId}`);
        result = result.data.productSales;
        console.log(result, "---", sizes);
        for (const size in sizes) {
            result[size] = result[size] + sizes[size];
        }
        return result;
    }

    const createOrder = async (event) => {
        event.preventDefault();
        console.log(item);

        const newOrder = {
            customerId: user.id,
            date: Date(),
            products: [{
                productId: id,
                psizes: sizes,
                price: item.productSale === true ? item.productSalePrice : item.productPrice,
                newStock: await getNewStock(sizes, id)
            }],
            totalPrice: getPrice(sizes),
            status: 'בטיפול',

        } 
        if (sizes) {
                console.log("s",sizes);
                item.newStock = await getNewStock(sizes, id);
                const newStock = { newStock: await getNewStock(sizes, id) };
                const res1 = await axios.post(`http://localhost:3001/product/updateStock/${id}`, newStock);
                const amount = { amount: await getAmount(sizes, id) };
                console.log(amount);
                const res2 = await axios.post(`http://localhost:3001/product/updateSales/${id}`, amount);
                console.log("item", item, "\n res1: ", res1, "\n res2: ", res2);

            } else {
                alert(" לא נבחרו מידות עבור " +  item.productName )
            }
        
        console.log(newOrder);
        const res = await axios.post('http://localhost:3001/order/create', newOrder);

        if (res.data === true) {
            alert("הזמנה בוצעה בהצלחה");
        }
        if (res.data === false) {
                     alert("שגיאה בביצוע הזמנה");

        }
        window.location.reload(false);
    }

    const addToCart = async (event) => {
        event.preventDefault();
        const req = {
            product: {
                productId: id,
                psizes: sizes,
                price: item.productSale ? item.productSalePrice : item.productPrice
            }
        }
        console.log(req);
        const res = await axios.post(`http://localhost:3001/cart/addToCart/${user.id}`, req);

        if (res.data === true) {
            alert("הזמנתך בוצעה בהצלחה");
        }
        if (res.data === false) {
            alert("שגיאה בביצוע הזמנה");

        }
        window.location.reload(false);
    }


    return (
        <div className="container">
            <div className="bg-white product-image">
                <div className="row">
                    <aside className="col-lg-1"></aside>
                    <aside className="col-lg-5 col-md-5 col-sm-12">
                        <article className="gallery-wrap">
                            <div className="img-big-wrap">
                                <div className="d-flex justify-content-center"> <a href="#"><img src={largeImage} style={{ maxWidth: "100%" }} /></a></div>
                            </div>
                            <div className="d-flex justify-content-center img-small-wrap p-0">
                                {
                                    images.map((image, index) =>
                                        <div key={`img${index}`} className="item-gallery" >
                                            <img src={image} onClick={changeImage} name={image} />
                                        </div>)
                                }

                            </div>
                        </article>
                    </aside>
                    <aside className="col-lg-6 col-md-7 col-sm-12">
                        <article className="card-body">
                            <h1 className="price">{item.productName}</h1>
                            <p className="price-detail-wrap price">
                                {item.productSale ?
                                    <div className="d-flex"><p className="text-decoration-line-through">  ₪{item.productPrice}</p> &nbsp; ₪{item.productSalePrice}</div>
                                    : <div className="d-flex">₪{item.productPrice}</div>}
                            </p>
                            <dl className="item-property">
                                <p>{item.productDescribe}</p>
                            </dl>


                            <h4 className="price">מידות</h4>
                            <div>

                                {
                                    sizeList.map((size) =>
                                        <span key={size} className="form-check">
                                            <label className="form-check-label"> {size}</label>
                                            <input onChange={handleSizeChange}
                                                name={size}
                                                type="number" min="0" step="1" max={stock[size]}
                                                value={input.size}
                                                className="form-control"
                                                id="rounded"
                                                placeholder="כמות" style={{ width: "80px" }}
                                            />
                                        </span>

                                    )
                                }
                                {
                                    isStockList.map((warning)=><p className="mt-3">{warning}</p>)
                                }
                                
                            </div>

                            <div className="item-buttons">
                                <button href="#" className="btn btn-block ms-3 turkiz" onClick={addToCart} disabled={!valid}> הוספה לעגלה </button>
                                <button href="#" className="btn btn-block pink" onClick={createOrder} disabled={!valid}> הזמנה </button>
                            </div>

                        </article>
                    </aside>
                </div>
            </div>
        </div >
    );
}