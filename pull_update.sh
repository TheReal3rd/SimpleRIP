if [ -e ".git"]; then
  echo "Pulling latest..."
  git pull
  echo "Done."
else
  echo ".git is missing."
fi
