import React, { useEffect, useState } from 'react';
import fakeData from '../../fakeData';
import { getDatabaseCart, processOrder, removeFromDatabaseCart } from '../../utilities/databaseManager';
import Card from '../Headers/card/Card';
import ReviewItem from '../ReviewItme/ReviewItem';
import './Review.css';
import HappyImage from '../../images/giphy.gif';
import './Review.css';
import { useHistory } from 'react-router';
const Review = () => {
    const [cart,setcart]=useState([]);
    const [placeorder,setplaceorder]=useState(false);
    const history=useHistory();
    useEffect(()=>{
        const savecart=getDatabaseCart();
        const productkey=Object.keys(savecart);
        fetch('https://blooming-brook-15210.herokuapp.com/productByKey',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(productkey)
        })
        .then(res=>res.json())
        .then(data=>{
            const productcart= productkey.map(key=>{
                const cartproducts=data.find(pd=>pd.key===key);
                cartproducts.quantity=savecart[key];
                return cartproducts;
            })
            setcart(productcart);
        })
    },[])
    const removeproduct=(keys)=>{
        const newcart=cart.filter(pd=>pd.key!==keys);
        setcart(newcart);
        removeFromDatabaseCart(keys)
    }
    const handleProceedCheckOut=()=>{
       history.push('/shipment');
    }
    // setcart([]);
    // processOrder();
    // setplaceorder(true);
    let happyorder;
    if(placeorder){
        happyorder=<img src={HappyImage} alt=''></img>
    }
    return (
        <div className='shop-container'>
            <div className='product-container'>
                {
                    cart.map(pd=><ReviewItem key={pd.key} removeproduct={removeproduct} product={pd}></ReviewItem>)
                }
                {
                    happyorder
                }
            </div>
            <div className='card-container'>
                    <Card card={cart}>
                        <button className='mainButton' onClick={handleProceedCheckOut}>
                            ProceedCheckOut
                        </button>
                    </Card>
            </div>
        </div>
       
    );
};

export default Review;