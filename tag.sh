#!/bin/bash

set -e

NEW_VERSION=$1
VERSION_REGEXP='[0-9]+\.[0-9]+\.[0-9]+'
FULL_VERSION_REGEXP="^${VERSION_REGEXP}$"

if [[ ! $NEW_VERSION =~ $FULL_VERSION_REGEXP ]]; then
  echo "First param should be a version like X.X.X"
  exit 1
fi

echo "[Mumuki::Emojis] Updating version..."
sed -i -r "s/\"version\": \"v${VERSION_REGEXP}/\"version\": \"v${NEW_VERSION}/" package.json
sed -i -r "s/VERSION = \"${VERSION_REGEXP}/VERSION = \"${NEW_VERSION}/" gem/lib/mumuki/emojis/version.rb

echo "[Mumuki::Emojis] Commiting files..."
git add package.json gem/lib/mumuki/emojis/version.rb
git commit -m "Welcome v${NEW_VERSION}!"

echo "[Mumuki::Emojis] Tagging v$NEW_VERSION..."
git tag "v${NEW_VERSION}"

echo "[Mumuki::Emojis] Pushing..."
git push origin HEAD --tags

echo "[Mumuki::Emojis] Pushed. GitHub Actions will do the rest"
