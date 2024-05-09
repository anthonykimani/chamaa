import { SavingsPoolABI2, SavingsPoolAddress2 } from '@/constants/constants';
import { ethers } from 'ethers';
import {
  createContext,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useAccount, useContractRead } from 'wagmi';

type AppDataProviderProps = {
  children: React.ReactNode;
};

type AppDataContextType = {
//   getSavingsPool: () => React.ReactNode[];
};

export const AppDataContext = createContext({} as AppDataContextType);

export function useAppData() {
  return useContext(AppDataContext);
}

export default function AppDataProvider({ children }: AppDataProviderProps) {
  const { address } = useAccount();

  // Use the useContractCall hook to read how many products are in the marketplace contract
  //const { data } = useContractCall('getNumberOfCelodevs', [], true);

  const { data, isError, isLoading } = useContractRead({
    address: SavingsPoolAddress2,
    abi: SavingsPoolABI2,
    functionName: 'getAllSavingPools',
    
  });

  // Convert the data to a number
//   const celoDevsLength = data ? Number(data.toString()) : 0;
  console.log(data);

  // Define a function to return the products
//   const getSavingsPool = useCallback(() => {
//     // If there are no products, return null
//     if (!celoDevsLength) return [];
//     const celoDevs = [];
//     // Loop through the products, return the Product component and push it to the products array
//     for (let i = 0; i < celoDevsLength; i++) {
//       celoDevs.push(<EmployeeTable key={i} id={i} />);
//     }
//     //console.log(celoDevs.length);
//     return celoDevs;
//   }, [celoDevsLength]);

//   useEffect(() => {
//     getSavingsPool();
//   }, [getSavingsPool]);

  return (
    <AppDataContext.Provider
      value={{
        // getSavingsPool,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
