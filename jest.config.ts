import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // .ts (엔진/스토어), .tsx (컴포넌트) 모두 매칭
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
}

export default config
