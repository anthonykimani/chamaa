import { faker } from '@faker-js/faker';
import { bufferToHex } from 'ethereumjs-util';
import crypto from 'crypto';

interface Pool {
  poolID: number;
  poolName: string;
  poolDescription: string;
  owner: string;
  token: string;
  maxParticipants: number;
  contributionPerParticipant: number;
  durationPerTurn: number;
  startTime: number;
  currentTurn: number;
  participants: string[];
  hasReceived: Record<string, boolean>;
  isActive: boolean;
  isRestrictedPool: boolean;
}

function getRandomAddress(): string {
  return bufferToHex(crypto.randomBytes(20));
}
function getRandomBool(): boolean {
  return Math.random() >= 0.5;
}

function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * max);
}

export function generateDummyData(): Pool[] {
  let data: Pool[] = [];

  for (let i = 0; i < 10; i++) {
    let participants = Array.from({ length: 10 }, getRandomAddress);
    let hasReceived: Record<string, boolean> = {};

    participants.forEach((participant) => {
      hasReceived[participant] = getRandomBool();
    });

    let pool: Pool = {
      poolID: getRandomNumber(100),
      poolName: faker.lorem.words(3),
      poolDescription: faker.lorem.sentence(),
      owner: getRandomAddress(),
      token: getRandomAddress(),
      maxParticipants: getRandomNumber(100),
      contributionPerParticipant: getRandomNumber(1000),
      durationPerTurn: getRandomNumber(60),
      startTime: Math.floor(Date.now() / 1000),
      currentTurn: getRandomNumber(10),
      participants: participants,
      hasReceived: hasReceived,
      isActive: getRandomBool(),
      isRestrictedPool: getRandomBool(),
    };

    data.push(pool);
  }

  return data;
}

console.log(JSON.stringify(generateDummyData(), null, 2));
