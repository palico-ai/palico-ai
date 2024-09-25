-- CreateTable
CREATE TABLE "request_logs" (
    "requestId" VARCHAR(255) NOT NULL,
    "logs" JSONB,

    CONSTRAINT "request_logs_pkey" PRIMARY KEY ("requestId")
);

-- AddForeignKey
ALTER TABLE "request_logs" ADD CONSTRAINT "request_logs_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "conversation_request_tracings"("requestId") ON DELETE CASCADE ON UPDATE CASCADE;
