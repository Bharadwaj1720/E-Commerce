import React from 'react'
import Layout from '../components/Layout';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ProductItem from '@/components/ProductItem';
const axios = require('axios');
import { useEffect } from 'react';










const Home = ({ products, featuredProducts }) => {


  const [data, setData] = React.useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const temp = await getProducts(1);
      setData(temp);
    }

    fetchData();
  }, []);




  return (
    <Layout title="Home Page">
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {data.map((product) => (<ProductItem product={product} key={product.slug}></ProductItem>))
        }

      </div>
    </Layout>
  );
}


async function getProducts() {
  const { data } = await axios.get('/api/get_products');
  return data;

}
export default Home;