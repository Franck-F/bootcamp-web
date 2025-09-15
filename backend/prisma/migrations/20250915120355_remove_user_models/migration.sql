/*
  Warnings:

  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."role_permissions" DROP CONSTRAINT "role_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_sessions" DROP CONSTRAINT "user_sessions_user_id_fkey";

-- DropTable
DROP TABLE "public"."permissions";

-- DropTable
DROP TABLE "public"."role_permissions";

-- DropTable
DROP TABLE "public"."user_sessions";

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."roles";
