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



    const [form, setForm] = useState({
        id: "",
        isenabled: 0,
        coupon_number: "",
        discount: 0
    });

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    async function Submit(e) {
        console.log(form)
        await axios.post("/api/get_coupon", { data: form, flag: 2 }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })


    }


    return (
        <Layout>
            <h1>
                <div style={{ textAlign: "center", fontSize: 50 }}>Welcome Advertiser </div><Badge bg="secondary" ></Badge>
                <div style={{ textAlign: "center", fontSize: 50 }}>Add Coupons </div><Badge bg="secondary" ></Badge>
            </h1>

            <div>
                <br />
                <Form onSubmit={Submit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Product ID</Form.Label>
                        <Form.Control placeholder="Enter Product ID" onChange={(e) => updateForm({ id: e.target.value })} />
                        <Form.Label>Coupon</Form.Label>
                        <Form.Select placeholder="Enter slug" onChange={(e) => updateForm({ isenabled: e.target.value })} >
                            <option value={0}>Disabled</option>
                            <option value={1}>Enabled</option>
                        </Form.Select>

                        <Form.Label>Coupon Number</Form.Label>
                        <Form.Control placeholder="Enter Coupon number" onChange={(e) => updateForm({ coupon_number: e.target.value })} />
                        <Form.Label>Discount Percentage</Form.Label>
                        <Form.Control placeholder="Enter Discount" type="number" max={100} min={0} onChange={(e) => updateForm({ discount: e.target.value })} />
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{ color: 'black' }}>
                        Submit
                    </Button>
                </Form>
            </div>

        </Layout >
    )

}