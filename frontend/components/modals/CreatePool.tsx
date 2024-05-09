import { ethers, Contract, BigNumber } from 'ethers';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import { useContractSend } from '@/hooks/useContractWrite';
import { waitForTransaction } from '@wagmi/core';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useContractApprove } from '@/hooks/useApprove';
import { SavingsPoolAddress2 } from '@/constants/constants';
import { SavingsPoolABI2 } from '@/constants/constants';
import { CusdAbi } from '@/constants/constants';
import { cUSDContractAddress } from '@/constants/constants';

const CreatePoolForm = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const router = useRouter();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [visible, setVisible] = useState(false);
  const [poolName, setPoolName] = useState<string>('');
  const [maxParticipants, setMaxParticipants] = useState<string | number>(0);
  const [contributionPerParticipant, setContributionPerParticipant] = useState<
    string | number
  >(0);
  const [isRestricted, setIsRestricted] = useState<boolean>(false);
  const [durationPerTurn, setDurationPerTurn] = useState<string | number>(0);

  const [debouncedPoolName] = useDebounce(poolName, 500);
  const [debouncedMaxParticipants] = useDebounce(Number(maxParticipants), 500);
  const [debouncedContributionPerParticipant] = useDebounce(
    Number(contributionPerParticipant),
    500
  );
  const [debouncedIsRestricted] = useDebounce(isRestricted, 500);
  const [debouncedDurationPerTurn] = useDebounce(Number(durationPerTurn), 500);
  const [loading, setLoading] = useState('');

  const isComplete =
    poolName &&
    durationPerTurn &&
    maxParticipants &&
    contributionPerParticipant &&
    isRestricted;

  const clearForm = () => {
    setPoolName('');
    setDurationPerTurn(0);
    setMaxParticipants(0);
    setIsRestricted(false);
    setContributionPerParticipant(0);
  };

  const { writeAsync: approveSpending, isLoading: approveLoading } =
    useContractApprove(debouncedContributionPerParticipant);

  const { writeAsync: createPool, error: createPoolError } = useContractSend(
    'createPool',
    [
      debouncedPoolName,
      debouncedMaxParticipants,
      debouncedContributionPerParticipant,
      debouncedDurationPerTurn,
      debouncedIsRestricted,
    ]
  );

  //approve
  const approveCUSDCTokens = async () => {
    if (walletClient) {
      let createToast = toast.loading('Approving ...', {
        duration: 15000,
        position: 'top-center',
      });
      try {
        const amountToContribute: BigNumber = ethers.utils.parseEther(
          debouncedContributionPerParticipant.toString()
        );
        let hash = await walletClient.writeContract({
          abi: CusdAbi,
          address: cUSDContractAddress,
          functionName: 'approve',
          args: [SavingsPoolAddress2, amountToContribute],
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
  const createSavingPools = async () => {
    if (walletClient) {
      try {
        const amountToContribute: BigNumber = ethers.utils.parseEther(
          debouncedContributionPerParticipant.toString()
        );

        const txhash = await approveCUSDCTokens();
        if (txhash) {
          try {
            let createToast = toast.loading('Creating Saving Pool', {
              duration: 15000,
              position: 'top-center',
            });

            let hash = await walletClient.writeContract({
              abi: SavingsPoolABI2,
              address: SavingsPoolAddress2,
              functionName: 'createPool',
              args: [
                debouncedPoolName,
                debouncedMaxParticipants,
                amountToContribute,
                debouncedDurationPerTurn,
                debouncedIsRestricted,
              ],
            });
            await publicClient.waitForTransactionReceipt({ hash });
            toast.success('Saving Pool Created!', { id: createToast });
			setVisible(false);
			clearForm();
          } catch (e) {
            toast.error('Something Went Wrong!');
          }
        }
      } catch (e) {
        toast.error('Something Went Wrong!');
      }
    }
  };

  const handleCreatePool = async () => {
    if (!createPool || !approveSpending) {
      throw 'Failed to create Savings Pool or approve spending';
    }
    setLoading(
      approveLoading
        ? 'Approving spending...'
        : 'Waiting for spending approval...'
    );
    //    if (!isComplete) throw new Error('Please fill all fields');

    // console.log('Pool Name:', debouncedPoolName);
    // console.log('Max Participants:', debouncedMaxParticipants);
    // console.log(
    //   'Contribution Per Participant:',
    //   debouncedContributionPerParticipant
    // );
    // console.log('Is Restricted:', debouncedIsRestricted);
    // console.log('Duration Per Turn:', debouncedDurationPerTurn);

    const { hash: approveHash } = await approveSpending();
    await waitForTransaction({ confirmations: 1, hash: approveHash });

    setLoading('Creating...');
    const { hash: createHash } = await createPool();
    setLoading('Waiting for confirmation...');

    await waitForTransaction({ confirmations: 1, hash: createHash });

    setVisible(false);
    clearForm();
  };

  const addSavingsPool = async (e: any) => {
    e.preventDefault();
    try {
      await toast.promise(handleCreatePool(), {
        loading: 'Creating Savings Pool...',
        success: 'Savings Pool created successfully',
        error: 'Something went wrong. Try again.',
      });
      setTimeout(() => {
        router.refresh();
      }, 10000);
    } catch (e: any) {
      console.log({ e });
      toast.error(e?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className={'flex flex-row w-full justify-between'}>
      <div>
        <button
          type='button'
          onClick={() => setVisible(true)}
          className='inline-block ml-4 px-6 py-2.5 border-2 border-primary text-neutral-700 font-medium text-md leading-tight rounded-lg shadow-md hover:bg-primary hover:text-white hover:shadow-lg focus:bg-primary focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary active:shadow-lg transition duration-150 ease-in-out'
          data-bs-toggle='modal'
          data-bs-target='#exampleModalCenter'
        >
          Create Pool
        </button>

        {/* Modal */}
        {visible && (
          <div
            className='fixed z-40 overflow-y-auto top-0 w-full left-0 flex items-center justify-center'
            id='modal'
          >
            <div>
              <div className='flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                <div className='fixed inset-0 transition-opacity'>
                  <div className='absolute inset-0 bg-gray-900 opacity-75' />
                </div>
                <span className='hidden sm:inline-block sm:align-middle sm:h-screen'>
                  &#8203;
                </span>
                <div
                  className='inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
                  role='dialog'
                  aria-modal='true'
                  aria-labelledby='modal-headline'
                >
                  <div className='bg-white flex flex-col space-y-3 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                    <div>
                      <label>Pool Name</label>
                      <input
                        onChange={(e) => {
                          setPoolName(e.target.value);
                        }}
                        required
                        type='text'
                        className='w-full bg-gray-100 p-2 mt-2 mb-3'
                      />
                    </div>
                    <div>
                      <label>Maximum No. of Participants</label>
                      <input
                        onChange={(e) => {
                          setMaxParticipants(e.target.value);
                        }}
                        required
                        type='number'
                        className='w-full bg-gray-100 p-2 mt-2 mb-3'
                      />
                    </div>
                    <div>
                      <label>Contribution Amount</label>
                      <input
                        onChange={(e) => {
                          setContributionPerParticipant(e.target.value);
                        }}
                        required
                        type='number'
                        className='w-full bg-gray-100 p-2 mt-2 mb-3'
                      />
                    </div>

                    <div className='flex flex-col space-y-1'>
                      <label>Duration per turn</label>
                      <input
                        type='number'
                        onChange={(e) => {
                          setDurationPerTurn(e.target.value);
                        }}
                        className='py-2.5'
                      />
                    </div>

                    <div className='flex flex-col space-y-1 pt-3'>
                      <label>Restrictions</label>

                      <div className='flex space-x-6'>
                        <div className='flex items-center space-x-2'>
                          <input
                            type='radio'
                            value='true'
                            checked={isRestricted === true}
                            onChange={(e) => {
                              setIsRestricted(e.target.value === 'true');
                            }}
                          />
                          <label>True</label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <input
                            type='radio'
                            value='false'
                            className=''
                            checked={isRestricted === false}
                            onChange={(e) => {
                              setIsRestricted(e.target.value === 'true');
                            }}
                          />
                          <label>False</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bg-gray-200 px-4 py-3 text-right'>
                    <button
                      type='button'
                      className='py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 mr-2'
                      onClick={() => setVisible(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        createSavingPools();
                      }}
                      // disabled={!!loading || !createPool}

                      className='py-2 px-4 bg-primary text-white rounded hover:primary mr-2'
                    >
                      {loading ? loading : 'Create'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePoolForm;
