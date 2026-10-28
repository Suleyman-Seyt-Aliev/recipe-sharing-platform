-- Удаление в обратном порядке
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Удаляем расширение (опционально)
-- DROP EXTENSION IF EXISTS "pgcrypto";