-- CreateTable
CREATE TABLE "app_script_requests" (
    "requestId" VARCHAR(255) NOT NULL,
    "scriptName" VARCHAR(255),
    "inputJSON" JSONB,
    "status" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "app_script_requests_pkey" PRIMARY KEY ("requestId")
);
