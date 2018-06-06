/*
 *
 * HomePage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators, compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { get, isEmpty, upperFirst } from 'lodash';
import cn from 'classnames';

import Block from 'components/HomePageBlock/Loadable';
import Button from 'components/Button';
import Sub from 'components/Sub/Loadable';
import Input from 'components/InputText';
import SupportUsCta from 'components/SupportUsCta/Loadable';
import SupportUsTitle from 'components/SupportUsTitle/Loadable';

import { selectPlugins } from 'containers/App/selectors';

import auth from 'utils/auth';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import validateInput from 'utils/inputsValidations';

import BlockLink from './BlockLink';
import CommunityContent from './CommunityContent';
import CreateContent from './CreateContent';
import SocialLink from './SocialLink';
import WelcomeContent from './WelcomeContent';

import { getArticles, onChange, submit } from './actions';
import makeSelectHomePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles.scss';
import gif from '../../assets/gifs/contact_m.gif'

const FIRST_BLOCK = [
  {
    title: {
      id: 'app.components.HomePage.welcome',
    },
    content: () => <WelcomeContent />,
  },
  {
    title: {
      id: 'app.components.HomePage.create',
    },
    content: () => <CreateContent />,
  },
];

const FIRST_BLOCK_LINKS = [
  {
    link: 'https://strapi.io/documentation/',
    content: {
      id: 'app.components.BlockLink.documentation.content',
    },
    isDocumentation: true,
    title: {
      id: 'app.components.BlockLink.documentation',
    },
  },
  {
    link: 'https://github.com/strapi/strapi-examples',
    content: {
      id: 'app.components.BlockLink.code.content',
    },
    isDocumentation: false,
    title: {
      id: 'app.components.BlockLink.code',
    },
  },
];

const SECOND_BLOCK = {
  title: {
    id: 'app.components.HomePage.community',
  },
  content: () => <CommunityContent />,
};

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    link: 'https://github.com/strapi/strapi/',
  },
  {
    name: 'Slack',
    link: 'https://slack.strapi.io/',
  },
  {
    name: 'Medium',
    link: 'https://medium.com/@strapi',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/strapijs',
  },
  {
    name: 'Reddit',
    link: 'https://www.reddit.com/r/node/search?q=strapi',
  },
  {
    name: 'Stack Overflow',
    link: 'https://stackoverflow.com/questions/tagged/strapi',
  },
];

export class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = { errors: [] };

  componentDidMount() {
    this.props.getArticles();
  }

  handleSubmit = e => {
    e.preventDefault();
    const errors = validateInput(this.props.homePage.body.email, { required: true }, 'email');
    this.setState({ errors });

    if (isEmpty(errors)) {
      return this.props.submit();
    }
  };

  showFirstBlock = () =>
    get(this.props.plugins.toJS(), 'content-manager.leftMenuSections.0.links', []).length === 0;

  renderButton = () => {
    const data = this.showFirstBlock()
      ? {
        className: styles.homePageTutorialButton,
        href: 'https://strapi.io/documentation/getting-started/quick-start.html',
        id: 'app.components.HomePage.button.quickStart',
        primary: true,
      }
      : {
        className: styles.homePageBlogButton,
        id: 'app.components.HomePage.button.blog',
        href: 'https://blog.strapi.io/',
        primary: false,
      };

    return (
      <a href={data.href} target="_blank">
        <Button className={data.className} primary={data.primary}>
          <FormattedMessage id={data.id} />
        </Button>
      </a>
    );
  };

  render() {
    const { homePage: { articles, body } } = this.props;
    const WELCOME_AGAIN_BLOCK = [
      {
        title: {
          id: 'app.components.HomePage.welcome.again',
        },
        name: upperFirst(`${get(auth.getUserInfo(), 'username')}!`),
        content: () => <WelcomeContent hasContent />,
      },
    ];

    return (
      <div className={cn('container-fluid', styles.containerFluid)}>
        <Helmet title="Home Page" />
        <div className="row">
          <div className="col-md-8 col-lg-8">
            <Block>
              <div>
                <h2>Welcome to The-Artery's Content Management System! 🤓</h2> <br/>
                <h3>A spiffy API for The-Artery's in-house websites.</h3>
                <p>  
                  Current Live Versions: <br/>
                  <a href='https://www.the-artery.com/'>Main Site</a>  <br/>
                  <a href='https://client.the-artery.com/General-Reel'>Client Site</a>
                  
                </p>
              </div>
            </Block>

            <Block>
              <div>
                <h2> App Information 🗝️</h2> <br />
                <h3>Github repo's can be found at the links below (with access): </h3> 

                  <a href='https://github.com/The-Artery-Lab/Client-Website-Frontend'>Client Frontend </a> <br />
                  <a href='https://github.com/The-Artery-Lab/Client-Website-Frontend'>Main Frontend </a> <br />
                  <a href='https://github.com/The-Artery-Lab/Client-Website-Frontend'>CMS Frontend </a> <br />
                  
                  <br/>
                <h3>Database Information</h3>
                <a href='https://mlab.com/'>MLab Home</a>
              </div>
            </Block>

            <Block>
              <h2>Project Upload Information 📽️</h2>
              <br/>
              <div>
                <div>
                  Project videos are pulled from Vimeo in three sizes for mobile, tablet, and desktop. <br/>
                  Format: 'https://player.vimeo.com/external/...'
                </div>
                <br/>
                <div>
                  Project images take three forms according to their role in the site: 
                  <ol>
                    <li>Thumbnails: Used on the pillar pages as a link to the project (350 x 350)</li>
                    <li>Main Cover: Covers the project video on the project's page (single file)</li>
                    <li>Secondary: Comprises the image gallery of extra project content (multiple files)</li>
                  </ol>
                </div>
              </div>
              <br />
              <h4>Metadata</h4>
              <ol>
                <li>Project Names are case-sensitive and used as keys for a project's data</li>
                <li>Process text is written (optional, maxCharacters: 500)</li> 
                <li>Credit text is pulled from Vimeo</li>
                <li>Thumbnail text is overlaid on the thumbnail image on the pillar page</li>  
                <li>Main title is the large header on the project page, subtitles sit just below the main</li>  
              </ol>
            </Block>
            <Block>
              <div>
                <h2>Strapi Information</h2> <br/>
                  <p>Strapi is a node headless CMS framework</p>
                  {/* {this.showFirstBlock() &&
                    FIRST_BLOCK.map((value, key) => (
                      <Sub key={key} {...value} underline={key === 0} bordered={key === 0} />
                    ))} */}
                  {!this.showFirstBlock() &&
                    WELCOME_AGAIN_BLOCK.concat(articles).map((value, key) => (
                      <Sub
                        key={key}
                        {...value}
                        bordered={key === 0}
                        style={key === 1 ? { marginBottom: '33px' } : {}}
                        underline={key === 0}
                      />
                    ))}
                  {this.renderButton()}
                  <div className={styles.homePageFlex}>
                    {FIRST_BLOCK_LINKS.map((value, key) => <BlockLink {...value} key={key} />)}
                  </div>
              </div>
            </Block>
          </div>

          <div className="col-md-4">
            <Block>
              <div >                
                <img src='https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif' className={styles.zz} />
              </div>
            </Block>
            <Block>
              <h2>Using the CMS</h2>
              <br/>
                <h4>Data Types</h4>
                <ul>
                  <li>Users: Employees with CMS access</li>
                  <li>Clients: URL's dedicated to client-specific presentations</li>
                  <li>Pillars: The-Artery's separate departments</li>
                  <li>Projects: Individual projects in The-Artery's portfolio</li>
                </ul>
                <br/>
                <h4>Notes</h4>
                <p>
                  *Content Type Builder plugin only available on a local server
                </p>
            </Block>
            </div>
        </div>
      </div>
    );
  }
}


{/* <div className="col-lg-4 col-md-4">
<Block className={styles.blockShirt}>
  // <div>
  //   <SupportUsTitle />
  //   <FormattedMessage id="app.components.HomePage.support.content">
  //     {message => <p>{message}</p>}
  //   </FormattedMessage>
  //   <SupportUsCta />
  // </div>
</Block>
</div> */}

HomePage.propTypes = {
  getArticles: PropTypes.func.isRequired,
  homePage: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  plugins: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
  plugins: selectPlugins(),
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getArticles,
      onChange,
      submit,
    },
    dispatch,
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'homePage', reducer });
const withSaga = injectSaga({ key: 'homePage', saga });

// export default connect(mapDispatchToProps)(HomePage);
export default compose(withReducer, withSaga, withConnect)(HomePage);
