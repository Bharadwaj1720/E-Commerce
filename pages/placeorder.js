import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';

export default function PlaceOrderScreen() {
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { cartItems, shippingAddress, paymentMethod, card } = cart;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

    const itemsPrice = round2(
        cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    ); // 123.4567 => 123.46

    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    const router = useRouter();
    useEffect(() => {
        if (!paymentMethod) {
            router.push('/payment');
        }
    }, [paymentMethod, router]);

    const [loading, setLoading] = useState(false);
    const Wno = Date.now() % 5 + 1
    const placeOrderHandler = async () => {

        console.log(cartItems[0].email)
        const cus_data = await axios.post("/api/get_card/", { data: card, flag: 1 })
        console.log(cus_data.data)
        if (cus_data.data.balance < totalPrice) {
            return toast.error('Not enough money');
        }
        else {
            const new_balance = cus_data.data.balance - totalPrice + shippingPrice
            await axios.post("/api/get_card", { data_cus: card, flag: 2, balance: new_balance, data_sel: cartItems[0].email, commission: shippingPrice })


            for (let i = 0; i < cartItems.length; i++) {
                await axios.post("/api/edit_product", { data: cartItems[i], flag: 2 })

            }


            try {
                setLoading(true);
                // console.log(cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice)
                const currsession = await axios.get('./api/auth/session')
                console.log(currsession)
                const send = {
                    orderItems: cartItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                    wareHouse: Wno,

                }
                for (let i = 0; i < send.orderItems.length; i++) {
                    send.orderItems[i].email_sel = cartItems[i].email
                    send.orderItems[i].email_cus = currsession.data.user.email
                    send.orderItems[i].id = cartItems[i].id
                }

                const { data } = await axios.post('/api/orders', { send, currsession });
                setLoading(false);
                dispatch({ type: 'CART_CLEAR_ITEMS' });
                Cookies.set(
                    'cart',
                    JSON.stringify({
                        ...cart,
                        cartItems: [],
                    })
                );
                toast.success('Order Placed successfully');
                router.push(`/order/${data._id}`);
            } catch (err) {
                setLoading(false);
                toast.error(getError(err));
            }

        }




    };


    return (
        <Layout title="Place Order">
            <CheckoutWizard activeStep={3} />
            <h1 className="mb-4 text-xl">Place Order</h1>
            {cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link href="/">Go shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Shipping Address</h2>
                            <div>
                                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                                {shippingAddress.country}
                            </div>
                            <div>
                                <Link href="/shipping">Edit</Link>
                            </div>
                        </div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Payment Method</h2>
                            <div>{paymentMethod}</div>
                            <div>
                                <Link href="/payment">Edit</Link>
                            </div>
                        </div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Dispatched From</h2>
                            <div>Warehouse {Wno}</div>
                        </div>
                        <div className="card overflow-x-auto p-5">
                            <h2 className="mb-2 text-lg">Order Items</h2>
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">Item</th>
                                        <th className="    p-5 text-right">Quantity</th>
                                        <th className="  p-5 text-right">Price</th>
                                        <th className="p-5 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item._id} className="border-b">
                                            <td>
                                                <Link href={`/product/${item.slug}`} className="flex items-center">

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
                                            <td className=" p-5 text-right">{item.quantity}</td>
                                            <td className="p-5 text-right">${item.price}</td>
                                            <td className="p-5 text-right">
                                                ${item.quantity * item.price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                                <Link href="/cart">Edit</Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Order Summary</h2>
                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Items</div>
                                        <div>${itemsPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Tax</div>
                                        <div>${taxPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Shipping</div>
                                        <div>${shippingPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Total</div>
                                        <div>${totalPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        disabled={loading}
                                        onClick={placeOrderHandler}
                                        className="primary-button w-full"
                                    >
                                        {loading ? 'Loading...' : 'Place Order'}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

PlaceOrderScreen.auth = true;