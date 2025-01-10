import { State } from "@elizaos/core";

export interface PositionConfig {

}

export interface PositionState extends State {
    config: PositionConfig;
    lastCheck: number;
  }