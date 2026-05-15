CREATE DATABASE IF NOT EXISTS raf_novosti;
USE raf_novosti;

CREATE TABLE users (
    email           VARCHAR(255) PRIMARY KEY,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    type            ENUM('ADMIN', 'CONTENT_CREATOR') NOT NULL,
    status          ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE articles (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    content      TEXT NOT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visit_count  INT DEFAULT 0,
    author_email VARCHAR(255) NOT NULL,
    category_id  INT NOT NULL,
    FOREIGN KEY (author_email) REFERENCES users(email),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE tags (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE article_tags (
    article_id INT NOT NULL,
    tag_id     INT NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE comments (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    content     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    article_id  INT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE article_reactions (
    article_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    type       ENUM('LIKE', 'DISLIKE') NOT NULL,
    PRIMARY KEY (article_id, session_id),
    FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE comment_reactions (
    comment_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    type       ENUM('LIKE', 'DISLIKE') NOT NULL,
    PRIMARY KEY (comment_id, session_id),
    FOREIGN KEY (comment_id) REFERENCES comments(id)
);

CREATE TABLE article_visits (
    article_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (article_id, session_id),
    FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- Inicijalni admin korisnik, lozinka: admin123
-- sha2('admin123', 256) = 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
INSERT INTO users (email, first_name, last_name, type, status, hashed_password)
VALUES ('admin@raf.rs', 'Admin', 'Admin', 'ADMIN', 'ACTIVE',
        '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');
