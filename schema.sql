DROP TABLE IF EXISTS movies_lists;
CREATE TABLE IF NOT EXISTS movies_lists (
  id varchar(255),
  title varchar(255),
  release_date varchar(255),
  poster_path varchar(255),
  overview varchar(255),
  comment varchar(255)
);