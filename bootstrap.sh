#! /bin/bash

echo "Copying ./bin/pre-commit hook to ./.git/hooks/pre-commit"
cp ./bin/pre-commit ./.git/hooks/pre-commit

echo "Copying ./bin/pre-push hook to ./.git/hooks/pre-push"
cp ./bin/pre-push ./.git/hooks/pre-push
