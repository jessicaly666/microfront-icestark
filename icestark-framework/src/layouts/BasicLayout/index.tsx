import { useEffect } from 'react';
import { Shell, Select } from '@alifd/next';
import { store, event } from '@ice/stark-data';
import PageNav from './components/PageNav';
import Footer from './components/Footer';

const { Option } = Select;

declare global {
  interface Window {
    webpackJsonp: any[];
  }
}

export default function BasicLayout(props: {
  children: React.ReactNode;
  pathname: string;
}) {
  const { children, pathname } = props;
  const defaultLang = 'cn';
  useEffect(() => {
    // 语言初始化
    store.set('language', defaultLang);
    event.on('freshMessage', () => {
      console.log('主应用重新获取消息数');
    });
  }, []);
  return (
    <Shell
      type="brand"
      style={{
        minHeight: '100vh',
      }}
    >
      <Shell.Branding>
        Framework
        <Select
          onChange={(val) => { store.set('language', val); }}
          defaultValue={defaultLang}
        >
          <Option value="cn">中文</Option>
          <Option value="en">英文</Option>
        </Select>
      </Shell.Branding>

      <Shell.Navigation>
        <PageNav pathname={pathname} />
      </Shell.Navigation>

      <Shell.Content>{children}</Shell.Content>
      <Shell.Footer>
        <Footer />
      </Shell.Footer>
    </Shell>
  );
}
