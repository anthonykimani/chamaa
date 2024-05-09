import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  JoinedPool,
  PoolCreated,
  TurnClaimed
} from "../generated/ChamaPool/ChamaPool"

export function createJoinedPoolEvent(
  poolId: BigInt,
  participant: Address
): JoinedPool {
  let joinedPoolEvent = changetype<JoinedPool>(newMockEvent())

  joinedPoolEvent.parameters = new Array()

  joinedPoolEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  joinedPoolEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )

  return joinedPoolEvent
}

export function createPoolCreatedEvent(
  poolId: BigInt,
  owner: Address,
  name: string,
  maxParticipants: BigInt,
  contributionPerParticipant: BigInt,
  durationPerTurn: BigInt
): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent())

  poolCreatedEvent.parameters = new Array()

  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "maxParticipants",
      ethereum.Value.fromUnsignedBigInt(maxParticipants)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "contributionPerParticipant",
      ethereum.Value.fromUnsignedBigInt(contributionPerParticipant)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "durationPerTurn",
      ethereum.Value.fromUnsignedBigInt(durationPerTurn)
    )
  )

  return poolCreatedEvent
}

export function createTurnClaimedEvent(
  poolId: BigInt,
  turnId: BigInt,
  participant: Address,
  amount: BigInt
): TurnClaimed {
  let turnClaimedEvent = changetype<TurnClaimed>(newMockEvent())

  turnClaimedEvent.parameters = new Array()

  turnClaimedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  turnClaimedEvent.parameters.push(
    new ethereum.EventParam("turnId", ethereum.Value.fromUnsignedBigInt(turnId))
  )
  turnClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  turnClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return turnClaimedEvent
}
