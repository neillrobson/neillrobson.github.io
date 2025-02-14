# Neill Robson's Website

Source code for the personal website and blog of Neill Robson.

[![Deployment status badge](https://github.com/neillrobson/neillrobson.github.io/workflows/Publish%20Website/badge.svg)](https://github.com/neillrobson/neillrobson.github.io/actions)

## Local Development

1. Download or clone the repo

    ```
    git clone git@github.com:neillrobson/neillrobson.github.io.git
    ```

2. Enter the folder

    ```
    cd neillrobson.github.io/
    ```

3. Install dependencies

    ```
    npm install
    ```

4. Run development server

    ```
    npm start
    ```

5. Access via http://localhost:8080/

6. Check production build

    ```
    npm run build
    ```

## Live Site

-   https://neillrobson.com

## Todo

-   [x] Refactor CSS to use SASS features (variables etc) for maintainability (process started; ongoing)
-   [x] Update stylesheets to make sidebar links clickable on mobile
-   [x] Migrate to Eleventy
-   [ ] RSS/Search
    -   [ ] Improve styling of RSS/Search buttons
    -   [ ] Implement search bar using frontend-only solution: maybe [lunr](https://lunrjs.com)
-   [ ] Respond smartly to no-js
-   [x] "now" page: https://nownownow.com/
-   [x] Project page for Private Reacji app

### Eleventy Migration

- [x] Fix RSS feed
- [x] Maintain identical urls / permalinks
- [x] Disqus repair
- [x] Social iconography
- [x] README build instruction updates
- [x] Github Actions patch-up
- [x] Clean package.json dependencies
- [x] robots.txt
- [x] Liquid UTC Date filter
- [x] Footer (colophon) update
- [x] Formatting repair
  - [x] Images (too wide)
  - [x] sidebars (left/right)
  - [x] Typography (smart quotes)
