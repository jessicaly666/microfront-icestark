import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appHistory } from '@ice/stark-app';
import { Button } from '@alifd/next';
import { store } from '@ice/stark-data';

import styles from './index.module.css';

export default function Home(props) {
  console.log('props', props);
  const { frameworkProps: { name } } = props;
  const [lang, setLang] = useState('');
  useEffect(() => {
    console.log('Home Page mounted');
    store.on('language', (lang) => {
      setLang(lang);
    }, true);
    return () => {
      console.log('Home Page unmounted');
    };
  }, []);

  return (
    <div className={styles.app}>
      <p>传递props参数：{name}</p>
      <p>当前语言：{lang}</p>
      <br />
      <Link to="/detail">微应用跳转内部路由</Link>
      <br />
      <br />
      <Button
        type="primary"
        onClick={() => {
          appHistory.push('/');
        }}
      >微应用间跳转 1
      </Button>
      <br />
      <br />
      <Button
        type="primary"
        onClick={() => {
          appHistory.push('/waiter');
        }}
      >微应用间跳转 2
      </Button>
    </div>
  );
}
