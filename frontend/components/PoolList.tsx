import { Pool, PoolDetails } from '@/interfaces/types';
import { generateDummyData } from '@/lib/data';
import React, { useEffect, useState } from 'react';
import { PoolCard } from './PoolCard';
import { getPoolsData } from '@/data/pools';
import { useContractRead } from 'wagmi';
import { SavingsPoolABI2, SavingsPoolAddress2 } from '@/constants/constants';

const PoolList = () => {
  const [pools, setPools] = useState<PoolDetails[]>([]);

  const {
    data: savingsPool,
    isError,
    isLoading,
  } = useContractRead({
    address: SavingsPoolAddress2,
    abi: SavingsPoolABI2,
    functionName: 'getAllSavingPools',
  });

  console.log('poolsData', savingsPool);

  return (
    <>
      {isLoading ? (
        <p>Data Loading...</p>
      ) : Array.isArray(savingsPool) ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {savingsPool.map((pool: PoolDetails) => (
            <PoolCard key={pool.poolID} pool={pool} />
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </>
  );
};

export default PoolList;
