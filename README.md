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
    bundle install
    npm install
    ```

4. Run development server

    ```
    npm start
    ```

5. Access via http://localhost:3000/

6. Check production build

    ```
    npm run build
    ```

## Live Site

-   https://neillrobson.com

## Todo

-   [x] Refactor CSS to use SASS features (variables etc) for maintainability (process started; ongoing)
-   [x] Update stylesheets to make sidebar links clickable on mobile
-   [ ] Migrate to Eleventy
-   [ ] RSS/Search
    -   [ ] Improve styling of RSS/Search buttons
    -   [ ] Implement search bar using frontend-only solution: maybe [lunr](https://lunrjs.com)
-   [ ] Respond smartly to no-js
-   [x] "now" page: https://nownownow.com/
-   [x] Project page for Private Reacji app

### Eleventy Migration

- [ ] Fix RSS feed
- [ ] Maintain identical urls / permalinks
- [ ] Disqus repair
- [ ] Social iconography
- [ ] README build instruction updates
- [ ] Github Actions patch-up
- [ ] Clean package.json dependencies
