CREATE TABLE "t_achievement_list" (
  "achievement_id" SERIAL,
  "detail" TEXT,
  "icon" BYTEA,
  PRIMARY KEY ("achievement_id")
);

CREATE TABLE "t_conversation" (
  "conv_id" SERIAL,
  "creation_date" TIMESTAMP,
  "room_type" VARCHAR(10) NOT NULL,
  "room_name" VARCHAR(20) NOT NULL,
  "password" TEXT,
  "created" TIMESTAMP,
  "updated" TIMESTAMP,
  PRIMARY KEY ("conv_id")
);

-- CREATE TABLE "t_webapp_user_data" (
--   "login" VARCHAR(8) NOT NULL,
--   "pseudo" VARCHAR(20) NOT NULL,
--   "avatar" BYTEA,
--   "status" VARCHAR(10) NOT NULL,
--   "double_auth" BOOLEAN NOT NULL,
--   "bio" VARCHAR(200),
--   "pending_queue" BOOLEAN NOT NULL,
--   "banned" BOOLEAN NOT NULL,
--   "admonishement" INT NOT NULL,
--   "app_role" VARCHAR(10) NOT NULL,
--   "created" TIMESTAMP,
--   "updated" TIMESTAMP,
--   PRIMARY KEY ("login")
-- );

CREATE TABLE "t_message" (
  "conv_id" INT,
  "login" VARCHAR(8),
  "date" TIMESTAMP,
  "content" TEXT NOT NULL,
  CONSTRAINT "FK_t_message.conv_id"
    FOREIGN KEY ("conv_id")
      REFERENCES "t_conversation"("conv_id"),
  CONSTRAINT "FK_t_message.login"
    FOREIGN KEY ("login")
      REFERENCES "t_webapp_user_data"("login")
);

CREATE TABLE "t_game_type" (
  "game_type_id" SERIAL,
  "game_aspect" VARCHAR(20) NOT NULL,
  "ball_size" INT NOT NULL,
  "map_type" VARCHAR(20) NOT NULL,
  "initial_speed" INT NOT NULL,
  "racket_size" INT NOT NULL,
  PRIMARY KEY ("game_type_id")
);

CREATE TABLE "t_pong_game" (
  "game_id" SERIAL,
  "player1" VARCHAR(8),
  "player2" VARCHAR(8),
  "player1_score" INT NOT NULL,
  "player2_score" INT NOT NULL,
  "game_status" VARCHAR(10),
  "winner" VARCHAR(8),
  "looser" VARCHAR(8),
  "game_type_id" INT,
  "room_id" INT ,
  "created" TIMESTAMP,
  "updated" TIMESTAMP,
  PRIMARY KEY ("game_id"),
  CONSTRAINT "FK_t_pong_game.game_type_id"
    FOREIGN KEY ("game_type_id")
      REFERENCES "t_game_type"("game_type_id"),
  CONSTRAINT "FK_t_pong_game.room_id"
    FOREIGN KEY ("room_id")
      REFERENCES "t_conversation"("conv_id"),
  CONSTRAINT "FK_t_pong_game.player1"
    FOREIGN KEY ("player1")
      REFERENCES "t_webapp_user_data"("login"),
  CONSTRAINT "FK_t_pong_game.player2"
    FOREIGN KEY ("player2")
      REFERENCES "t_webapp_user_data"("login")
);

CREATE TABLE "t_participant" (
  "game_id" INT,
  "login" VARCHAR(8),
  "involvement" VARCHAR(10) NOT NULL,
  "result" VARCHAR(10),
  "created" TIMESTAMP,
  "updated" TIMESTAMP,
  CONSTRAINT "FK_t_participant.game_id"
    FOREIGN KEY ("game_id")
      REFERENCES "t_pong_game"("game_id"),
  CONSTRAINT "FK_t_participant.login"
    FOREIGN KEY ("login")
      REFERENCES "t_webapp_user_data"("login")
);

