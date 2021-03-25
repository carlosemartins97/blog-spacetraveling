import { GetStaticProps } from 'next';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import {FiCalendar, FiUser} from 'react-icons/fi';

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

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.homeContent}>
          <a href="#">
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.postInfo}>
              <time><FiCalendar />15 Mar 2021</time>
              <span><FiUser />Carlos Martins</span>
            </div>
          </a>

          <a href="#">
            <h1>Criando um app CRA do zero</h1>
            <p>Tudo sobre como criar a sua primeira aplicação utilizando Create React App.</p>
            <div className={styles.postInfo}>
              <time><FiCalendar />19 Abr 2021</time>
              <span><FiUser />Danilo Vieira</span>
            </div>
          </a>
        </div>
      </main>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
