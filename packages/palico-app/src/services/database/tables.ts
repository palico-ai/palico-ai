import { Sequelize, DataTypes, Optional, ModelDefined } from 'sequelize';
import * as dotenv from 'dotenv';
import {
  ConversationTelemetry,
  ConversationRequestTelemetryItem,
  ConversationRequestSpan,
  RequestLogs,
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
export type ConversationTracingTableSchema = Omit<
  ConversationTelemetry,
  'requests'
>;

/**
 * Table schema for individual request traces within a conversation
 */
export type ConversationRequestTraceTableSchema = Omit<
  ConversationRequestTelemetryItem,
  'requestInput' | 'responseOutput' | 'appConfig'
> & {
  requestInput: string; // JSON stringified
  responseOutput: string; // JSON stringified
  appConfig: string; // JSON stringified
};

export type ConversationRequestSpanTableSchema = Omit<
  ConversationRequestSpan,
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
export interface SimpleChatHistorySchema {
  conversationId: string;
  messagesJSON: string;
  createdAt: string;
  updatedAt: string;
}

// ================== Define Tables ==================
export type CreateRequestSpanParams = ConversationRequestSpanTableSchema;

export const RequestSpanTable: ModelDefined<
  ConversationRequestSpanTableSchema,
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

export type CreateConversationRequestTraceParams = Omit<
  ConversationRequestTraceTableSchema,
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

export type CreateConversationTracingParams = Omit<
  ConversationTracingTableSchema,
  'createdAt' | 'updatedAt'
>;

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

export type SimpleChatHistoryCreationAttributes = Optional<
  SimpleChatHistorySchema,
  'createdAt' | 'updatedAt'
>;

export const SimpleChatHistoryTable: ModelDefined<
  SimpleChatHistorySchema,
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

ConversationTracingTable.hasMany(ConversationRequestTracingTable, {
  foreignKey: 'conversationId',
  onDelete: 'CASCADE',
});

ConversationRequestTracingTable.belongsTo(ConversationTracingTable, {
  foreignKey: 'conversationId',
});

ConversationTracingTable.hasMany(RequestSpanTable, {
  foreignKey: 'conversationId',
});

RequestSpanTable.belongsTo(ConversationTracingTable, {
  foreignKey: 'conversationId',
});

ConversationRequestTracingTable.hasMany(RequestSpanTable, {
  foreignKey: 'requestId',
  onDelete: 'CASCADE',
});

RequestSpanTable.belongsTo(ConversationRequestTracingTable, {
  foreignKey: 'requestId',
});

ConversationRequestTracingTable.hasOne(RequestLogsTable, {
  foreignKey: 'requestId',
  onDelete: 'CASCADE',
});

RequestLogsTable.belongsTo(ConversationRequestTracingTable, {
  foreignKey: 'requestId',
});
