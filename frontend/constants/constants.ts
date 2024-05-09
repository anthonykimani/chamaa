import SavingPoolABI from '../abi/ChamaPool.json';
import ManagementABI from '../abi/ManagementContract.json';
import SavingsPoolAbi from '../abi/SavingsPool2.json';
import ManagementAbi from '../abi/ManagementContract2.json';
import cusdcAbi from '../abi/cusd.json';

export const SavingsPoolAddress = '0xf084270F6dfEA078FA0bD70cB7242F3E62305086'; //Deployed to: 0x93b63165Ae71422D4567a6abB39860777B8A62Dd
export const SavingsPoolABI = SavingPoolABI.abi;

export const ManagementAddress = '0xCD62b7FA236036c3B027c8CDfD945E3CB4907DF6'; //Deployed to: 0x7897CC6E4C544679cB40Dd9Ad4BD2A414812072b
export const ManagementContractABI = ManagementABI.abi;

// forge create --rpc-url https://alfajores-forno.celo-testnet.org  --constructor-args 0x7897CC6E4C544679cB40Dd9Ad4BD2A414812072b   --private-key <key>
//  src/SavingsPool.sol:ChamaPool

export const ManagementAddress2 = '0x655BB63a8066CA7c17dBeDc0BaE785BC3ddc7f4D'; //testnet'0x7897CC6E4C544679cB40Dd9Ad4BD2A414812072b';
export const SavingsPoolAddress2 = '0x677b34EBd5537784814625613C4E8B66a8f64978'; //testnet"0x336907f7e4475c0680989Eea73111Ee4B48770dC"; //'0xEc6Db94C1697EB98Fe9E74aD23972E3c1377C1cD';
export const cUSDContractAddress = '0x765de816845861e75a25fca122bb6898b8b1282a'; //testnet"0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

export const SavingsPoolABI2 = SavingsPoolAbi;
export const ManagementContractABI2 = ManagementAbi;
export const CusdAbi = cusdcAbi;
