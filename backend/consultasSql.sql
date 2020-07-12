USE tutorships;

-- Data preguntas --
SELECT Q.id, Q.title, Q.question_text, Q.date, Q.status_question,
U.id AS 'idUser', U.name_user, U.avatar, LT.id AS'idLanguages',LT.name_language 
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id 
    INNER JOIN languages_tech LT ON Q.id_language=LT.id;
    
-- Data user experto --    
SELECT U.id, U.name_user, U.last_name, U.avatar, LT.name_language
FROM users U
INNER JOIN users_languages UL ON U.id=UL.id_user
INNER JOIN languages_tech LT ON UL.id_language=LT.id
WHERE U.role="experto";

SELECT id, name_language, description, image
FROM languages_tech;

-- Data respuesta --
SELECT
A.id,
A.answer_text,
A.date_answer,
A.id_question,
A.id_user_expert,
U.name_user AS 'userExpert',
U.avatar,
LT.name_language,
AVG(UR.rating) AS 'rating'
FROM answers A
INNER JOIN questions Q ON A.id_question = Q.id
INNER JOIN users U ON A.id_user_expert=U.id
INNER JOIN languages_tech LT ON Q.id_language=LT.id
INNER JOIN users_rating UR ON A.id=UR.id_answer
GROUP BY A.id;

-- Data pregunta --
SELECT 
        Q.id, 
        Q.title, 
        Q.question_text, 
        Q.date, 
        Q.status_question,
        U.id AS 'idUser',
        U.name_user, 
        U.avatar, 
        LT.id AS'idLanguages',
        LT.name_language 
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id 
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    WHERE U.name_user LIKE '%%'
    ORDER BY Q.date DESC;

UPDATE questions
      SET status_question=false
      WHERE id=4;
      
SELECT
        A.id,
        A.answer_text,
        A.date_answer,
        A.id_question,
        A.id_user_expert,
        U.name_user AS 'userExpert',
        U.avatar,
        LT.name_language AS 'Language'
    FROM answers A
    INNER JOIN questions Q ON A.id_question = Q.id
    INNER JOIN users U ON A.id_user_expert=U.id
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    GROUP BY A.id;



    SELECT 
        Q.id,
        Q.title, 
        Q.question_text, 
        Q.date,         
        U.name_user AS 'Autor',
        U.avatar, 
        Q.id_language,
        LT.name_language AS 'Language'
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id 
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    ORDER BY Q.id DESC;