import {
  JoinedPool as JoinedPoolEvent,
  PoolCreated as PoolCreatedEvent,
  TurnClaimed as TurnClaimedEvent
} from "../generated/ChamaPool/ChamaPool"
import { JoinedPool, PoolCreated, TurnClaimed } from "../generated/schema"

export function handleJoinedPool(event: JoinedPoolEvent): void {
  let entity = new JoinedPool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.poolId = event.params.poolId
  entity.participant = event.params.participant

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let entity = new PoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.poolId = event.params.poolId
  entity.owner = event.params.owner
  entity.name = event.params.name
  entity.maxParticipants = event.params.maxParticipants
  entity.contributionPerParticipant = event.params.contributionPerParticipant
  entity.durationPerTurn = event.params.durationPerTurn

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}


export function handleTurnClaimed(event: TurnClaimedEvent): void {
  let entity = new TurnClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.poolId = event.params.poolId
  entity.turnId = event.params.turnId
  entity.participant = event.params.participant
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
