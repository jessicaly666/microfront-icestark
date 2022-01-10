import { useEffect } from 'react';
import { Link, request } from 'ice';

import styles from './index.module.css';

export default function Detail() {
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const data = await request({
      url: '/test/sign',
    });
    console.log('data', data);
  };
  return (
    <div className={styles.container}>
      <h2>详情页面</h2>
      <Link to="/">返回微应用首页</Link>
    </div>
  );
}
