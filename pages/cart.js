import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;


  async function handle() {
    const currsession = await axios.get('/api/auth/session')
    await axios.post('http://localhost:3000/api/cart_db', { email: currsession.data.user.email, cart: cartItems }).then((response) => { console.log(response); }, (errorMonitor) => { console.log(errorMonitor); });
  }


  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });




  };
  const updateCartHandler = (item, qty) => {
    console.log(qty);
    const quantity = Number(qty);
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });


  };
  useEffect(() => { handle() }, [cartItems]);



  const [Gcoupon, setcoupon] = useState("")
  const updateCouponHandler = async (item, qty) => {
    let coupon = await axios.post("./api/get_coupon", { flag: 1, id: item.id })
    coupon = coupon.data
    console.log(coupon)
    if (!coupon.iscoupon) {
      toast.error("Coupon is not enabled")
    }
    else {
      if (Gcoupon == coupon.coupon) {
        toast.success("Coupon is applied")
        item.price = (1 - coupon.discount) * item.price
        const quantity = Number(qty);
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });

      }
      else {
        toast.error("Coupon is invalid")
      }
    }


  }

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Coupon</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/product/${item.slug}`}
                        className="flex items-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        ></Image>
                        &nbsp;
                        {item.name}

                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-right"><input placeholder="Enter Coupon" onChange={(e) => setcoupon(e.target.value)}></input> <Button style={{ color: 'black' }} onClick={() => updateCouponHandler(item, item.quantity)}>Check</Button></td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push('login?redirect=/shipping')}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}


//export default CartScreen;
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });