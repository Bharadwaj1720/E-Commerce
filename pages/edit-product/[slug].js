import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import data from '@/utils/data';
import { Store } from '@/utils/Store';
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
export default function ProductScreen(props) {
    const { state, dispatch } = useContext(Store);
    const router = useRouter();
    const { query } = useRouter();
    const { slug } = query;
    const product = data.products.find((x) => x.slug === slug);
    if (!product) {
        return <div>Produt Not Found</div>;
    }

    const addToCartHandler = () => {
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        if (product.countInStock < quantity) {
            alert('Sorry. Product is out of stock');
            return;
        }

        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        //router.push('/cart');
        router.push('../login?redirect=/cart')
    };


    const [form, setForm] = useState({
        email: "",
        name: product.name,
        slug: product.slug,
        category: product.category,
        url: product.image,
        price: product.price,
        brand: product.brand,
        rating: product.rating,
        review: product.numReviews,
        stock: product.countInStock,
        des: product.description,
        id: product.id
    });

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function Submit(e) {

        const session = await axios.get('/api/auth/session')
        form.email = session.data.user.email
        console.log(form)
        await axios.post("/api/edit_product", { data: form, flag: 1 }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
        router.push('../../admin/seller')


    }



    return (
        <Layout title={product.name}>

            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control placeholder={product.name} onChange={(e) => updateForm({ name: e.target.value })} />
                    <Form.Label>Product Slug</Form.Label>
                    <Form.Control placeholder={product.slug} onChange={(e) => updateForm({ slug: e.target.value })} />
                    <Form.Label>Product Category</Form.Label>
                    <Form.Control placeholder={product.category} onChange={(e) => updateForm({ category: e.target.value })} />
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control placeholder={product.image} onChange={(e) => updateForm({ url: e.target.value })} />

                    <Form.Label>Product Price</Form.Label>
                    <Form.Control placeholder={product.price} onChange={(e) => updateForm({ price: e.target.value })} />
                    <Form.Label>Product Brand</Form.Label>
                    <Form.Control placeholder={product.brand} onChange={(e) => updateForm({ brand: e.target.value })} />
                    <Form.Label>Product Rating</Form.Label>
                    <Form.Control placeholder={product.rating} onChange={(e) => updateForm({ rating: e.target.value })} />
                    <Form.Label>Product No.of.Reviews</Form.Label>
                    <Form.Control placeholder={product.numReviews} onChange={(e) => updateForm({ review: e.target.value })} />
                    <Form.Label>Stock</Form.Label>
                    <Form.Control placeholder={product.countInStock} onChange={(e) => updateForm({ stock: e.target.value })} />
                    <Form.Label>Product Description</Form.Label>
                    <Form.Control placeholder={product.description} onChange={(e) => updateForm({ des: e.target.value })} />
                </Form.Group>
                <Button variant="primary" style={{ color: 'black' }} onClick={Submit}>
                    Submit
                </Button>
            </Form>
        </Layout>
    );
}

