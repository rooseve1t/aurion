import { createLogger } from '../core/Logger';

const logger = createLogger('RiskEngine');

export interface RiskFactors {
  deviceWeight: number;
  timeModifier: number;
  scenarioModifier: number;
  anomalyFactor: number;
  historicalPatternBoost: number;
}

export class RiskEngine {
  private config: RiskFactors;

  constructor(config: RiskFactors) {
    this.config = config;
  }

  calculateRisk(factors: RiskFactors): number {
    let risk = 0;
    risk += factors.deviceWeight * this.config.deviceWeight;
    risk += factors.timeModifier * this.config.timeModifier;
    risk += factors.scenarioModifier * this.config.scenarioModifier;
    risk += factors.anomalyFactor * this.config.anomalyFactor;
    risk += factors.historicalPatternBoost * this.config.historicalPatternBoost;

    logger.debug(`Calculated Risk: ${risk}`);
    return Math.min(100, Math.max(0, risk));
  }
}

export const riskEngine = new RiskEngine({
  deviceWeight: 1.0,
  timeModifier: 1.2,
  scenarioModifier: 1.5,
  anomalyFactor: 2.0,
  historicalPatternBoost: 0.8
});
