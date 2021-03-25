import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.headerContent}>
        <img src='/logo.svg' alt="logo"/>
      </div>
    </header>
  )
}
