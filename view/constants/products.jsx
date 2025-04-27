// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { apiUrl } from '../src/lib/apis';

// const fetchProducts = async () => {
//   const response = await axios.get(`${apiUrl}/products`);
//   return response.data;  
// };

// const useProducts = () => {
//   const { data: products = [], isLoading, error } = useQuery({
//     queryKey: ['products'],
//     queryFn: fetchProducts,  
//     staleTime: 5 * 60 * 1000,  
//   });

//   const availableProducts = products.filter((product) => product.stock > 0);
//   const popularProds = availableProducts.filter((product) => product.popular);

//   return { products: availableProducts, loading: isLoading, error, popularProds };
// };

// export default useProducts;


import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '../src/lib/apis';

const fetchProducts = async () => {
  const response = await axios.get(`${apiUrl}/products`);
  return response.data.map(product => ({
    ...product,
    mainImage: product.images.find(img => img.isMain)?.imageUrl || 
               product.images[0]?.imageUrl
  }));
};

const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // Pre-cache individual product data
      data.forEach(product => {
        queryClient.setQueryData(
          ['product', product.prodId],
          product
        );
      });
    }
  });

  // Filter available and popular products
  const availableProducts = products.filter(p => p.stock > 0);
  const popularProds = availableProducts.filter(p => p.popular);

  return { 
    products: availableProducts,
    loading: isLoading,
    error,
    popularProds
  };
};

export default useProducts;