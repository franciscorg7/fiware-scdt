#!/bin/bash

# Get tables list from the database
TABLES=$(docker exec -it  db-mysql mysql -h mysql-db -P 3306  -u root -p123 default -N -e "SHOW TABLES")

for TABLE in $TABLES; do
    docker exec -it  db-mysql mysql -h mysql-db -P 3306  -u root -p123 default -e "DROP TABLE IF EXISTS $TABLE"
done
    
