--
-- USERS TABLE
--
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(20) UNIQUE NOT NULL,
    "email" VARCHAR(50) UNIQUE NOT NULL,
    "password_hash" VARCHAR(128),
	-- "role" VARCHAR(10) NOT NULL,
    "creation_date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
--- role = "A" (admin)
--- role = "U" (normal user)

--
-- SESSION TABLE
-- 
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--
-- ORDERS TABLE
--
CREATE TABLE orders(
	"id" serial primary key,
	"username" varchar(20) not null,
	"latte" int not null,
	"mocha" int not null,
	"expresso" int not null,
	"blackcoffee" int not null,
	"address" varchar(150) not null,
  	"ordertime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  	-- "status" int not null,
);

--- status = 0 (not prepared)
--- status = 1 (prepared)

