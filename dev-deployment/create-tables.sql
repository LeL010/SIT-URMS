CREATE TABLE IF NOT EXISTS `Users` (
  `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `hashed_password` VARCHAR(255) NOT NULL,     -- length depends on hashing algorithm
  `isVerified` TINYINT(1) DEFAULT 0,           -- 0 = not verified, 1 = verified
  `mobile_number` VARCHAR(20) DEFAULT NULL,    -- store phone number as text
  `profile_picture` LONGBLOB DEFAULT NULL,      -- or MEDIUMBLOB if pictures are small
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `Addresses` (
  `address_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `address_line1` VARCHAR(255) NOT NULL,
  `address_line2` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `country` VARCHAR(100) DEFAULT 'SINGAPORE',       -- customize as you see fit
  PRIMARY KEY (`address_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `usersAddresses` (
  `user_id` INT UNSIGNED NOT NULL,
  `address_id` INT UNSIGNED NOT NULL,
  `is_default` TINYINT(1) DEFAULT 0,   -- 0 = false, 1 = true, etc.
  PRIMARY KEY (`user_id`, `address_id`),
  CONSTRAINT `fk_usersAddresses_user`
    FOREIGN KEY (`user_id`) 
    REFERENCES `Users`(`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_usersAddresses_address`
    FOREIGN KEY (`address_id`) 
    REFERENCES `Addresses`(`address_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
