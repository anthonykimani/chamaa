import { FC, ReactNode } from 'react';
import Header from './Header';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className='overflow-hidden flex flex-col  min-h-screen '>
      <Header />
      <div className='py-4 mx-auto container'>{children}</div>
    </div>
  );
};

export default Layout;
