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

-   [x] Restyling to take advantage of Tufte sidenotes
-   [ ] RSS/Search
    -   [x] Improve styling of RSS/Search buttons
    -   [ ] Implement search bar using frontend-only solution: maybe [lunr](https://lunrjs.com)
-   [ ] Respond smartly to no-js

### CSS Cleanup

- [x] Header
- [ ] Right asides/margin
- [ ] Columns
- [ ] Bullet spacing
- [ ] Mobile-friendly buttons
