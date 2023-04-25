import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function ItemCard({ product }) {

    async function Submitdel(e) {
        await axios.post("/api/del_products", { id: product.id }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })


    }



    return (
        <div className="card">
            <Link href={`/product/${product.slug}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="rounded shadow object-cover h-64 w-full"
                />
            </Link>
            <div className="flex flex-col items-center justify-center p-5">
                <Link href={`/product/${product.slug}`}>
                    <h2 className="text-lg">{product.name}</h2>
                </Link>
                <p className="mb-2">{product.brand}</p>
                <p>${product.price}</p>
                <button
                    className="primary-button"
                    type="button"
                    style={{ marginBottom: 10, marginTop: 10 }}

                ><Link href={`/edit-product/${product.slug}`}>

                        Edit
                    </Link>
                </button>

                <button
                    className="primary-button"
                    type="button"
                    style={{ marginBottom: 10, marginTop: 10, backgroundColor: '#ff0000' }}
                    onClick={Submitdel}
                >

                    Delete

                </button>
            </div>
        </div >

    );
}


