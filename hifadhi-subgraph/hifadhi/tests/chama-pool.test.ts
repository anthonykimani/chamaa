import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { JoinedPool } from "../generated/schema"
import { JoinedPool as JoinedPoolEvent } from "../generated/ChamaPool/ChamaPool"
import { handleJoinedPool } from "../src/chama-pool"
import { createJoinedPoolEvent } from "./chama-pool-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let poolId = BigInt.fromI32(234)
    let participant = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newJoinedPoolEvent = createJoinedPoolEvent(poolId, participant)
    handleJoinedPool(newJoinedPoolEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("JoinedPool created and stored", () => {
    assert.entityCount("JoinedPool", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "JoinedPool",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolId",
      "234"
    )
    assert.fieldEquals(
      "JoinedPool",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "participant",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
