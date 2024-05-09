import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ethers, BigNumber } from 'ethers';
import { useWalletClient, usePublicClient } from 'wagmi';
import { useDebounce } from 'use-debounce';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { SavingsPoolAddress2 } from '@/constants/constants';
import { SavingsPoolABI2 } from '@/constants/constants';
import { CusdAbi } from '@/constants/constants';
import { cUSDContractAddress } from '@/constants/constants';

const NewCreatePoolForm = () => {
	  const [open, setOpen] = useState(false);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

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

  //   const isComplete =
  //     poolName &&
  //     durationPerTurn &&
  //     maxParticipants &&
  //     contributionPerParticipant &&
  //     isRestricted;


  // const { writeAsync: approveSpending, isLoading: approveLoading } =
  //   useContractApprove(debouncedContributionPerParticipant);

  // const { writeAsync: createPool } = useContractSend('createPool', [
  //   debouncedPoolName,
  //   debouncedMaxParticipants,
  //   debouncedContributionPerParticipant,
  //   debouncedDurationPerTurn,
  //   debouncedIsRestricted,
  // ]);

  //approve
  const approveCUSDCTokens = async () => {
    if (walletClient) {
      const createToast = toast.loading('Approving ...', {
        duration: 15000,
        position: 'top-center',
      });
      try {
        const amountToContribute: BigNumber = ethers.utils.parseEther(
          debouncedContributionPerParticipant.toString()
        );
        const hash = await walletClient.writeContract({
          abi: CusdAbi,
          address: cUSDContractAddress,
          functionName: 'approve',
          args: [SavingsPoolAddress2, Number(amountToContribute) * 2],
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
            const createToast = toast.loading('Creating Savings Pool...', {
              duration: 15000,
              position: 'top-center',
            });

            const hash = await walletClient.writeContract({
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
			setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>Create Pool</Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-[425px]'
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create Savings Pool</DialogTitle>
        </DialogHeader>
        <div className='grid gap-2 py-2'>
          <div className='grid grid-cols-2 items-center gap-2'>
            <Label htmlFor='pool_name'>Pool Name</Label>
            <Input
              id='pool_name'
              onChange={(e) => {
                setPoolName(e.target.value);
              }}
              required
              type='text'
              className='w-full bg-gray-100 p-2 mt-2 mb-3 col-span-3'
            />
          </div>
          <div className='grid grid-cols-2 items-center gap-2'>
            <Label htmlFor='participants' className=''>
              Max no. of Participants
            </Label>
            <Input
              id='participants'
              onChange={(e) => {
                setMaxParticipants(e.target.value);
              }}
              required
              type='number'
              className='w-full bg-gray-100 p-2 mt-2 mb-3 col-span-3'
            />
          </div>
          <div className='grid grid-cols-2 items-center gap-2'>
            <Label htmlFor='contribution' className=''>
              Contribution Amount
            </Label>
            <Input
              id='contribution'
              onChange={(e) => {
                setContributionPerParticipant(e.target.value);
              }}
              required
              type='number'
              className='w-full bg-gray-100 p-2 mt-2 mb-3 col-span-3'
            />
          </div>
          <div className='grid grid-cols-2 items-center gap-2'>
            <Label htmlFor='duration_per_turn' className=''>
              Duration per turn
            </Label>
            <Input
              id='duration_per_turn'
              type='number'
              onChange={(e) => {
                setDurationPerTurn(e.target.value);
              }}
              className='w-full bg-gray-100 p-2 mt-2 mb-3 col-span-3'
            />
          </div>
          <div className='grid grid-cols-2 items-center gap-2'>
            <Label htmlFor='participants' className=''>
              Restrictions
            </Label>
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
        <DialogFooter>
          <Button
            type='submit'
            onClick={() => {
              createSavingPools();
            }}
          >
            Create Pool
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCreatePoolForm;
