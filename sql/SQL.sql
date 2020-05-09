USE bbdd_proyecto;

CREATE TABLE users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name_user VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50),
    profile_bio VARCHAR(200),
    avatar VARCHAR(200),
    username VARCHAR(50)  NOT NULL UNIQUE,
    password VARCHAR(128),
    expert_validation BOOLEAN DEFAULT FALSE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME
);

CREATE TABLE languages_tech (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name_language ENUM('Javascript','CSS','HTML','Java','PHP','SQL','Angular','Vue', 'NodeJS'),
    description VARCHAR(200),
    image VARCHAR(200),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME
);

CREATE TABLE questions (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50),
    question_text VARCHAR(500),
    date TIMESTAMP,
    status_question BOOLEAN DEFAULT FALSE,
    id_user_student INT UNSIGNED,
    FOREIGN KEY (id_user_student) REFERENCES users (id),
    id_language INT UNSIGNED,
    FOREIGN KEY (id_language) REFERENCES languages_tech (id),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME
);

CREATE TABLE answers (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    answer_text VARCHAR(500),
    rating INT,
    id_question INT UNSIGNED,
    FOREIGN KEY (id_question) REFERENCES questions (id),
    id_user_expert INT UNSIGNED,
    FOREIGN KEY (id_user_expert) REFERENCES users (id),
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME
);

CREATE TABLE users_languages (
	id_user INT UNSIGNED,
    FOREIGN KEY (id_user) REFERENCES users (id),
    id_language INT UNSIGNED,
    FOREIGN KEY (id_language) REFERENCES languages_tech (id),
    PRIMARY KEY (id_user, id_language),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date DATETIME
);

