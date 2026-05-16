-- Optional safety (helps avoid FK issues during creation)
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id)
    REFERENCES posts(post_id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_categories (
  post_id INT,
  category_id INT,
  PRIMARY KEY (post_id, category_id),
  CONSTRAINT fk_pc_post FOREIGN KEY (post_id)
    REFERENCES posts(post_id) ON DELETE CASCADE,
  CONSTRAINT fk_pc_category FOREIGN KEY (category_id)
    REFERENCES categories(category_id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

--select the user by hashing the password
DELIMITER $$

CREATE PROCEDURE SelectUserWithHashedPassword (
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE hashed_password VARCHAR(255);
    SET hashed_password = SHA2(p_password, 256); -- Assuming SHA-256 is used for hashing

    SELECT * FROM users WHERE email = p_email AND password = hashed_password;
END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER before_user_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  IF NEW.password != OLD.password THEN
    SET NEW.password = SHA2(NEW.password, 256);
  END IF;
END $$

DELIMITER ;


--Hash the Password, generate random id before inserting new user
DELIMITER $$


INSERT INTO users (id, firstname, lastname, username, email, password) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Alice', 'Smith', 'alice_dev', 'alice@example.com', SHA2('password123', 256)),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Bob', 'Johnson', 'bjohnson', 'bob@techworld.com', SHA2('secure_pass!', 256)),
('7c9e6679-7425-40de-944b-e07fc1f90ae7', 'Charlie', 'Davis', 'charlie_writes', 'charlie@blog.org', SHA2('qwerty2026', 256));

INSERT INTO categories (name) VALUES 
('Technology'), 
('Lifestyle'), 
('Programming'), 
('Travel'), 
('Cooking');

INSERT INTO posts (user_id, title, content) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Getting Started with MySQL', 'Today we are exploring the world of relational databases...'),
('550e8400-e29b-41d4-a716-446655440000', 'Top 5 VS Code Extensions', 'Efficiency is key for developers. Here are my favorite tools...'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Exploring the Swiss Alps', 'The views were breathtaking and the chocolate was even better...'),
('7c9e6679-7425-40de-944b-e07fc1f90ae7', 'The Secret to Perfect Sourdough', 'It all starts with the starter. Patience is the main ingredient...');

INSERT INTO post_categories (post_id, category_id) VALUES
(1, 1), -- MySQL -> Technology
(1, 3), -- MySQL -> Programming
(2, 1), -- VS Code -> Technology
(3, 4), -- Swiss Alps -> Travel
(4, 5); -- Sourdough -> Cooking

INSERT INTO comments (post_id, user_id, content) VALUES
(1, '6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Great tutorial! Very helpful for beginners.'),
(1, '7c9e6679-7425-40de-944b-e07fc1f90ae7', 'I prefer PostgreSQL, but this was a good read.'),
(3, '550e8400-e29b-41d4-a716-446655440000', 'Adding this to my bucket list!'),
(4, '6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Can you share your hydration ratio?');