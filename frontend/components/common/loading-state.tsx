import React from 'react';

export const LoadingState: React.FC = () => (
  <div className='absolute inline-flex items-center justify-center w-full'>
    <div className='w-10 h-10 rounded-full border-2 border-b-transparent animate-spin border-primary' />
  </div>
);


