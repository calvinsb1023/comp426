SELECT DISTINCT A.ProfessorFirstName, A.ProfessorLastName
FROM `a3` A
WHERE NOT EXISTS (
    SELECT DISTINCT ProfessorFirstName, ProfessorLastName
	FROM `a3` B
    WHERE A.ProfessorFirstName=B.ProfessorFirstName 
    AND A.ProfessorLastName=B.ProfessorLastName
    AND B.Semester LIKE 'S%'
);