CREATE TABLE "t_invitation" (
  "emitter" VARCHAR(8),
  "receiver" VARCHAR(8),
  "invitation_type" VARCHAR(15) NOT NULL,
  "room" INT,
  "created" TIMESTAMP,
  CONSTRAINT "FK_t_invitation.emitter"
    FOREIGN KEY ("emitter")
      REFERENCES "t_webapp_user_data"("login"),
  CONSTRAINT "FK_t_invitation.room"
    FOREIGN KEY ("room")
      REFERENCES "t_conversation"("conv_id"),
  CONSTRAINT "FK_t_invitation.receiver"
    FOREIGN KEY ("receiver")
      REFERENCES "t_webapp_user_data"("login")
);

CREATE TABLE "t_relation" (
  "user1" VARCHAR(8),
  "user2" VARCHAR(8),
  "friendship" BOOLEAN NOT NULL,
  "friendship_birthday" TIMESTAMP,
  "1_blocked_by_2" BOOLEAN NOT NULL,
  "2_blocked_by_1" BOOLEAN NOT NULL,
  "created" TIMESTAMP,
  "updated" TIMESTAMP,
  CONSTRAINT "FK_t_relation.user2"
    FOREIGN KEY ("user2")
      REFERENCES "t_webapp_user_data"("login"),
  CONSTRAINT "FK_t_relation.user1"
    FOREIGN KEY ("user1")
      REFERENCES "t_webapp_user_data"("login")
);

CREATE TABLE "t_chatter" (
  "conv_id" INT,
  "login" VARCHAR(8),
  "chat_role" VARCHAR(6) NOT NULL,
  "is_present" BOOLEAN NOT NULL,
  "muted_until" TIMESTAMP,
  "created" TIMESTAMP,
  "updated" TIMESTAMP,
  CONSTRAINT "FK_t_chatter.login"
    FOREIGN KEY ("login")
      REFERENCES "t_webapp_user_data"("login"),
  CONSTRAINT "FK_t_chatter.conv_id"
    FOREIGN KEY ("conv_id")
      REFERENCES "t_conversation"("conv_id")
);

CREATE TABLE "t_api_user_data" (
  "login" VARCHAR(8) NOT NULL,
  "last_name" VARCHAR(20) NOT NULL,
  "first_name" VARCHAR(20) NOT NULL,
  "birthday" DATE,
  "mail" VARCHAR(50) NOT NULL,
  "created" TIMESTAMP,
  "updated" TIMESTAMP,
  PRIMARY KEY ("login"),
  CONSTRAINT "FK_t_api_user_data.login"
    FOREIGN KEY ("login")
      REFERENCES "t_webapp_user_data"("login")
);

CREATE TABLE "t_award" (
  "achievement_id" INT,
  "login" VARCHAR(8),
  "date" TIMESTAMP,
  CONSTRAINT "FK_t_award.login"
    FOREIGN KEY ("login")
      REFERENCES "t_webapp_user_data"("login"),
  CONSTRAINT "FK_t_award.achievement_id"
    FOREIGN KEY ("achievement_id")
      REFERENCES "t_achievement_list"("achievement_id")
);

CREATE TABLE "t_stats" (
  "login" VARCHAR(8) NOT NULL,
  "match_number" INT NOT NULL,
  "victory" INT NOT NULL,
  "loss" INT NOT NULL,
  "points_for_ladder" INT NOT NULL,
  "highest_score" INT NOT NULL,
  "worst_score" INT NOT NULL,
  "scored_points" INT NOT NULL,
  "adversary_points" INT NOT NULL,
  "longest_match" INT NOT NULL,
  "shortest_match" INT NOT NULL,
  "created" TIMESTAMP,
  "updated" TIMESTAMP,
  PRIMARY KEY ("login"),
  CONSTRAINT "FK_t_stats.login"
    FOREIGN KEY ("login")
      REFERENCES "t_webapp_user_data"("login")
);

