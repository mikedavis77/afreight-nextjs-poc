import Link from 'next/link';


export default function Home() {
  return (
    <div>
      <h1>Algolia NextJS Example</h1>
      <p>Non-prod code, just a reference!</p>
      <Link href="/algolia">
       Search Bar + Search Results experience.
      </Link>
    </div>
  );
}