A chrome extension that hashes the DOM of loaded pages and compares it to a list of stored hashes in `known_hashes.json`.

The extension will display different icons/popup messages depending on whether the URL exists it `known_hashes.json` and whether the computed hash matches the stored hash.

Note that basically anything that can inject into the DOM (AJAX, other Chrome extensions) will invalidate the hash.
