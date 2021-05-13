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

- https://neillrobson.com


## Todo

- [ ] Make blog titles clickable (links to full blog text)
- [ ] Write a blog post using the new formatting features
- [ ] Decide on a quality font stack
- [ ] Implement search bar: elasticsearch free?
- [ ] Respond smartly to no-js
- [ ] Refactor CSS to use SASS features (variables etc) for maintainability
