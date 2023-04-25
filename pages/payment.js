import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { usePaymentInputs } from 'react-payment-inputs'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter();

  const [form, setForm] = useState({
    card_number: "",
    card_name: "",
    card_cvv: ""
  });

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required');
    }

    console.log(form.card_number)
    const data = await axios.post("/api/get_card/", { data: form.card_number, flag: 1 })
    console.log(data.data)
    if (data.data != "") {
      const new_card_number = data.data.credit_card_number
      const new_card_name = data.data.name
      const new_card_cvv = data.data.cvv
      if (new_card_name == form.card_name && new_card_number == form.card_number && new_card_cvv == form.card_cvv) {
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod, card: new_card_number});
        Cookies.set(
          'cart',
          JSON.stringify({
            ...cart,
            paymentMethod: selectedPaymentMethod,
          })
        );
        router.push('/placeorder');
      }
      else {
        return toast.error('Information is invalid');
      }
    }
    else {
      return toast.error('Card number invalid');
    }


    // dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    // Cookies.set(
    //   'cart',
    //   JSON.stringify({
    //     ...cart,
    //     paymentMethod: selectedPaymentMethod,
    //   })
    // );

    // router.push('/placeorder');
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);

  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md">
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {["Debit Card"].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment}
              type="radio"
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />

            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}
        {
          selectedPaymentMethod != '' && (
            <Form>
              <Form.Group className="mb-3" >
                <Form.Label>Card Number</Form.Label>
                <Form.Control placeholder="Enter your card number" onChange={(e) => updateForm({ card_number: e.target.value })} />
                <Form.Text className="text-muted">
                  We'll never share your card number with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" c>
                <Form.Label>Name on card</Form.Label>
                <Form.Control placeholder="Enter your name" onChange={(e) => updateForm({ card_name: e.target.value })} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => updateForm({ card_cvv: e.target.value })} />
              </Form.Group>
            </Form>)
        }
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push('/shipping')}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button" onClick={submitHandler}>Next</button>
        </div>
      </form>
    </Layout>
  );
}

PaymentScreen.auth = true;