create view total_votes_by_name as
select id as name_id,
  (select count(up) from votes v where v.name_id = n.id and up = true) as up,
  (select count(up) from votes v where v.name_id = n.id and up = false) as down
from names n;
