"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pool, PoolDetails } from '@/interfaces/types';
import { convertBlockTimestampToDate, truncateAddr } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  useAccount,
  useContractRead,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  CusdAbi,
  ManagementAddress2,
  ManagementContractABI2,
  SavingsPoolABI2,
  SavingsPoolAddress2,
  cUSDContractAddress,
} from '@/constants/constants';
import { ethers, Contract } from 'ethers';
import toast from 'react-hot-toast';
import { Separator } from "@/components/ui/separator"
import { LookupResponse } from '@/app/api/lookup';


const PoolDetails = ({ params }: { params: { poolID: number } }) => {
  const { address } = useAccount();

  const { data: walletClient } = useWalletClient();

  const publicClient = usePublicClient();


  const [selectedPool, setSelectedPool] = useState<PoolDetails>();
  const [userAddress, setUserAddress] = useState<string>('');
  console.log('userAddress', userAddress);

  const [friendlies, setFriendlies] = useState<string[]>([]);

  function addFrendliesField() {
    setFriendlies([...friendlies, '']);
  }

  function addFriendlies(index: number, value: string) {
    friendlies[index] = value;
    setFriendlies([...friendlies]);
  }

  const {
    data: savingsPool,
    isError,
    isLoading,
  } = useContractRead({
    address: SavingsPoolAddress2,
    abi: SavingsPoolABI2,
    functionName: 'getAllSavingPools',
  });

  useEffect(() => {
    if (savingsPool && params.poolID) {
      const pool = Array.isArray(savingsPool)
        ? savingsPool.find(
            (pool: PoolDetails) => Number(pool.poolID) === Number(params.poolID)
          )
        : null;
      //   console.log(pool)

      setSelectedPool(pool);
    }
  }, [savingsPool, params.poolID]);

  if (!selectedPool) {
    return <div>Pool not found</div>;
  }

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
          args: [SavingsPoolAddress2, selectedPool?.contributionPerParticipant],
        });
        const txhash = await publicClient.waitForTransactionReceipt({ hash });

        toast.success('Transfer Approved!', { id: createToast });
        return txhash;
      } catch (e) {
        toast.error('Something Went Wrong!', { id: createToast });
      }
    }
  };

  const approveCUSDToJoinPool = async () => {
    if (walletClient) {
      let createToast = toast.loading('Approving cUSD Transfer...', {
        duration: 15000,
        position: 'top-center',
      });
      try {
        let hash = await walletClient.writeContract({
          abi: CusdAbi,
          address: cUSDContractAddress,
          functionName: 'approve',
          args: [
            SavingsPoolAddress2,
            Number(selectedPool?.contributionPerParticipant) * 2,
          ],
        });
        const txhash = await publicClient.waitForTransactionReceipt({ hash });

        toast.success('Transfer Approved!', { id: createToast });
        return txhash;
      } catch (e) {
        toast.error('Something Went Wrong!', { id: createToast });
        console.log(e);
      }
    }
  };

  //useWalletClient minipay
  const AddContributionToPool = async () => {
    if (walletClient) {
      try {
        const txhash = await approveCUSDCTokens();
        if (txhash) {
          try {
            let createToast = toast.loading(
              `Contributing to ${selectedPool?.name} Saving Pool`,
              {
                duration: 15000,
                position: 'top-center',
              }
            );

            let hash = await walletClient.writeContract({
              abi: SavingsPoolABI2,
              address: SavingsPoolAddress2,
              functionName: 'contributeToPool',
              args: [selectedPool?.poolID],
            });
            await publicClient.waitForTransactionReceipt({ hash });
            toast.success(
              `You have contributed to ${selectedPool?.name} Saving Pool!`,
              { id: createToast }
            );
          } catch (e) {
            toast.error('Something Went Wrong!');
          }
        }
      } catch (e) {
        toast.error('Something Went Wrong!');
      }
    }
  };

  //useWalletClient minipay
  const joinSavingsPool = async () => {
    if (walletClient) {
      try {
        const txhash = await approveCUSDToJoinPool();
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
              args: [selectedPool?.poolID],
            });
            await publicClient.waitForTransactionReceipt({ hash });
            toast.success(
              `You have joined ${selectedPool?.name} Saving Pool!`,
              { id: createToast }
            );
          } catch (e) {
            toast.error('Something Went Wrong!');
          }
        }
      } catch (e) {
        toast.error('Something Went Wrong!');
      }
    }
  };

  const claimSavingsPoolTurn = async () => {
    if (walletClient) {
      try {
        let createToast = toast.loading('Claiming your turn', {
          duration: 15000,
          position: 'top-center',
        });

        let hash = await walletClient.writeContract({
          abi: SavingsPoolABI2,
          address: SavingsPoolAddress2,
          functionName: 'claimTurn',
          args: [selectedPool?.poolID],
        });
        await publicClient.waitForTransactionReceipt({ hash });
        toast.success(
          `You have claimed your turn in ${selectedPool?.name} Saving Pool!`,
          { id: createToast }
        );
      } catch (e) {
        toast.error('Something Went Wrong!');
      }
    }
  };

  async function lookup(index: number) {
    let lookupToast = toast.loading('Looking up the address');
    let response: Response = await fetch(
      `/api/lookup?${new URLSearchParams({
        handle: friendlies[index],
      })}`,
      {
        method: 'GET',
      }
    );

    let lookupResponse: LookupResponse = await response.json();
    if (lookupResponse.accounts.length > 0) {
      addFriendlies(index, lookupResponse.accounts[0]);
      toast.success('Address found!', { id: lookupToast });
    } else {
      addFriendlies(index, '');
      toast.error('No Address found', { id: lookupToast });
    }
  }

  //useWalletClient minipay
  const AddFriendliesToPool = async () => {
    if (walletClient) {
      try {
        let createToast = toast.loading(
          `Adding a friend to ${selectedPool?.name} Saving Pool`,
          {
            duration: 15000,
            position: 'top-center',
          }
        );

        let hash = await walletClient.writeContract({
          abi: ManagementContractABI2,
          address: ManagementAddress2,
          functionName: 'setFriendly',
          args: [userAddress],
        });
        await publicClient.waitForTransactionReceipt({ hash });
        toast.success(
          `You have added a friend to ${selectedPool?.name} Saving Pool!`,
          { id: createToast }
        );
      } catch (e) {
        toast.error('Something Went Wrong!');
      }
    }
  };

  return (
    <>
      <div className='flex flex-col space-y-3'>
        <div className='flex flex-col '>
          <h1 className='font-bold text-2xl'>{selectedPool.name}</h1>
        </div>
        <div className='flex flex-col '>
          <h1>
            Pool Owner:{' '}
            <span className='font-bold'>
              {truncateAddr(selectedPool.owner)}
            </span>
          </h1>
        </div>
      </div>

      {/* Pool Details */}
      <div className='py-3'>
        <h2 className='text-lg font-bold pb-4'>Pool Details</h2>
        <Card className='w-full my-4'>
          <CardContent>
            <div className='grid w-full items-center gap-4'>
              <div className='flex justify-between items-center pt-4'>
                <div className='flex flex-col space-y-1.5'>
                  <h2 className='font-semibold text-sm'>Restrictions</h2>
                  <div
                    className={`text-sm font-semibold ${
                      selectedPool.isRestrictedPool
                        ? 'text-red-600 bg-red-500/25 p-2 rounded-md'
                        : 'text-[#35F1CE] bg-[#35F1CE]/30 p-2 rounded-md'
                    }`}
                  >
                    {selectedPool.isRestrictedPool
                      ? 'Restricted'
                      : 'Not Restricted'}
                  </div>{' '}
                </div>{' '}
                <div className='flex flex-col space-y-1'>
                  <h2 className='font-semibold text-sm'>Pool Balance</h2>
                  <h2 className='font-normal self-end'>
                    {ethers.utils.formatEther(selectedPool._poolBalance)} cUSD
                  </h2>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col space-y-1'>
                  <h2 className='font-semibold text-sm'>Max Participants</h2>
                  <h2 className='font-normal '>
                    {Number(selectedPool.maxParticipants)}
                  </h2>
                </div>
                <div className='flex flex-col space-y-1'>
                  <h2 className='font-semibold text-sm self-end'>
                    Contribution Amount
                  </h2>
                  <h2 className='font-normal self-end'>
                    {' '}
                    {ethers.utils.formatEther(
                      selectedPool.contributionPerParticipant
                    )}{' '}
                    cUSD
                  </h2>
                </div>{' '}
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col space-y-1'>
                  <h2 className='font-semibold text-sm self-end'>
                    Current Turn
                  </h2>
                  <h2 className='font-normal'>
                    {' '}
                    {Number(selectedPool.currentTurn)}
                  </h2>
                </div>{' '}
                <div className='flex flex-col space-y-1'>
                  <h2 className='font-semibold text-sm self-end'>
                    Duration Per Turn
                  </h2>
                  <h2 className='font-normal self-end'>
                    {Number(selectedPool.durationPerTurn)}
                  </h2>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col space-y-1'>
                  <h2 className='font-semibold text-sm'>User Current Turn</h2>
                  <h2 className='font-normal '>
                    {truncateAddr(selectedPool.userTurnAddress)}
                  </h2>
                </div>
                <div className='flex flex-col space-y-1'>
                  <h2 className='font-semibold text-sm self-end'>
                    Pool Status
                  </h2>
                  <div
                    className={`text-sm font-semibold self-end ${
                      selectedPool.active === false
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {selectedPool.active === false ? 'Inactive' : 'Active'}
                  </div>{' '}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pool participants */}
      <div className=''>
        <h2 className='text-lg font-bold pb-4'>Pool Participants</h2>
        <Card className='w-full my-4'>
          <CardContent>
            <div className='grid w-full items-center gap-4'>
              <div className='flex justify-between items-center pt-4'>
                <div className='flex flex-col space-y-1.5'>
                  <div className='flex justify-between space-x-16 mb-2 w-full'>
                    <p className='font-semibold'>Participants</p>
                    {/* <p className='font-semibold self-end'>Has Received</p> */}
                  </div>
                  {selectedPool.participants.map((participant, index) => (
                    <div
                      key={`participant-${index}`}
                      className='flex justify-between  w-full'
                    >
                      <p>{truncateAddr(participant)}</p>
                      {/* <p
                          className={
                            hasReceived ? 'text-green-500' : 'text-red-500'
                          }
                        >
                          {hasReceived ? 'Yes' : 'No'}
                        </p> */}
                    </div>
                  ))}
                </div>{' '}
              </div>
              {selectedPool.isRestrictedPool === true &&
                address === selectedPool.owner && (
                  <>
                    <p className='text-normal font-semibold'>
                      Add a Participant to the Pool{' '}
                    </p>

                    <div className='flex flex-col'>
                      <Label
                        htmlFor='minipay phone number'
                        className='text-gray-700'
                      >
                        Add a Friend (Use their minipay phone number)
                      </Label>

                      {friendlies.map((friendly, index) => (
                        <div key={index} className='flex flex-col space-x-2'>
                          <div className='flex flex-col  space-y-5'>
                            <Input
                              onChange={({ target }) =>
                                addFriendlies(index, target.value)
                              }
                              value={friendlies[index]}
                              className='my-2'
                              placeholder='+254712345678'
                            />
                            {friendlies[index].length > 2 &&
                              !friendlies[index].startsWith('0x') && (
                                <Button
                                  onClick={() => lookup(index)}
                                  variant='default'
                                >
                                  Lookup
                                </Button>
                              )}
                          </div>
                        </div>
                      ))}

                      <Button
                        onClick={() => addFrendliesField()}
                        className='self-start px-2 py-2 bg-prosperity border-black border'
                        variant='secondary'
                      >
                        + Add Friend
                      </Button>
                    </div>
                    <Separator className='my-2' />
                    <div className='flex flex-col space-y-2'>
                      <Label
                        htmlFor='minipay phone number'
                        className='text-gray-700'
                      >
                        Add a Friend (Use their wallet address)
                      </Label>
                      <Input
                        onChange={(e) => setUserAddress(e.target.value)}
                        value={userAddress}
                        className='my-2'
                        placeholder='0x0000000'
                      />
                      <Button
                        onClick={() => AddFriendliesToPool()}
                        className='self-start px-2 py-2 my-2 text-white border-black border'
                      >
                        Submit Friend
                      </Button>
                    </div>
                  </>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className='text-lg font-bold pb-4'>Contribute</h2>

        <Card>
          <CardContent>
            <div className='flex flex-col w-full py-4'>
              {/* {selectedPool.isRestrictedPool === true && (
                <>
                  <p className='py-2 font-semibold'>
                    You cannot contribute to this pool.
                  </p>
                  <Button
                    className='disabled:bg-gray-700 '
                    variant='default'
                    onClick={() => AddContributionToPool()}
                    disabled
                  >
                    Contribute
                  </Button>
                </>
              )} */}
              {selectedPool.active === true &&
                selectedPool.participants.includes(
                  address as `0x${string}`
                ) && (
                  <div className='flex flex-col space-y-1'>
                    <p className='py-2 font-semibold'>
                      Contribute to the Savings pool.
                    </p>
                    <Button
                      className=''
                      variant='default'
                      onClick={() => AddContributionToPool()}
                    >
                      Contribute
                    </Button>
                  </div>
                )}
              <Separator className='my-2' />
              {!selectedPool.participants.includes(
                address as `0x${string}`
              ) && (
                <>
                  <p className='text-gray-500 text-sm py-3'>
                    You have to be invited by the pool owner in order to join
                    the pool.
                  </p>
                  <div className='flex flex-col space-y-1'>
                    <p className='py-2 font-semibold'>
                      Join to contribute to this pool.
                    </p>
                    <Button
                      className=''
                      variant='default'
                      onClick={() => joinSavingsPool()}
                    >
                      Join Pool
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className='text-lg font-bold py-4'>Claim Turn</h2>

        <Card>
          <CardContent>
            <div className='flex flex-col w-full py-4'>
              {selectedPool.userTurnAddress === address ? (
                <div className='flex flex-col space-y-1'>
                  <Button
                    className=''
                    variant='default'
                    onClick={() => claimSavingsPoolTurn()}
                  >
                    Claim Turn
                  </Button>
                </div>
              ) : (
                <>
                  <p className='py-2 font-semibold'>
                    You cannot claim this turn.
                  </p>
                  <Button
                    className='disabled:bg-gray-700 text-white'
                    variant='secondary'
                    disabled
                  >
                    Claim Turn
                  </Button>
                </>
              )}{' '}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PoolDetails;
