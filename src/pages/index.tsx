import { GetStaticProps } from 'next';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import {FiCalendar, FiUser} from 'react-icons/fi';

import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';

import {format} from 'date-fns'
import ptBR from 'date-fns/esm/locale/pt-BR/index.js';

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

  console.log(results)

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.homeContent}>
       {
         results.map(post => (
            <a key={post.uid}>
              <h1> {post.data.title} </h1>
              <p>{post.data.subtitle}</p>
              <div className={styles.postInfo}>
                <time><FiCalendar />{post.first_publication_date}</time>
                <span><FiUser />{post.data.author}</span>
              </div>
            </a>
         ))
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

  const next_page = postsResponse.next_page;

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
        next_page
      },
    }
  }
};
