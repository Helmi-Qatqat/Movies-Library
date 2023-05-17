DROP TABLE IF EXISTS movies_lists;
CREATE TABLE IF NOT EXISTS movies_lists (
  id int,
  title varchar(4096),
  release_date varchar(4096),
  poster_path varchar(4096),
  overview varchar(4096),
  comment varchar(4096)
);