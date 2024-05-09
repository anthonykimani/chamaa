import { ethers } from 'ethers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { truncateAddr } from '@/lib/utils';
import  Link  from 'next/link';
import { PoolDetails } from '@/interfaces/types';

interface PoolCardProps {
  pool: PoolDetails;
}

export function MyPoolCard({ pool }: PoolCardProps) {


  
  return (
    <Link href={`/${Number(pool.poolID)}`}>
      <Card className='w-full my-4'>
        <CardHeader>
          <CardTitle>{pool.name}</CardTitle>
          {/* <CardDescription>{pool.poolDescription}</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex justify-between items-center'>
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
            <div className='flex justify-between items-center'>
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
            <div className='flex justify-between items-center'>
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
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
