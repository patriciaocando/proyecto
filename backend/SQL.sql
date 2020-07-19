USE tutorships;

CREATE TABLE users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name_user VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50)  NOT NULL,
    profile_bio TINYTEXT,
    avatar TINYTEXT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(128)NOT NULL,
    role ENUM('estudiante','experto','admin'),
    active BOOLEAN DEFAULT false,
    registration_code TINYTEXT,
    password_code TINYTEXT,
    last_auth_date DATETIME,
    update_date DATETIME,
    creation_date DATETIME
);

CREATE TABLE languages_tech (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name_language VARCHAR(100) NOT NULL,
    description VARCHAR(200),
    image VARCHAR(200),
    update_date DATETIME,
    creation_date DATETIME
);

CREATE TABLE questions (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200)  NOT NULL,
    question_text VARCHAR(500) NOT NULL,
    date TIMESTAMP,
    status_question BOOLEAN DEFAULT FALSE,
    id_user INT UNSIGNED  NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users (id),
    id_language INT UNSIGNED,
    FOREIGN KEY (id_language) REFERENCES languages_tech (id),
    update_date DATETIME,
    creation_date DATETIME
);

CREATE TABLE answers (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    answer_text VARCHAR(800) NOT NULL,
    date_answer DATETIME NOT NULL,
    id_question INT UNSIGNED NOT NULL,
    FOREIGN KEY (id_question) REFERENCES questions (id),
    id_user_expert INT UNSIGNED,
    FOREIGN KEY (id_user_expert) REFERENCES users (id),
	update_date DATETIME,
    creation_date DATETIME
);


CREATE TABLE users_rating (
 	id_user INT UNSIGNED,
    FOREIGN KEY (id_user) REFERENCES users (id),
    id_answer INT UNSIGNED,
    FOREIGN KEY (id_answer) REFERENCES answers (id),
    PRIMARY KEY (id_user, id_answer),
    rating INT,
    update_date DATETIME,
    creation_date DATETIME
);


CREATE TABLE users_languages (
	id_user INT UNSIGNED,
    FOREIGN KEY (id_user) REFERENCES users (id),
    id_language INT UNSIGNED,
    FOREIGN KEY (id_language) REFERENCES languages_tech (id),
    PRIMARY KEY (id_user, id_language),
    update_date DATETIME,
    creation_date DATETIME
);
