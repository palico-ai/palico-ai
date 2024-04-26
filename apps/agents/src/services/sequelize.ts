import {
  Sequelize,
  DataTypes,
  type Optional,
  type ModelDefined
} from 'sequelize'
import * as dotenv from 'dotenv'

dotenv.config()

export const sequelize = new Sequelize(process.env["DB_URL"] ?? 'sqlite::memory:')

export interface ConversationAttributes {
  id: string
  historyJSON: string
  agentId: string
  createdAt: string
  updatedAt: string
}

export type ConversationCreationAttributes = Optional<
ConversationAttributes,
'id' | 'createdAt' | 'updatedAt'
>

export const ConversationTable: ModelDefined<
ConversationAttributes,
ConversationCreationAttributes
> = sequelize.define(
  'conversation_history',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    historyJSON: {
      type: DataTypes.TEXT
    },
    agentId: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true
  }
)