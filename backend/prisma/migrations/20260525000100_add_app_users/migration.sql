CREATE TABLE IF NOT EXISTS "public"."app_users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "role" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "phone" text,
  "avatar_url" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "app_users_role_idx" ON "public"."app_users" ("role");
CREATE INDEX IF NOT EXISTS "app_users_is_active_idx" ON "public"."app_users" ("is_active");
