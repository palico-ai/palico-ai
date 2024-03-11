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
  id: number
  toolJSON: string
  historyJSON: string
  metadataJSON?: string
  createdAt: string
  updatedAt: string
}

export type ConversationCreationAttributes = Optional<
ConversationAttributes,
'id' | 'createdAt' | 'updatedAt' | 'metadataJSON'
>

export const ConversationTable: ModelDefined<
ConversationAttributes,
ConversationCreationAttributes
> = sequelize.define(
  'Conversation',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    toolJSON: {
      type: DataTypes.TEXT
    },
    historyJSON: {
      type: DataTypes.TEXT
    },
    metadataJSON: {
      type: DataTypes.TEXT
    }
  },
  {
    timestamps: true
  }
)
