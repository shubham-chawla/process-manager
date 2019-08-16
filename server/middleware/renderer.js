import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import App from '../../src/App';

const path = require('path');
const fs = require('fs');

export default (req, res, next) => {
    const SSH = new ServerStyleSheet();
    const filePath = path.resolve('dist/index.html');

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('err', err);
            return res.status(404).end();
        }

        const html = ReactDOMServer.renderToString(<App />);
        const styleTags = SSH.getStyleTags();

        return res.send(htmlData.replace('<div id="root"></div>', `<div id="root">${html}</div>${styleTags}`));
    });
};
