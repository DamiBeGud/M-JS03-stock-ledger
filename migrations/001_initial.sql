CREATE TABLE movements(id text PRIMARY KEY,item text NOT NULL,delta integer NOT NULL CHECK(delta BETWEEN -10000 AND 10000 AND delta<>0));
CREATE INDEX movements_item ON movements(item);
