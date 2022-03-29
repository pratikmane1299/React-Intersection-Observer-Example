import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';

const TOTAL_PAGES = 10;

interface User {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    thumbnail: string;
  };
  location: {
    city: string;
    country: string;
  };
}

type SeoDetail = {
  title: string;
  description: string;
  keywords?: string;
}

function SiteSeo({ title, description, keywords }: SeoDetail) {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content={description}
      />
      <meta name='keywords' content={keywords} />
    </Head>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="flex rounded-lg bg-white px-4 py-4 shadow-lg">
      <div className="rounded">
        <img
          className="w-18 h-18 rounded-full border-2 border-red-200"
          alt={user.name.first}
          src={user?.picture?.thumbnail}
        />
      </div>
      <div className="d-flex ml-3 h-full flex-col items-center justify-center">
        <h3 className="text-base font-bold">{`${user?.name?.first} ${user?.name?.last}`}</h3>
        <span className="text-sm text-gray-800">{`${user?.location?.city} ${user?.location?.country}`}</span>
        <p className="text-ellipses text-sm text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
}

const Home: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const loadingRef = useRef<null | HTMLDivElement>(null);

  async function fetchUsers(page: number) {
    setLoading(true);
    const res = await fetch(`https://randomuser.me/api/?page=${page}&results=25&seed=test`)
      .then(res => res.json())
    
    setUsers([...users, ...res.results]);
    setLoading(false);
  }

  useEffect(() => {
    if (page <= TOTAL_PAGES)
      fetchUsers(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPage(page => page + 1);
      }
    });

    if (loadingRef && loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    return () => {
      if (observer && loadingRef && loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    }
  }, [loadingRef]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SiteSeo
        title="Intersection Observer Example"
        description="Building a infinite scroll with intersection observer"
        keywords="react.js, next.js, react, intersection observer, infinite scroll."
      />

      <header className="h-15 w-full border-b py-5 text-center shadow-sm md:px-20">
        <h1 className="text-2xl font-semibold md:text-4xl">
          Infinite scroll with intersection observer
        </h1>
      </header>
      <main className="flex w-full flex-1 flex-col items-center justify-center">
        {users.length > 0 && (
          <div className="my-10 grid grid-flow-row-dense grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {users.map((user, index) => (
              <UserCard key={`User-${index + 1}`} user={user} />
            ))}
          </div>
        )}

        <div ref={loadingRef} className="h-16 w-full text-center">
          {loading && <span>Loading...</span>}
          {page - 1 === TOTAL_PAGES && <span>✋, Take a breath.</span>}
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://github.com/pratikmane1299/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Pratik Mane
        </a>
      </footer>
    </div>
  )
}

export default Home
