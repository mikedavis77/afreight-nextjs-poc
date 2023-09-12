export async function getServerSideProps({query}) {
  const { products } = query;
  const product = products.pop();

  const data = {
    title: product,
    description: 'Hello world'
  }

  return {
    props: {
      data
    }
  }
}

/**
 * Product Detail Page
 * @param {} param0
 * @returns
 */
function ProductDetailPage({ data }) {
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}

export default ProductDetailPage;