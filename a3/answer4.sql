SELECT COUNT( A.ct ) 
FROM (
	SELECT COUNT(  `ExamDate` ) AS ct
	FROM  `a3` 
	GROUP BY `StudentFirstName`, `StudentLastName`
	) A
WHERE A.ct > 1
GROUP BY A.ct