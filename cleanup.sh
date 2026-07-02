#!/bin/sh
set -eu

TARGET_DIR="${1:-}"

if [ -z "$TARGET_DIR" ]; then
  echo "Usage: $0 /path/to/directory"
  exit 1
fi

# Resolve to an absolute physical path.
TARGET_DIR=$(cd "$TARGET_DIR" 2>/dev/null && pwd -P) || {
  echo "Error: directory does not exist or is inaccessible."
  exit 1
}

# Refuse paths that could contain system-critical scripts.
case "$TARGET_DIR" in
  /|/bin|/sbin|/usr|/usr/bin|/usr/sbin|/etc|/lib|/lib64|/opt|/var|/root|/home)
    echo "Refusing to operate on protected directory: $TARGET_DIR"
    exit 1
    ;;
esac

echo "The following .sh files would be deleted from:"
echo "  $TARGET_DIR"
echo

find "$TARGET_DIR" -maxdepth 1 -type f -name '*.sh' -print

printf '\nType DELETE to continue: '
read -r CONFIRM

if [ "$CONFIRM" != "DELETE" ]; then
  echo "Cancelled."
  exit 0
fi

find "$TARGET_DIR" -maxdepth 1 -type f -name '*.sh' -exec rm -f -- {} \;

echo "Done."
