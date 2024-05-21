import {
  Sequelize,
  DataTypes,
  Optional,
  ModelDefined,
} from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env['DB_URL'] ?? 'sqlite::memory:'
);

export interface AgentRequestTableModel {
  id: string;
  conversationId: string;
  agentId: string;
  requestTraceId: string;
  createdAt: string;
  updatedAt: string;
}

export type AgentRequestCreateParams = Optional<
  AgentRequestTableModel,
  'id' | 'createdAt' | 'updatedAt'
>;

export const AgentRequestTable: ModelDefined<
  AgentRequestTableModel,
  AgentRequestCreateParams
> = sequelize.define(
  'agent_request',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.STRING,
    },
    agentId: {
      type: DataTypes.STRING,
    },
    requestTraceId: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

export interface StudioLabAttriutes {
  id: string;
  name: string;
  experimentListJSON: string;
  testCasesJSON: string;
  experimentTestResultJSON: string;
  createdAt: string;
  updatedAt: string;
}

export type StudioLabCreationAttributes = Optional<
  StudioLabAttriutes,
  'id' | 'createdAt' | 'updatedAt'
>;

export const StudioLabTable: ModelDefined<
  StudioLabAttriutes,
  StudioLabCreationAttributes
> = sequelize.define(
  'studio_lab',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    experimentListJSON: {
      type: DataTypes.JSONB,
    },
    testCasesJSON: {
      type: DataTypes.JSONB,
    },
    experimentTestResultJSON: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

sequelize.sync({
  force: false
})

// export const syncDB = async (force = false) => {
//   await sequelize.sync({
//     force,
//   });
// }