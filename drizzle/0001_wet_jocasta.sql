CREATE TABLE "newsletters" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "date" text NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "content" text NOT NULL,
    "published" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);