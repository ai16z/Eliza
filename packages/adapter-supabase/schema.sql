-- Enable pgvector extension

-- -- Drop existing tables and extensions
-- DROP EXTENSION IF EXISTS vector CASCADE;
-- DROP TABLE IF EXISTS relationships CASCADE;
-- DROP TABLE IF EXISTS participants CASCADE;
-- DROP TABLE IF EXISTS logs CASCADE;
-- DROP TABLE IF EXISTS goals CASCADE;
-- DROP TABLE IF EXISTS memories CASCADE;
-- DROP TABLE IF EXISTS rooms CASCADE;
-- DROP TABLE IF EXISTS accounts CASCADE;
-- DROP TABLE IF EXISTS knowledge CASCADE;


CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

BEGIN;

CREATE TABLE accounts (
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "details" JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE rooms (
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create tables for both vector sizes
CREATE TABLE memories_1536 (
    "id" UUID PRIMARY KEY,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "content" JSONB NOT NULL,
    "embedding" vector(1536),
    "userId" UUID REFERENCES accounts("id"),
    "agentId" UUID REFERENCES accounts("id"),
    "roomId" UUID REFERENCES rooms("id"),
    "unique" BOOLEAN DEFAULT true NOT NULL,
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE,
    CONSTRAINT fk_agent FOREIGN KEY ("agentId") REFERENCES accounts("id") ON DELETE CASCADE
);

CREATE TABLE memories_1024 (
    "id" UUID PRIMARY KEY,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "content" JSONB NOT NULL,
    "embedding" vector(1024),  -- Ollama mxbai-embed-large
    "userId" UUID REFERENCES accounts("id"),
    "agentId" UUID REFERENCES accounts("id"),
    "roomId" UUID REFERENCES rooms("id"),
    "unique" BOOLEAN DEFAULT true NOT NULL,
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE,
    CONSTRAINT fk_agent FOREIGN KEY ("agentId") REFERENCES accounts("id") ON DELETE CASCADE
);

CREATE TABLE memories_768 (
    "id" UUID PRIMARY KEY,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "content" JSONB NOT NULL,
    "embedding" vector(768),  -- Gaianet nomic-embed
    "userId" UUID REFERENCES accounts("id"),
    "agentId" UUID REFERENCES accounts("id"),
    "roomId" UUID REFERENCES rooms("id"),
    "unique" BOOLEAN DEFAULT true NOT NULL,
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE,
    CONSTRAINT fk_agent FOREIGN KEY ("agentId") REFERENCES accounts("id") ON DELETE CASCADE
);

CREATE TABLE memories_384 (
    "id" UUID PRIMARY KEY,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "content" JSONB NOT NULL,
    "embedding" vector(384),
    "userId" UUID REFERENCES accounts("id"),
    "agentId" UUID REFERENCES accounts("id"),
    "roomId" UUID REFERENCES rooms("id"),
    "unique" BOOLEAN DEFAULT true NOT NULL,
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE,
    CONSTRAINT fk_agent FOREIGN KEY ("agentId") REFERENCES accounts("id") ON DELETE CASCADE
);

-- Update view to include Ollama table
CREATE VIEW memories AS
    SELECT * FROM memories_1536
    UNION ALL
    SELECT * FROM memories_1024
    UNION ALL
    SELECT * FROM memories_768
    UNION ALL
    SELECT * FROM memories_384;


CREATE TABLE goals (
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID REFERENCES accounts("id"),
    "name" TEXT,
    "status" TEXT,
    "description" TEXT,
    "roomId" UUID REFERENCES rooms("id"),
    "objectives" JSONB DEFAULT '[]'::jsonb NOT NULL,
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE
);

CREATE TABLE logs (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL REFERENCES accounts("id"),
    "body" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "roomId" UUID NOT NULL REFERENCES rooms("id"),
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE
);

CREATE TABLE participants (
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID REFERENCES accounts("id"),
    "roomId" UUID REFERENCES rooms("id"),
    "userState" TEXT,
    "last_message_read" TEXT,
    UNIQUE("userId", "roomId"),
    CONSTRAINT fk_room FOREIGN KEY ("roomId") REFERENCES rooms("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE
);

CREATE TABLE relationships (
    "id" UUID PRIMARY KEY,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "userA" UUID NOT NULL REFERENCES accounts("id"),
    "userB" UUID NOT NULL REFERENCES accounts("id"),
    "status" TEXT,
    "userId" UUID NOT NULL REFERENCES accounts("id"),
    CONSTRAINT fk_user_a FOREIGN KEY ("userA") REFERENCES accounts("id") ON DELETE CASCADE,
    CONSTRAINT fk_user_b FOREIGN KEY ("userB") REFERENCES accounts("id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES accounts("id") ON DELETE CASCADE
);

CREATE TABLE cache (
    "key" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "value" JSONB DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP,
    PRIMARY KEY ("key", "agentId")
);

CREATE TABLE knowledge (
    "id" UUID PRIMARY KEY,
    "agentId" UUID REFERENCES accounts("id"),
    "content" JSONB NOT NULL,
    "embedding" vector(1536),
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "isMain" BOOLEAN DEFAULT FALSE,
    "originalId" UUID REFERENCES knowledge("id"),
    "chunkIndex" INTEGER,
    "isShared" BOOLEAN DEFAULT FALSE,
    CHECK(("isShared" = true AND "agentId" IS NULL) OR ("isShared" = false AND "agentId" IS NOT NULL))
);

-- Add index for Ollama table
CREATE INDEX idx_memories_1024_embedding ON memories_1024 USING hnsw ("embedding" vector_cosine_ops);
CREATE INDEX idx_memories_1024_type_room ON memories_1024("type", "roomId");
CREATE INDEX idx_memories_768_embedding ON memories_768 USING hnsw ("embedding" vector_cosine_ops);
CREATE INDEX idx_memories_768_type_room ON memories_768("type", "roomId");
CREATE INDEX idx_memories_1536_embedding ON memories_1536 USING hnsw ("embedding" vector_cosine_ops);
CREATE INDEX idx_memories_384_embedding ON memories_384 USING hnsw ("embedding" vector_cosine_ops);
CREATE INDEX idx_memories_1536_type_room ON memories_1536("type", "roomId");
CREATE INDEX idx_memories_384_type_room ON memories_384("type", "roomId");
CREATE INDEX idx_participants_user ON participants("userId");
CREATE INDEX idx_participants_room ON participants("roomId");
CREATE INDEX idx_relationships_users ON relationships("userA", "userB");
CREATE INDEX idx_knowledge_agent ON knowledge("agentId");
CREATE INDEX idx_knowledge_agent_main ON knowledge("agentId", "isMain");
CREATE INDEX idx_knowledge_original ON knowledge("originalId");
CREATE INDEX idx_knowledge_created ON knowledge("agentId", "createdAt");
CREATE INDEX idx_knowledge_shared ON knowledge("isShared");
CREATE INDEX idx_knowledge_embedding ON knowledge USING ivfflat (embedding vector_cosine_ops);

CREATE OR REPLACE FUNCTION "public"."check_similarity_and_insert"("query_table_name" "text", "query_userid" "uuid", "query_content" "text", "query_roomid" "uuid", "query_embedding" "public"."vector", "query_createdat" timestamp with time zone, "similarity_threshold" double precision DEFAULT 0.95) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    similar_exists BOOLEAN;
BEGIN
    -- Check which table to query based on embedding size
    CASE query_table_name
    WHEN 'memories_1536' THEN
        SELECT EXISTS (
            SELECT 1 FROM memories_1536
            WHERE roomId = query_roomId
            AND userId = query_userId
            AND content->>'text' = query_content
            AND 1 - (embedding <=> query_embedding) > similarity_threshold
        ) INTO similar_exists;
    WHEN 'memories_1024' THEN
        SELECT EXISTS (
            SELECT 1 FROM memories_1024
            WHERE roomId = query_roomId
            AND userId = query_userId
            AND content->>'text' = query_content
            AND 1 - (embedding <=> query_embedding) > similarity_threshold
        ) INTO similar_exists;
    WHEN 'memories_768' THEN
        SELECT EXISTS (
            SELECT 1 FROM memories_768
            WHERE roomId = query_roomId
            AND userId = query_userId
            AND content->>'text' = query_content
            AND 1 - (embedding <=> query_embedding) > similarity_threshold
        ) INTO similar_exists;
    WHEN 'memories_384' THEN
        SELECT EXISTS (
            SELECT 1 FROM memories_384
            WHERE roomId = query_roomId
            AND userId = query_userId
            AND content->>'text' = query_content
            AND 1 - (embedding <=> query_embedding) > similarity_threshold
        ) INTO similar_exists;
    ELSE
        RAISE EXCEPTION 'Invalid table name: %', query_table_name;
    END CASE;

    -- Only insert if no similar memory exists
    IF NOT similar_exists THEN
        CASE query_table_name
        WHEN 'memories_1536' THEN
            INSERT INTO memories_1536 (id, type, "createdAt", content, embedding, "userId", "roomId", "unique")
            VALUES (gen_random_uuid(), 'message', query_createdAt, jsonb_build_object('text', query_content), query_embedding, query_userId, query_roomId, true);
        WHEN 'memories_1024' THEN
            INSERT INTO memories_1024 (id, type, "createdAt", content, embedding, "userId", "roomId", "unique")
            VALUES (gen_random_uuid(), 'message', query_createdAt, jsonb_build_object('text', query_content), query_embedding, query_userId, query_roomId, true);
        WHEN 'memories_768' THEN
            INSERT INTO memories_768 (id, type, "createdAt", content, embedding, "userId", "roomId", "unique")
            VALUES (gen_random_uuid(), 'message', query_createdAt, jsonb_build_object('text', query_content), query_embedding, query_userId, query_roomId, true);
        WHEN 'memories_384' THEN
            INSERT INTO memories_384 (id, type, "createdAt", content, embedding, "userId", "roomId", "unique")
            VALUES (gen_random_uuid(), 'message', query_createdAt, jsonb_build_object('text', query_content), query_embedding, query_userId, query_roomId, true);
        END CASE;
    END IF;
END;
$$;


CREATE OR REPLACE FUNCTION "public"."count_memories"("query_table_name" "text", "query_roomId" "uuid", "query_unique" boolean DEFAULT false) RETURNS bigint
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) FROM public.memories
        WHERE public.memories."type" = "query_table_name"
        AND ("query_roomId" IS NULL OR public.memories."roomId" = "query_roomId")
        AND ("query_unique" IS FALSE OR public.memories."unique" = TRUE)
    );
END;
$$;

CREATE OR REPLACE FUNCTION "public"."create_room"("roomId" "uuid") RETURNS TABLE("id" "uuid")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY INSERT INTO public.rooms ("id") VALUES ("roomId") RETURNING public.rooms."id";
END;
$$;


CREATE OR REPLACE FUNCTION "public"."get_embedding_list"("query_table_name" "text", "query_threshold" integer, "query_input" "text", "query_field_name" "text", "query_field_sub_name" "text", "query_match_count" integer) RETURNS TABLE("embedding" "public"."vector", "levenshtein_score" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT public.memories."embedding", levenshtein("query_input", (public.memories."content"->>"query_field_name")::TEXT) AS "levenshtein_score"
    FROM public.memories
    WHERE public.memories."type" = "query_table_name"
    AND levenshtein("query_input", (public.memories."content"->>"query_field_name")::TEXT) <= "query_threshold"
    ORDER BY "levenshtein_score"
    LIMIT "query_match_count";
END;
$$;


CREATE OR REPLACE FUNCTION "public"."get_goals"("query_roomid" "uuid", "query_userid" "uuid" DEFAULT NULL::"uuid", "only_in_progress" boolean DEFAULT true, "row_count" integer DEFAULT 5) RETURNS SETOF "public"."goals"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM goals
    WHERE
        (query_userId IS NULL OR userId = query_userId)
        AND (roomId = query_roomId)
        AND (NOT only_in_progress OR status = 'IN_PROGRESS')
    LIMIT row_count;
END;
$$;


CREATE OR REPLACE FUNCTION "public"."get_relationship"("userA" "uuid", "userB" "uuid") RETURNS SETOF "public"."relationships"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.relationships
    WHERE (public.relationships."userA" = "userA" AND public.relationships."userB" = "userB")
    OR (public.relationships."userA" = "userB" AND public.relationships."userB" = "userA");
END;
$$;


CREATE OR REPLACE FUNCTION "public"."remove_memories"("query_table_name" "text", "query_roomId" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    DELETE FROM public.memories WHERE public.memories."roomId" = "query_roomId" AND public.memories."type" = "query_table_name";
END;
$$;


CREATE OR REPLACE FUNCTION "public"."search_knowledge"("query_embedding" "public"."vector", "query_agent_id" "uuid", "match_threshold" double precision, "match_count" integer, "search_text" "text") RETURNS TABLE("id" "uuid", "agentId" "uuid", "content" "jsonb", "embedding" "public"."vector", "createdAt" timestamp with time zone, "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    WITH vector_matches AS (
        SELECT public.knowledge."id",
            1 - (public.knowledge."embedding" <=> "query_embedding") AS "vector_score"
        FROM public.knowledge
        WHERE (public.knowledge."agentId" IS NULL AND public.knowledge."isShared" = true) OR public.knowledge."agentId" = "query_agent_id"
        AND public.knowledge."embedding" IS NOT NULL
    ),
    keyword_matches AS (
        SELECT public.knowledge."id",
        CASE
            WHEN public.knowledge."content"->>'text' ILIKE '%' || "search_text" || '%' THEN 3.0
            ELSE 1.0
        END *
        CASE
            WHEN public.knowledge."content"->'metadata'->>'isChunk' = 'true' THEN 1.5
            WHEN public.knowledge."content"->'metadata'->>'isMain' = 'true' THEN 1.2
            ELSE 1.0
        END AS "keyword_score"
        FROM public.knowledge
        WHERE (public.knowledge."agentId" IS NULL AND public.knowledge."isShared" = true) OR public.knowledge."agentId" = "query_agent_id"
    )
    SELECT
        k."id",
        k."agentId",
        k."content",
        k."embedding",
        k."createdAt",
        (v."vector_score" * kw."keyword_score") AS "similarity"
    FROM public.knowledge k
    JOIN vector_matches v ON k."id" = v."id"
    LEFT JOIN keyword_matches kw ON k."id" = kw."id"
    WHERE (k."agentId" IS NULL AND k."isShared" = true) OR k."agentId" = "query_agent_id"
    AND (
        v."vector_score" >= "match_threshold"
        OR (kw."keyword_score" > 1.0 AND v."vector_score" >= 0.3)
    )
    ORDER BY "similarity" DESC
    LIMIT "match_count";
END;
$$;


CREATE OR REPLACE FUNCTION "public"."search_memories"("query_table_name" "text", "query_roomId" "uuid", "query_embedding" "public"."vector", "query_match_threshold" double precision, "query_match_count" integer, "query_unique" boolean) RETURNS TABLE("id" "uuid", "userId" "uuid", "content" "jsonb", "createdAt" timestamp with time zone, "similarity" double precision, "roomId" "uuid", "embedding" "public"."vector")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        public.memories."id",
        public.memories."userId",
        public.memories."content",
        public.memories."createdAt",
        1 - (public.memories."embedding" <=> "query_embedding") AS "similarity",
        public.memories."roomId",
        public.memories."embedding"
    FROM public.memories
    WHERE (1 - (public.memories."embedding" <=> "query_embedding") > "query_match_threshold")
    AND public.memories."type" = "query_table_name"
    AND ("query_unique" IS FALSE OR public.memories."unique" = TRUE)
    AND ("query_roomId" IS NULL OR public.memories."roomId" = "query_roomId")
    ORDER BY "similarity" DESC
    LIMIT "query_match_count";
END;
$$;

COMMIT;
