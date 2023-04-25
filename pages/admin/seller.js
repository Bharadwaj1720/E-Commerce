import Layout from "@/components/Layout";
import React from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import { getGlobalState } from "../login";
import axios from "axios";
import ItemCard from '@/components/ItemCard';
import { useEffect, useReducer } from 'react';
import { getError } from '../../utils/error';
import Link from 'next/link';


export default function seller() {
    const [add, setadd] = useState(false)
    const [update, setupdate] = useState(false)
    const [order, setorder] = useState(false)

    async function getProducts() {
        const { data } = await axios.get('/api/get_products');
        return data;

    }

    const [data, setData] = React.useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const temp = await getProducts(1);
            setData(temp);
        }

        fetchData();
    }, []);

    function changeBackground(e) {
        e.target.style.background = ' orange';
    }
    function rechangeBackground(e) {
        e.target.style.background = 'white';
    }

    const [form, setForm] = useState({
        email: "",
        name: "",
        slug: "",
        category: "",
        url: "",
        price: "",
        brand: "",
        rating: "",
        review: "",
        stock: "",
        des: ""
    });

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    async function Submit(e) {
        const session = await axios.get('/api/auth/session')
        form.email = session.data.user.email
        await axios.post("/api/add_products", form).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })


    }


    function reducer(state, action) {
        switch (action.type) {
            case 'FETCH_REQUEST':
                return { ...state, loading: true, error: '' };
            case 'FETCH_SUCCESS':
                return { ...state, loading: false, orders: action.payload, error: '' };
            case 'FETCH_FAIL':
                return { ...state, loading: false, error: action.payload };
            default:
                return state;
        }
    }




    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        orders: [],
        error: '',
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.post('/api/orders/history', { flag: 1 });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchOrders();
    }, []);

    async function deliver(id) {
        console.log(id)
        await axios.post('/api/orders/history', { flag: 2, order: id });




    }


    return (
        <Layout>
            <h1>
                <div style={{ textAlign: "center", fontSize: 50 }}>Welcome Seller {getGlobalState("email")} </div><Badge bg="secondary" ></Badge>
            </h1>
            <ListGroup as="ul">
                <ListGroup.Item as="li" onMouseOver={changeBackground} onMouseLeave={rechangeBackground} onClick={() => { setadd(true), setupdate(false), setorder(false) }}>
                    Add Item
                </ListGroup.Item>
                <ListGroup.Item as="li" onMouseOver={changeBackground} onMouseLeave={rechangeBackground} onClick={() => { setadd(false), setupdate(true), setorder(false) }}>Update Item</ListGroup.Item>
                <ListGroup.Item as="li" onMouseOver={changeBackground} onMouseLeave={rechangeBackground} onClick={() => { setadd(false), setupdate(false), setorder(true) }}>Order List</ListGroup.Item>

            </ListGroup>
            {add && (
                <div>
                    <br />
                    <Form onSubmit={Submit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control placeholder="Enter name" onChange={(e) => updateForm({ name: e.target.value })} />
                            <Form.Label>Product Slug</Form.Label>
                            <Form.Control placeholder="Enter slug" onChange={(e) => updateForm({ slug: e.target.value })} />
                            <Form.Label>Product Category</Form.Label>
                            <Form.Control placeholder="Enter Category" onChange={(e) => updateForm({ category: e.target.value })} />
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control placeholder="Enter image url" onChange={(e) => updateForm({ url: e.target.value })} />

                            <Form.Label>Product Price</Form.Label>
                            <Form.Control placeholder="Enter Price" onChange={(e) => updateForm({ price: e.target.value })} />
                            <Form.Label>Product Brand</Form.Label>
                            <Form.Control placeholder="Enter Brand" onChange={(e) => updateForm({ brand: e.target.value })} />
                            <Form.Label>Product Rating</Form.Label>
                            <Form.Control placeholder="Enter rating" onChange={(e) => updateForm({ rating: e.target.value })} />
                            <Form.Label>Product No.of.Reviews</Form.Label>
                            <Form.Control placeholder="Enter reviews" onChange={(e) => updateForm({ review: e.target.value })} />
                            <Form.Label>Stock</Form.Label>
                            <Form.Control placeholder="Enter Stock" onChange={(e) => updateForm({ stock: e.target.value })} />
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control placeholder="Enter description" onChange={(e) => updateForm({ des: e.target.value })} />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ color: 'black' }}>
                            Submit
                        </Button>
                    </Form>
                </div>
            )}
            {/* {
                del && (<div>
                    <br />
                    <Form onSubmit={Submitdel}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control placeholder="Enter name" onChange={(e) => updateForm({ name: e.target.value })} />
                            <Form.Label>Product Brand</Form.Label>
                            <Form.Control placeholder="Enter name" onChange={(e) => updateForm({ brand: e.target.value })} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>)
            } */

                update && (<div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                    {data.map((product) => (<ItemCard product={product} key={product.slug}></ItemCard>))
                    }

                </div>)


            }
            {
                order && (<div>

                    <h1 className="mb-4 text-xl">Order History</h1>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">ID</th>
                                        <th className="p-5 text-left">DATE</th>
                                        <th className="p-5 text-left">TOTAL</th>
                                        <th className="p-5 text-left">PAID</th>
                                        <th className="p-5 text-left">DELIVERED</th>
                                        <th className="p-5 text-left">ACTION</th>
                                        <th className="p-5 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-b">
                                            <td className=" p-5 ">{order._id.substring(20, 24)}</td>
                                            <td className=" p-5 ">{order.createdAt.substring(0, 10)}</td>
                                            <td className=" p-5 ">${order.totalPrice}</td>
                                            <td className=" p-5 ">
                                                Yes
                                            </td>
                                            <td className=" p-5 ">
                                                {order.isDelivered
                                                    ? "Delivered"
                                                    : 'not delivered'}
                                            </td>
                                            <td className=" p-5 ">
                                                <Link href={`/order/${order._id}`} passHref>
                                                    Details
                                                </Link>
                                            </td>
                                            <td className=" p-5 " >

                                                {order.isCanceled &&
                                                    (<Button style={{ color: 'black', backgroundColor: 'red' }}>
                                                        Cancelled
                                                    </Button>)
                                                }{!order.isDelivered && !order.isCanceled &&
                                                    (<Button style={{ color: 'black', backgroundColor: 'red' }} onClick={() => { deliver(order._id) }}>
                                                        Deliver
                                                    </Button>)
                                                }
                                                {order.isDelivered && !order.isCanceled &&
                                                    (<Button style={{ color: 'black', backgroundColor: 'green' }} onClick={() => { deliver(order._id) }} >
                                                        Delivered
                                                    </Button>)
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}


                </div>)
            }
        </Layout >
    )

}