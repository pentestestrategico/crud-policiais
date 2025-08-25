-- Script para criar banco e tabela utilizados pelo backend
CREATE DATABASE seguranca;
USE seguranca;
-- Criação da tabela policiais (matrícula armazenada como VARBINARY)
CREATE TABLE policiais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rg_civil VARCHAR(20) NOT NULL UNIQUE,
    rg_militar VARCHAR(20) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    matricula VARBINARY(255) NOT NULL
);

-- Trigger para validar CPF antes de inserir
DELIMITER $$

CREATE TRIGGER valida_cpf
BEFORE INSERT ON policiais
FOR EACH ROW
BEGIN
    DECLARE soma INT DEFAULT 0;
    DECLARE resto INT;
    DECLARE i INT;
    DECLARE num CHAR(11);

    -- Remove pontos e traço do CPF
    SET num = REPLACE(REPLACE(REPLACE(NEW.cpf, '.', ''), '-', ''), ' ', '');

    -- Verifica se tem 11 dígitos
    IF CHAR_LENGTH(num) <> 11 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CPF inválido: precisa ter 11 dígitos';
    END IF;

    -- Validação do primeiro dígito
    SET soma = 0;
    SET i = 1;
    WHILE i <= 9 DO
        SET soma = soma + CAST(SUBSTRING(num, i, 1) AS UNSIGNED) * (11 - i);
        SET i = i + 1;
    END WHILE;

    SET resto = (soma * 10) MOD 11;
    IF resto = 10 THEN SET resto = 0; END IF;

    IF resto <> CAST(SUBSTRING(num, 10, 1) AS UNSIGNED) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CPF inválido (primeiro dígito verificador incorreto)';
    END IF;

    -- Validação do segundo dígito
    SET soma = 0;
    SET i = 1;
    WHILE i <= 10 DO
        SET soma = soma + CAST(SUBSTRING(num, i, 1) AS UNSIGNED) * (12 - i);
        SET i = i + 1;
    END WHILE;

    SET resto = (soma * 10) MOD 11;
    IF resto = 10 THEN SET resto = 0; END IF;

    IF resto <> CAST(SUBSTRING(num, 11, 1) AS UNSIGNED) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CPF inválido (segundo dígito verificador incorreto)';
    END IF;

END$$

DELIMITER ;

-- Exemplo de inserção (matrícula criptografada)
INSERT INTO policiais (rg_civil, rg_militar, cpf, data_nascimento, matricula)
VALUES (
    '123456789',
    '987654321',
    '123.456.789-09',
    '1990-05-20',
    AES_ENCRYPT('MAT123456', 'chaveSecreta123')
);