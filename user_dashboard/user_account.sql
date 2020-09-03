--
-- Database:    user_account
-- Description: This database handles the storing of users
--

DROP TABLE IF EXISTS Programmers;

CREATE TABLE Programmers (
    programmerId varchar(255) NOT NULL,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    email varchar(255),
    mobile_number varchar(255) DEFAULT NULL, 
    dateStarted date, 
    accessLevel int(11),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_account_data`
--

INSERT INTO Programmers VALUES
    ('eqyvguhIaBZ3ouxN7SjZwshAkPp1', 'Adam', 'Wright', 'wrighada@oregonstate.edu', NULL, '2000-01-01', 2);
    
SELECT * FROM Programmers;
