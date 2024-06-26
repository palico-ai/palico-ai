-- CreateTable
CREATE TABLE "conversation_request_tracings" (
    "requestId" VARCHAR(255) NOT NULL,
    "conversationId" VARCHAR(255),
    "requestInput" JSONB,
    "responseOutput" JSONB,
    "appConfig" JSONB,
    "traceId" VARCHAR(255),
    "tracePreviewUrl" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "conversation_request_tracings_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "conversation_tracings" (
    "conversationId" VARCHAR(255) NOT NULL,
    "agentName" VARCHAR(255),
    "workflowName" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "conversation_tracings_pkey" PRIMARY KEY ("conversationId")
);

-- CreateTable
CREATE TABLE "simple_chat_histories" (
    "conversationId" VARCHAR(255) NOT NULL,
    "messagesJSON" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "simple_chat_histories_pkey" PRIMARY KEY ("conversationId")
);

-- AddForeignKey
ALTER TABLE "conversation_request_tracings" ADD CONSTRAINT "conversation_request_tracings_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation_tracings"("conversationId") ON DELETE CASCADE ON UPDATE CASCADE;
