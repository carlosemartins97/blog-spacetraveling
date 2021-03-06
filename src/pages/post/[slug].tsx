import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { format } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post?: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter()


  return (
    <>
      <Head>
        <title>{`${post?.data.title} | spacetraveling`}</title>
      </Head>
      <Header />
      <main className={`${commonStyles.container}`}>

        {router.isFallback 
        ? (<h1>Carregando...</h1>) 
        : (
          <>
            <img src={post.data.banner.url} alt="banner" className={styles.banner} />
            <div className={`${commonStyles.content} ${styles.content}`}>
              <h1>{post.data.title}</h1>

              <div className={commonStyles.postInfo}>
                <time><FiCalendar />{
                format(
                  new Date(post.first_publication_date),
                  'dd MMM yyyy', {locale: ptBr}
                )}</time>
                <span><FiUser />{post.data.author}</span>
                <time><FiClock />4 min</time>
              </div>

              {
                post.data.content.map(item => (
                  <div key={item.heading} className={styles.post}>
                    <h2>{item.heading}</h2>

                    {item.body.map(paragraph => (
                      <p key={Math.random()}>{paragraph.text}</p>
                    ))}
                  </div>
                ))
              }

            </div>
          </>
        )}

      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      pageSize: 5,
    }
  );

  const postArray = await posts.results.map(post => (
      { 
        params: 
        { slug: post.uid},
      }
    ));


  return {
    paths: postArray,
    fallback: true,
  }
};


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('publication', String(slug), {});

  return {
    props: {
      post: response
    },
    revalidate: 60 * 60, // 1 hour
  }
};

