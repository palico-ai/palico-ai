import styles from './lexical.module.css';

/* eslint-disable-next-line */
export interface LexicalProps {}

export function Lexical(props: LexicalProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Lexical!</h1>
    </div>
  );
}

export default Lexical;
