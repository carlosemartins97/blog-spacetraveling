import { GetStaticPaths, GetStaticProps } from 'next';
import { Head } from 'next/document';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import {format} from 'date-fns'

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
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
  post: Post;
}

export default function Post({post}: PostProps) {

  console.log(post.data.content)

  return (
    <>
      <Header />
      <main className={`${commonStyles.container}`}>
        <img src={post.data.banner.url} alt="banner" className={styles.banner}/>
        <div className={`${commonStyles.content} ${styles.content}`}>
          <h1>{post.data.title}</h1>

          <div className={commonStyles.postInfo}>
            <time><FiCalendar />{post.first_publication_date}</time>
            <span><FiUser />{post.data.author}</span>
            <time><FiClock />4 min</time>
          </div>

          {
            post.data.content.map(item => (
              <div key={item.heading} className={styles.post}>
                <h2>{item.heading}</h2>

                {item.body.map(paragraph => (
                    <p>{paragraph.text}</p>
                ))}
              </div>
            ))
          }
          
        </div>
      </main>
    </>
  )
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query();

  // TODO
  return {
    paths: [],
    fallback: 'blocking'
}
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const { slug } = params

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('publication', String(slug), {});

  console.log(response.data.content)

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd LLL yyyy'
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 60, // 1 hour
  }
};
