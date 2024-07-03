-- CreateTable
CREATE TABLE "request_spans" (
    "spanId" VARCHAR(255) NOT NULL,
    "requestId" VARCHAR(255) NOT NULL,
    "conversationId" VARCHAR(255) NOT NULL,
    "parentSpanId" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "attributes" JSONB NOT NULL,
    "events" JSONB NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "statusCode" INTEGER NOT NULL,

    CONSTRAINT "request_spans_pkey" PRIMARY KEY ("spanId")
);

-- AddForeignKey
ALTER TABLE "request_spans" ADD CONSTRAINT "request_spans_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation_tracings"("conversationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_spans" ADD CONSTRAINT "request_spans_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "conversation_request_tracings"("requestId") ON DELETE CASCADE ON UPDATE CASCADE;
