// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;

import "./Management.sol";

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(address, address, uint256) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract ChamaPool {
    ManagementContract mgmt;
    struct Pool {
        address owner;
        string name;
        address userTurnAddress;
        uint contributionPerParticipant;
        uint maxParticipants;
        uint durationPerTurn;
        uint currentTurn;
        bool active;
        address[] participants;
        uint _poolBalance;
        bool isRestrictedPool;
        uint userContibutionNumber;
        uint startTime;
        uint poolID;
    }
    address public owner;
    mapping(uint => mapping(address => uint)) public balances; // Mapping to track user balances per pool.
    mapping(uint => uint) public poolbalances;
    mapping(uint => uint) public poolContributionbalances;
    mapping(uint => mapping(address => bool)) public hascontributed;
    IERC20Token token;

    constructor(address _mgmt) {
        token = IERC20Token(cUsdTokenAddress);
        require(_mgmt != address(0), "Invalid Contract Address");

        mgmt = ManagementContract(_mgmt);
        owner = msg.sender;
    }

    struct TurnDetails {
        uint turnBal;
        uint endTime;
        address currentClaimant;
        bool active;
    }

    mapping(uint => Pool) public pools;
    mapping(uint => TurnDetails) public turn;
    //get the round for contributing
    /*
     @dev getting the total number of turns perpool
     */
    mapping(uint => mapping(address => uint)) public totalNumberOfTurnsPerpool;
    uint public poolCounter;

    address internal cUsdTokenAddress =0x765DE816845861e75A25fCA122bb6898B8B1282a; //0x78c4E798b65f1c96c4eEC6f5F93E51584593e723;

    event PoolCreated(
        uint poolId,
        address owner,
        string name,
        uint maxParticipants,
        uint contributionPerParticipant,
        uint durationPerTurn
    );
    event JoinedPool(uint poolId, address participant);
    event TurnClaimed(
        uint poolId,
        uint turnId,
        address participant,
        uint amount
    );

    function createPool(
        string calldata name,
        uint maxParticipants,
        uint contributionPerParticipant,
        uint durationPerTurn,
        bool _isRestricted
    ) external {
        require(maxParticipants > 0, "Max participants must be greater than 0");
        require(
            contributionPerParticipant > 0,
            "Contribution per participant must be greater than 0"
        );
        require(
            durationPerTurn > 0,
            "Duration per turn must be greater than 0"
        );
        require(
            token.transferFrom(
                msg.sender,
                address(this),
                (contributionPerParticipant * 2)
            ),
            "Top Up Your account"
        );
        uint _poolID = poolCounter;

        address[] memory initialParticipants = new address[](1);
        initialParticipants[0] = msg.sender; // Add the owner as the initial participant.
        uint poolBalance = contributionPerParticipant * 2;
        poolbalances[_poolID] += poolBalance;
        poolContributionbalances[_poolID] += poolBalance;
        pools[_poolID] = Pool(
            msg.sender,
            name,
            msg.sender,
            contributionPerParticipant,
            maxParticipants,
            durationPerTurn,
            0,
            false,
            initialParticipants,
            poolBalance,
            _isRestricted,
            0,
            0,
            _poolID 
        );

        emit PoolCreated(
            _poolID,
            msg.sender,
            name,
            maxParticipants,
            contributionPerParticipant,
            durationPerTurn
        );

        poolCounter++; //poolId, owner, name, maxParticipants, contributionPerParticipant, durationPerTurn, tokenAddress);
    }

    function joinPool(uint poolId) external {
        require(poolId < poolCounter, "Invalid pool ID");
        Pool storage pool = pools[poolId];
        require(pool.active == false, "Pool is already active");
        uint amount = pool.contributionPerParticipant * 2;
        //require(token.balanceOf(msg.sender) > pool.contributionPerParticipant * 2, "Contribution amount must be twice the amount per participant");
        require(
            mgmt.isBlacklisted(msg.sender) == false,
            "You are blacklisted from the pool for defaulting"
        );
        //If the pool is restricted, Only addresses that are Friendlies of the owner can join the pool
        if (pool.isRestrictedPool) {
            address pOwner = pool.owner;
            bool status = mgmt._checkStatus(pOwner, msg.sender);
            require(status == true, "You are not allowed in this pool");
        }
        token.transferFrom(msg.sender, address(this), amount);
        pool.participants.push(msg.sender);
        balances[poolId][msg.sender] += amount;
        poolContributionbalances[poolId] += amount;
        pool._poolBalance += amount;
        poolbalances[poolId] += amount;

        emit JoinedPool(poolId, msg.sender);

        if (pool.participants.length == pool.maxParticipants) {
            // Activate the pool if the maximum number of participants is reached.
            uint _endTime = block.timestamp + pool.durationPerTurn;
            address currentClaimant = pool.participants[pool.currentTurn];
            turn[poolId] = TurnDetails(
                poolbalances[poolId],
                _endTime,
                currentClaimant,
                false
            );
            pool.active = true;
            pool.startTime = block.timestamp;
        }
    }

    //check if is participant of a pool

    function isParticipantOfPool(
        uint poolId,
        address user
    ) internal view returns (bool) {
        require(poolId < poolCounter, "Invalid pool ID");
        Pool storage pool = pools[poolId];

        for (uint i = 0; i < pool.participants.length; i++) {
            if (pool.participants[i] == user) {
                return true; // User is a participant of the pool.
            }
        }

        return false; // User is not a participant of the pool.
    }

    //contribute
    function contributeToPool(uint _poolID) external {
        require(
            isParticipantOfPool(_poolID, msg.sender),
            "Not a participant in this pool"
        );
        Pool storage pool = pools[_poolID];

        // require(
        //     totalNumberOfTurnsPerpool[_poolID][msg.sender] <
        //         pool.participants.length,
        //     "done with the round"
        // );
        /**
         * @ check userturn equal to the current PoolTurn
         */
                require(
            totalNumberOfTurnsPerpool[_poolID][msg.sender] == pool.currentTurn,
               
            "done with the round"
        );
        uint _amount = pools[_poolID].contributionPerParticipant;
        if (pools[_poolID].participants.length == pools[_poolID].currentTurn) {
            require(
                hascontributed[_poolID][msg.sender] == false,
                "done with the round"
            );
        }

        _contributeToPool(_poolID, _amount);

        // _updateTurn(_poolID);
    }

    //function return deposits
    function withdrawDepositFromPool(uint _poolId) internal {
        require(_poolId < poolCounter, "Invalid pool ID");
        _returnDeposits(_poolId);
    }

    function _returnDeposits(uint _poolId) internal {
        require(
            pools[_poolId]._poolBalance <= poolbalances[_poolId],
            "not all have claimed"
        );
        for (uint i = 0; i < pools[_poolId].participants.length; i++) {
            address participant = pools[_poolId].participants[i];
            uint balance = balances[_poolId][participant];
            token.transfer(msg.sender, balance);
            balances[_poolId][participant] = 0;
        }

        pools[_poolId]._poolBalance = 0;
        poolbalances[_poolId] = 0;
    }

    function _contributeToPool(uint poolId, uint _amount) internal {
        require(poolId < poolCounter, "Invalid pool ID");
        Pool storage pool = pools[poolId];
        require(pool.active, "Pool is not active");

        require(
            _amount == pool.contributionPerParticipant,
            "Contribution amount must match the specified amount per participant"
        );

        // Update the user's balance within this pool.
        token.transferFrom(msg.sender, address(this), _amount);
        balances[poolId][msg.sender] += _amount;
        poolbalances[poolId] += _amount;
        pool._poolBalance += _amount;
        hascontributed[poolId][msg.sender] = true;
        totalNumberOfTurnsPerpool[poolId][msg.sender] += 1;
    }

    //claim pool
    function claimTurn(uint poolId) external {
        require(poolId < poolCounter, "Invalid pool ID");
        Pool storage pool = pools[poolId];
        require(pool.active, "Pool is not active");
        require(
            isParticipantOfPool(poolId, msg.sender),
            "You are not a participant of this pool"
        );

        address currentClaimant = pool.participants[pool.currentTurn];

        require(currentClaimant == msg.sender, "It's not your turn to claim");
          require(
    pool.currentTurn < pool.participants.length,
    "done with the round"
);
        require(turn[poolId].endTime <= block.timestamp, "waitfor turn to end");
        
        require( poolContributionbalances[poolId] > 0,"notcontributed for this turn yet" );
        
        // Transfer the turn balance to the claimant.
        uint amountToTransfer = poolbalances[poolId] -
            poolContributionbalances[poolId];
        token.transfer(msg.sender, amountToTransfer);
        poolbalances[poolId] -= amountToTransfer;
        pool._poolBalance -= amountToTransfer;

 if (pool.currentTurn == pool.participants.length - 1) {
    // Call withdrawDepositFromPool as the last participant has claimed their turn
    withdrawDepositFromPool(poolId);
}else{
 // Update the turn details.
        pool.currentTurn += 1;
        pool.userTurnAddress = pool.participants[pool.currentTurn];

        uint _time = block.timestamp + pool.durationPerTurn;
        _updateTurn(poolId, _time, msg.sender);
        // Increment the turn counter for the next participant.
        pool.userContibutionNumber += 1;

        emit TurnClaimed(
            poolId,
            pool.currentTurn,
            msg.sender,
            amountToTransfer
        );
        
}
       
    }

    //update turn
    function _updateTurn(uint _poolId, uint time, address user) internal {
        balances[_poolId][msg.sender] = 0;

        turn[_poolId].endTime = time;
        turn[_poolId].currentClaimant = user;
    }

    //getall
    function getOwnerSavingPools(
        address ownerAddress
    ) public view returns (Pool[] memory) {
        uint ownedPoolsCount = 0;

        // Count the number of pools owned by the specified address
        for (uint i = 0; i <= poolCounter; i++) {
            if (pools[i].owner == ownerAddress) {
                ownedPoolsCount++;
            }
        }

        // Create an array to store owned pools
        Pool[] memory ownedPools = new Pool[](ownedPoolsCount);
        uint currentIndex = 0;

        // Populate the array with owned pools
        for (uint i = 0; i <= poolCounter; i++) {
            if (pools[i].owner == ownerAddress) {
                ownedPools[currentIndex] = pools[i];
                currentIndex++;
            }
        }

        return ownedPools;
    }

    // Modify the original getAllSavingPools to return all pools
    function getAllSavingPools() public view returns (Pool[] memory) {
        Pool[] memory result = new Pool[](poolCounter);

        for (uint i = 1; i <= poolCounter; i++) {
            result[i - 1] = pools[i];
        }

        return result;
    }

    //getTurns
    function getTurnDetails(
        uint poolId
    ) external view returns (TurnDetails memory) {
        require(poolId < poolCounter, "Invalid pool ID");
        return turn[poolId];
    }
}
