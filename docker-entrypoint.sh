echo "waiting for db to start..."
./wait-for-it.sh db-test:5432

echo "starting migration..."
 npm run migrate up

