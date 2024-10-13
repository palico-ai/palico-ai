import { Sequelize, DataTypes, Optional, ModelDefined } from 'sequelize';
import * as dotenv from 'dotenv';
import {
  AgentConversationTraceWithRequest,
  AgentRequestTrace,
  RequestSpan,
  RequestLogs,
  AppScriptRequest,
} from '@palico-ai/common';
import config from '../../config';

export interface WaitForDBConnectionParams {
  dbUrl?: string;
}

dotenv.config();

const dbURL = config.getDBUrl();

if (!dbURL) {
  throw new Error('Database URL is not defined');
}

export const sequelize = new Sequelize(dbURL);

// ================== Table Schema ==================

/**
 * Top level container for conversation traces that holds all child request traces
 */
export type AgentConversationTracingTableSchema = Omit<
  AgentConversationTraceWithRequest,
  'requests'
>;

/**
 * Table schema for individual request traces within a conversation
 */
export type AgentRequestTracingTableSchema = Omit<
  AgentRequestTrace,
  'requestInput' | 'responseOutput' | 'appConfig'
> & {
  requestInput: string; // JSON stringified
  responseOutput: string; // JSON stringified
  appConfig: string; // JSON stringified
};

export type RequestSpanTableSchema = Omit<
  RequestSpan,
  'attributes' | 'events'
> & {
  attributes: string; // JSON stringified
  events: string; // JSON stringified
};

export type RequestLogsTableSchema = Omit<RequestLogs, 'logs'> & {
  logs: string; // JSON stringified
};

/**
 * Table schema for storing Chat History for conversational agents
 */
export interface SimpleChatHistoryTableSchema {
  conversationId: string;
  messagesJSON: string;
  createdAt: string;
  updatedAt: string;
}

export type AppScriptRequestTableSchema = Omit<AppScriptRequest, 'input'> & {
  inputJSON: string;
};

// ================== Define Tables ==================
export type CreateRequestSpanParams = RequestSpanTableSchema;

export const RequestSpanTable: ModelDefined<
  RequestSpanTableSchema,
  CreateRequestSpanParams
> = sequelize.define(
  'request_span',
  {
    spanId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    requestId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // @deprecated - will be removed in next major version
    conversationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentSpanId: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attributes: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    events: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export type CreateRequestLogsParams = RequestLogsTableSchema;

export const RequestLogsTable: ModelDefined<
  RequestLogsTableSchema,
  CreateRequestLogsParams
> = sequelize.define(
  'request_logs',
  {
    requestId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    logs: {
      type: DataTypes.JSONB,
    },
  },
  {
    timestamps: false,
  }
);

export type CreateAgentRequestTraceParams = Omit<
  AgentRequestTracingTableSchema,
  'createdAt' | 'updatedAt'
>;

export const AgentRequestTracingTable: ModelDefined<
  AgentRequestTracingTableSchema,
  CreateAgentRequestTraceParams
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
    appConfig: {
      type: DataTypes.JSONB,
    },
    // @deprecated
    traceId: {
      type: DataTypes.STRING,
    },
    // @deprecated
    tracePreviewUrl: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

export type CreateAgentConversationTracingParams = Omit<
  AgentConversationTracingTableSchema,
  'createdAt' | 'updatedAt'
>;

export const AgentConversationTracingTable: ModelDefined<
  AgentConversationTracingTableSchema,
  CreateAgentConversationTracingParams
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
    // @deprecated
    workflowName: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

export type SimpleChatHistoryCreationAttributes = Optional<
  SimpleChatHistoryTableSchema,
  'createdAt' | 'updatedAt'
>;

export const SimpleChatHistoryTable: ModelDefined<
  SimpleChatHistoryTableSchema,
  SimpleChatHistoryCreationAttributes
> = sequelize.define(
  'simple_chat_history',
  {
    conversationId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    messagesJSON: {
      type: DataTypes.JSONB,
    },
  },
  {
    timestamps: true,
  }
);

export type CreateAppScriptRequestParams = Omit<
  AppScriptRequestTableSchema,
  'createdAt' | 'updatedAt'
>;

export const AppScriptRequestTable: ModelDefined<
  AppScriptRequestTableSchema,
  CreateAppScriptRequestParams
> = sequelize.define(
  'app_script_request',
  {
    requestId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    scriptName: {
      type: DataTypes.STRING,
    },
    inputJSON: {
      type: DataTypes.JSONB,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

AgentConversationTracingTable.hasMany(AgentRequestTracingTable, {
  foreignKey: 'conversationId',
  onDelete: 'CASCADE',
});

AgentRequestTracingTable.belongsTo(AgentConversationTracingTable, {
  foreignKey: 'conversationId',
});

AgentConversationTracingTable.hasMany(RequestSpanTable, {
  foreignKey: 'conversationId',
});

RequestSpanTable.belongsTo(AgentConversationTracingTable, {
  foreignKey: 'conversationId',
});

AgentRequestTracingTable.hasMany(RequestSpanTable, {
  foreignKey: 'requestId',
  onDelete: 'CASCADE',
});

RequestSpanTable.belongsTo(AgentRequestTracingTable, {
  foreignKey: 'requestId',
});

AgentRequestTracingTable.hasOne(RequestLogsTable, {
  foreignKey: 'requestId',
  onDelete: 'CASCADE',
});

RequestLogsTable.belongsTo(AgentRequestTracingTable, {
  foreignKey: 'requestId',
});
