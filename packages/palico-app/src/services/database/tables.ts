import { Sequelize, DataTypes, Optional, ModelDefined } from 'sequelize';
import * as dotenv from 'dotenv';
import {
  ConversationTraces,
  ConversationRequestTraceItem,
} from '@palico-ai/common';
import config from '../../config';

dotenv.config();

const dbURL = config.getDBUrl();

if (!dbURL) {
  throw new Error('Database URL is not defined');
}

export const sequelize = new Sequelize(dbURL);

export interface StudioLabAttriutes {
  id: string;
  name: string;
  experimentListJSON: string;
  testCasesJSON: string;
  experimentTestResultJSON: string;
  baselineExperimentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type StudioLabCreationAttributes = Optional<
  StudioLabAttriutes,
  'id' | 'createdAt' | 'updatedAt'
>;

export type ConversationRequestTraceTableSchema = Omit<
  ConversationRequestTraceItem,
  'requestInput' | 'responseOutput' | 'featureFlag'
> & {
  requestInput: string; // JSON stringified
  responseOutput: string; // JSON stringified
  featureFlag: string; // JSON stringified
};
export type CreateConversationRequestTraceParams = Omit<
  ConversationRequestTraceTableSchema,
  'createdAt' | 'updatedAt'
>;

export type ConversationTracingTableSchema = Omit<
  ConversationTraces,
  'requests'
>;
export type CreateConversationTracingParams = Omit<
  ConversationTracingTableSchema,
  'createdAt' | 'updatedAt'
>;

export const ConversationRequestTracingTable: ModelDefined<
  ConversationRequestTraceTableSchema,
  CreateConversationRequestTraceParams
> = sequelize.define(
  'conversation_request_tracing',
  {
    requestId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.STRING,
    },
    requestInput: {
      type: DataTypes.JSONB,
    },
    responseOutput: {
      type: DataTypes.JSONB,
    },
    featureFlag: {
      type: DataTypes.STRING,
    },
    traceId: {
      type: DataTypes.STRING,
    },
    tracePreviewUrl: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

export const ConversationTracingTable: ModelDefined<
  ConversationTracingTableSchema,
  CreateConversationTracingParams
> = sequelize.define(
  'conversation_tracing',
  {
    conversationId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    agentName: {
      type: DataTypes.STRING,
    },
    workflowName: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

ConversationTracingTable.hasMany(ConversationRequestTracingTable, {
  foreignKey: 'conversationId',
  onDelete: 'CASCADE',
});

ConversationRequestTracingTable.belongsTo(ConversationTracingTable, {
  foreignKey: 'conversationId',
});
