'use client';

import { Pool, PoolDetails } from '@/interfaces/types';
import React, { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { SavingsPoolABI2, SavingsPoolAddress2 } from '@/constants/constants';
import { PoolCard } from './pool-card';
import { LoadingState } from '@/components/common/loading-state';
import { gql, useQuery } from '@apollo/client';


const GET_POOLS = gql`
  query GetPools {
    joinedPools {
    id
    poolId
    participant
    blockNumber
  }
  }
`;

const PoolList = () => {
  const [userAddress, setUserAddress] = useState('');
  const { address, isConnected } = useAccount();

  const { loading, error, data } = useQuery(GET_POOLS);

console.log('data', data);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

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
    <div >
      {isLoading ? (
        <LoadingState/>
      ) : Array.isArray(savingsPool) ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {savingsPool.map((pool: PoolDetails) => (
            <PoolCard key={pool.poolID} pool={pool} />
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default PoolList;
