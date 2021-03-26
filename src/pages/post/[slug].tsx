import { GetStaticPaths, GetStaticProps } from 'next';
import { Head } from 'next/document';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

export default function Post() {
  return (
    <>
      <Header />
      <main className={`${commonStyles.container}`}>
        <img src="/banner.svg" alt="banner" className={styles.banner}/>
        <div className={`${commonStyles.content} ${styles.content}`}>
          <h1>Criando um app CRA do zero</h1>

          <div className={commonStyles.postInfo}>
            <time><FiCalendar />15 Mar 2021</time>
            <span><FiUser />Carlos Martins</span>
            <time><FiClock />4 min</time>
          </div>

          <h2>Point et varius</h2>

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur repellendus accusamus, 
            tempora perspiciatis omnis nemo ex iste velit saepe ducimus ipsa, minima laboriosam repellat 
            consectetur laborum placeat, vel nulla architecto! <br/>
            <br/>

            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, ullam? <br/>
            <br/>

            Lorem ipsum, dolor sit amet consectetur adipisicing <span>rocketseat</span> elit. Minus commodi praesentium sint nostrum, voluptas nulla quidem iure mollitia ratione voluptates?<br/>
            <br/>

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nobis eaque excepturi, quisquam, harum maxime temporibus corporis eligendi veniam autem nulla libero! Quod, repudiandae quae. Beatae, consequatur id cumque perferendis quae doloribus, aperiam, voluptatum explicabo harum repellendus est sit quaerat!<br/>
          </p>
          
          <h2>Point et varius</h2>

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur repellendus accusamus, 
            tempora perspiciatis omnis nemo ex iste velit saepe ducimus ipsa, minima laboriosam repellat 
            consectetur laborum placeat, vel nulla architecto! <br/>
            <br/>

            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, ullam? <br/>
            <br/>

            Lorem ipsum, dolor sit amet consectetur adipisicing <span>rocketseat</span> elit. Minus commodi praesentium sint nostrum, voluptas nulla quidem iure mollitia ratione voluptates?<br/>
            <br/>

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nobis eaque excepturi, quisquam, harum maxime temporibus corporis eligendi veniam autem nulla libero! Quod, repudiandae quae. Beatae, consequatur id cumque perferendis quae doloribus, aperiam, voluptatum explicabo harum repellendus est sit quaerat!<br/>
          </p>
        </div>
      </main>
    </>
  )
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
