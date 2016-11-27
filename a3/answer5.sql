SELECT COUNT(DISTINCT A.StudentFirstName, A.StudentLastName)
    FROM `a3` A
    WHERE A.CourseName='COMP 426'
    AND A.ProfessorFirstName='Ketan'
    AND EXISTS (
        SELECT DISTINCT B.StudentFirstName, B.StudentLastName
        FROM `a3` B
        WHERE B.CourseName='COMP 401'
        AND B.ProfessorFirstName='Ketan'
        AND A.StudentFirstName=B.StudentFirstName
        AND A.StudentLastName=B.StudentLastName
    )