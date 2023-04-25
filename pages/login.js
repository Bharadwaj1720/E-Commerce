// import { React, useEffect } from 'react'
// import { getProviders, getSession } from 'next-auth/react'
// import Router from 'next/router'
// import BtnLogin from '@/components/BtnLogin'

// const Login = ({ providers, session }) => {
//     console.log({ providers, session })

//     useEffect(() => {
//         if (session) Router.push('/');
//     }, [session])

//     if (session) return null;

//     return (
//         <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
//             <div style={{ maxWidth: '450px', width: '100%' }} className='border border-1 max-auto p-4 shadow'>
//                 <h2 className='text-center fw-bolder text-uppercase' style={{ color: '#555', letterSpacing: '1px' }}>
//                     Bharadwaj
//                 </h2>

//                 <p className='text-center'>Login by NextAuth</p>
//                 <BtnLogin
//                     provider={providers.google}
//                     bgColor='#f2573f' />

//                 <BtnLogin
//                     provider={providers.facebook}
//                     bgColor='#0404be' />

//                 <BtnLogin
//                     provider={providers.github}
//                     bgColor='#444' />
//             </div>
//         </div>
//     )


// }

// export default Login

// Login.getInitialProps = async (context) => {
//     return {
//         providers: await getProviders(context),
//         session: await getSession(context)
//     }
// }

import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Store } from '../utils/Store';
import axios from 'axios';
import { createGlobalState } from 'react-hooks-global-state'



const { getGlobalState, setGlobalState } = createGlobalState({
    email: ""
});

export { getGlobalState, setGlobalState };
export default function LoginScreen() {

    const { data: session } = useSession();

    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || '/');
        }
    }, [router, session, redirect]);


    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();
    const submitHandler = async ({ email, password }) => {
        setGlobalState("email", email);
        console.log(getGlobalState("email"))
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            if (result.error) {
                toast.error(result.error);
            }
        }
        catch (err) {
            toast.error(getError(err))
        }
    };
    return (
        <Layout title="Login">
            <form
                className="mx-auto max-w-screen-md"
                onSubmit={handleSubmit(submitHandler)}
            >
                <h1 className="mb-4 text-xl">Login</h1>
                <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'Please enter email',
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                message: 'Please enter valid email',
                            },
                        })}
                        className="w-full"
                        id="email"
                        autoFocus
                    ></input>
                    {errors.email && (
                        <div className="text-red-500">{errors.email.message}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        {...register('password', {
                            required: 'Please enter password',
                            minLength: { value: 6, message: 'password is more than 5 chars' },
                        })}
                        className="w-full"
                        id="password"
                        autoFocus
                    ></input>
                    {errors.password && (
                        <div className="text-red-500 ">{errors.password.message}</div>
                    )}
                </div>
                <div className="mb-4 ">
                    <button className="primary-button">Login</button>
                </div>
                <div className="mb-4 ">
                    Don&apos;t have an account? &nbsp;
                    <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
                </div>
            </form>
        </Layout>
    );
}