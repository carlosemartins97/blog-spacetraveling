import { GetStaticProps } from 'next';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Link from 'next/link'

import {FiCalendar, FiUser} from 'react-icons/fi';

import Prismic from '@prismicio/client'

import {format} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';


import { useEffect, useState } from 'react';
import Head from 'next/Head';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  
  const { results, next_page } = postsPagination;
  const [nextPage, setNextPage] = useState<string>(next_page);

  async function handleLoadPosts() {
    try {
      await fetch(`${nextPage}`)
        .then(response => response.json())
        .then(data => {
          let responseResults = data.results;
          responseResults.forEach(item => {
            results.push({
              uid: item.uid,
              first_publication_date: format(
                new Date(item.first_publication_date),
                'dd MMM yyyy', {locale: ptBR}
              ),
              data: {
                title: item.data.title,
                subtitle: item.data.subtitle,
                author: item.data.author,
              }
            })
          })
          setNextPage(data.next_page)
        })

    } catch {
      throw new Error('Não foi possível carregar mais postagens.')
    }
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <Header/>
      <main className={`${commonStyles.container}`}>
        <div className={`${styles.content} ${commonStyles.content}`}>

          {
            results.map(post => (
                <Link href={`/post/${post.uid}`} key={post.uid}>
                  <a>
                    <h1> {post.data.title} </h1>
                    <p>{post.data.subtitle}</p>
                    <div className={commonStyles.postInfo}>
                      <time><FiCalendar />
                        {
                          format(
                            new Date(post.first_publication_date),
                            'dd MMM yyyy', {locale: ptBR}
                          )
                        }
                      </time>
                      <span><FiUser />{post.data.author}</span>
                    </div>
                  </a>
                </Link>
            ))
          }

          {
            nextPage && 
            (
              <button 
                type="button"
                className={styles.loadPostsButton}
                onClick={handleLoadPosts}
              >
                Carregar mais posts
              </button>
            )
          }
        
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'publication')
  ], {
      fetch: ['publication.title', 'publication.subtitle', 'publication.author'],
      pageSize:1,
    }
  )

  const { next_page } = postsResponse;

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })

  return {
    props: {
      postsPagination: {
        results,
        next_page,
      },
    },
    revalidate: 60 * 60,
  }
};


