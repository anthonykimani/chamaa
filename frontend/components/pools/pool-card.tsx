import * as React from 'react';
import { ethers, Contract } from 'ethers';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pool, PoolDetails } from '@/interfaces/types';
import { truncateAddr } from '@/lib/utils';
import { poll } from 'ethers/lib/utils';
import Link from 'next/link';
import { usePublicClient, useWalletClient, useAccount } from 'wagmi';
import {
  CusdAbi,
  SavingsPoolABI2,
  SavingsPoolAddress2,
  cUSDContractAddress,
} from '@/constants/constants';
import toast from 'react-hot-toast';

interface PoolCardProps {
  pool: PoolDetails;
}

export function PoolCard({ pool }: PoolCardProps) {
  const { data: walletClient } = useWalletClient();

  const publicClient = usePublicClient();

  //approve
  const approveCUSDCTokens = async () => {
    if (walletClient) {
      let createToast = toast.loading('Approving ...', {
        duration: 15000,
        position: 'top-center',
      });
      try {
        let hash = await walletClient.writeContract({
          abi: CusdAbi,
          address: cUSDContractAddress,
          functionName: 'approve',
          args: [SavingsPoolAddress2, pool?.contributionPerParticipant],
        });
        const txhash = await publicClient.waitForTransactionReceipt({ hash });

        toast.success('Transfer Approved!', { id: createToast });
        return txhash;
      } catch (e) {
        toast.error('Something Went Wrong!', { id: createToast });
      }
    }
  };

  //useWalletClient minipay
  const joinSavingsPool = async () => {
    if (walletClient) {
      try {
        const txhash = await approveCUSDCTokens();
        if (txhash) {
          try {
            let createToast = toast.loading('Joining Saving Pool', {
              duration: 15000,
              position: 'top-center',
            });

            let hash = await walletClient.writeContract({
              abi: SavingsPoolABI2,
              address: SavingsPoolAddress2,
              functionName: 'joinPool',
              args: [pool?.poolID],
            });
            await publicClient.waitForTransactionReceipt({ hash });
            toast.success(`You have joined ${pool?.name} Saving Pool!`, {
              id: createToast,
            });
          } catch (e) {
            toast.error('Something Went Wrong!');
          }
        }
      } catch (e) {
        toast.error('Something Went Wrong!');
      }
    }
  };
  return (
    <Link href={`/${Number(pool.poolID)}`}>
      <Card className='w-full my-4'>
        <CardHeader>
          <CardTitle>{pool.name}</CardTitle>
          {/* <CardDescription>{pool.poolDescription}</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className='grid w-full gap-4'>
            <div className='flex justify-between space-x-6 items-center'>
              <div className='flex flex-col space-y-1.5'>
                <h2 className='font-semibold text-sm'>Pool Owner</h2>
                <h2 className='font-normal'>{truncateAddr(pool.owner)}</h2>
              </div>
              <div className='flex flex-col space-y-1.5'>
                {/* <h2 className='font-semibold text-sm'>Pool Status</h2> */}
                <div
                  className={`text-sm font-semibold ${
                    pool.isRestrictedPool
                      ? 'text-red-600 bg-red-500/25 p-3 rounded-md'
                      : 'text-green-400 bg-green-500/25 p-3 rounded-md'
                  }`}
                >
                  {pool.isRestrictedPool ? 'Restricted' : 'Not Restricted'}
                </div>{' '}
              </div>{' '}
            </div>
            <div className='flex justify-between space-x-6 items-center'>
              <div className='flex flex-col space-y-1.5'>
                <h2 className='font-semibold text-sm'>Max Participants</h2>
                <h2 className='font-normal '>{Number(pool.maxParticipants)}</h2>
              </div>
              <div className='flex flex-col space-y-1.5'>
                <h2 className='font-semibold text-sm'>Contribution Amount</h2>
                <h2 className='font-normal self-end'>
                  {' '}
                  {ethers.utils.formatEther(
                    pool.contributionPerParticipant
                  )}{' '}
                  cUSD
                </h2>
              </div>{' '}
            </div>
            <div className='flex justify-between space-x-6 items-center'>
              <div className='flex flex-col space-y-1.5'>
                <h2 className='font-semibold text-sm'>Status</h2>
                <div
                  className={`text-sm font-semibold ${
                    pool.active === false ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {pool.active === false ? 'Inactive' : 'Active'}
                </div>{' '}
              </div>
              <div className='flex flex-col space-y-1.5'>
                <h2 className='font-semibold text-sm'>Duration Per Turn</h2>
                <h2 className='font-normal self-end'>
                  {Number(pool.durationPerTurn)}
                </h2>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col space-y-1.5'>
                <h2 className='font-semibold text-sm'>Total Pool Members</h2>
                <h2 className='font-normal'>{pool.participants.length}</h2>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-end'>
          {pool.participants.length === Number(pool.maxParticipants) ||
          pool.isRestrictedPool === true ? (
            <Button className='disabled:bg-gray-600 text-white' disabled>
              Join Pool
            </Button>
          ) : (
            <Button className="" variant="primary" onClick={() => joinSavingsPool()}>Join Pool</Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
