import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn, faGithubAlt, faTwitter, faStackOverflow } from '@fortawesome/free-brands-svg-icons';

import './style.css';
import './social.scss';
import './autumn.css';

library.add(faEnvelope, faGithubAlt, faLinkedinIn, faStackOverflow, faTwitter);
dom.watch();
