/*
 Navicat Premium Data Transfer

 Source Server         : cloudnote
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 24/01/2021 20:18:56
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for note
-- ----------------------------
DROP TABLE IF EXISTS "note";
CREATE TABLE "note" (
  "_id" integer PRIMARY KEY AUTOINCREMENT,
  "userid" verchar NOT NULL,
  "title" verchar NOT NULL,
  "createdate" datetime DEFAULT (date()),
  "address" verchar NOT NULL
);

-- ----------------------------
-- Auto increment value for note
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 3 WHERE name = 'note';

PRAGMA foreign_keys = true;
