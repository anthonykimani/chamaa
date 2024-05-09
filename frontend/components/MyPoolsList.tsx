import { Pool, PoolDetails } from '@/interfaces/types';
import { generateDummyData } from '@/lib/data';
import React, { useEffect, useState } from 'react';
import { getPoolsData } from '@/data/pools';
import { useAccount, useContractRead } from 'wagmi';
import { SavingsPoolABI2, SavingsPoolAddress2 } from '@/constants/constants';
import { MyPoolCard } from './MyPoolCard';

const MyPoolsList = () => {
	const { address } = useAccount();
  const [myPools, setMyPools] = useState<Pool[]>([]);

  useEffect(() => {
    // Here you would fetch the data from the server or generate the dummy data
    const data = getPoolsData(); // assuming this function is available and returns the dummy data
	const ownedPools = data.filter((pool) => pool.owner === address);

    setMyPools(ownedPools);
  }, [address]);

   const {
     data: mySavingsPool,
     isError,
     isLoading,
   } = useContractRead({
     address: SavingsPoolAddress2,
     abi: SavingsPoolABI2,
     functionName: 'getOwnerSavingPools',
	 args: [address],
   });

   console.log('poolsData', typeof mySavingsPool);

  return (
    <>
      {isLoading && address ? (
        <p>Data Loading...</p>
      ) : Array.isArray(mySavingsPool) ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {mySavingsPool.map((pool: PoolDetails) => (
            <MyPoolCard key={pool.poolID} pool={pool} />
          ))}
        </div>
      ) : (
        <p>No Pools available</p>
      )}
    </>
  );
};

export default MyPoolsList;
