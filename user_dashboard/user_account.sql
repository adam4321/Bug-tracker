--
-- Database:    user_account
-- Description: This database handles the storing of users
--

DROP TABLE IF EXISTS Programmers;

CREATE TABLE Programmers (
    programmerId varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    mobile_number varchar(255) DEFAULT NULL,
    date_of_birth date NOT NULL,
    subscribe_to_newsletter tinyint(1) DEFAULT 0,
    receive_mobile_alerts tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_account_data`
--

INSERT INTO Programmers VALUES
    ('eqyvguhIaBZ3ouxN7SjZwshAkPp1', 'wrighada@oregonstate.edu', 'Adam Wright', NULL, '2000-01-01', 0, 0);
    
SELECT * FROM Programmers;
