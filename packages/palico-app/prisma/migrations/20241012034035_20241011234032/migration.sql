-- CreateTable
CREATE TABLE "workflow_executions" (
    "requestId" VARCHAR(255) NOT NULL,
    "workflowName" VARCHAR(255),
    "graphJSON" JSONB,
    "executionStackJSON" JSONB,
    "status" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "workflow_executions_pkey" PRIMARY KEY ("requestId")
);

-- AddForeignKey
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "conversation_request_tracings"("requestId") ON DELETE NO ACTION ON UPDATE CASCADE;
