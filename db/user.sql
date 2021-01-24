/*
 Navicat Premium Data Transfer

 Source Server         : cloudnote
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 24/01/2021 20:19:05
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
  "_id" integer PRIMARY KEY AUTOINCREMENT,
  "username" verchar,
  "password" verchar DEFAULT '123456',
  UNIQUE ("username" ASC)
);

-- ----------------------------
-- Auto increment value for user
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 5 WHERE name = 'user';

PRAGMA foreign_keys = true;
