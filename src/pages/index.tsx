import { GetStaticProps } from 'next';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Link from 'next/link'

import {FiCalendar, FiUser} from 'react-icons/fi';

import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';

import {format} from 'date-fns'
import ptBR from 'date-fns/esm/locale/pt-BR/index.js';
import { useEffect, useState } from 'react';

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

  async function handleLoadPosts() {
    try {
      

    } catch {
      throw new Error('Não foi possível carregar mais postagens.')
    }
  }

  return (
    <>
      <Header />
      <main className={`${commonStyles.container}`}>
        <div className={`${styles.content} ${commonStyles.content}`}>
          {
            results.map(post => (
                <Link href={`/post/${post.uid}`} key={post.uid}>
                  <a>
                  <h1> {post.data.title} </h1>
                  <p>{post.data.subtitle}</p>
                  <div className={commonStyles.postInfo}>
                    <time><FiCalendar />{post.first_publication_date}</time>
                    <span><FiUser />{post.data.author}</span>
                  </div>
                </a>
                </Link>
            ))
          }

          {
            next_page 
            ? (
              <button 
            type="button"
            className={styles.loadPostsButton}
            onClick={handleLoadPosts}
          >
            Carregar mais posts
          </button>
            )
            : null
          }
        
        </div>
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'publication')
  ], {
      fetch: ['publication.title', 'publication.subtitle', 'publication.author'],
      pageSize:2,
    }
  )

  const { next_page } = postsResponse;

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd LLL yyyy'
      ),
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
  }
};
