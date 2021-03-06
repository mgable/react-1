import React from 'react'
import {Route} from 'react-router-dom';
import About from './About.js';
import BreedBrowser from './BreedBrowser.js';
import Quiz from './quiz/Quiz.js';
import Search from './Search.js';
import './BasicDisplay.css';
import _ from 'underscore';


class BasicDisplay extends React.Component{
  constructor(props){
    super(props);
    this.state = {breeds: {}};
  }

  search(){
    Search.getBreeds().then((response) => {
      this.setState({breeds:response});
    });
  }

  componentDidMount() {
    this.search();
  }

  render() {
    var shouldRender = !_.isEmpty(this.state.breeds);
    if (shouldRender){
     return (
        <section className="py-5">
          <div className="container">
            <Route exact path="/" render={() => <BreedBrowser rawBreedsObj={this.state.breeds}/> } />
            <Route path="/about" component={About} />
            <Route path="/quiz" render={() => <Quiz rawBreedsObj={this.state.breeds} /> } />
          </div>
        </section>
      );
   } else {
    return null;
   }
  }
}

// const Quiz = ({ match }) => (
//   <div>
//     <h2>Topics</h2>
//     <ul>
//       <li>
//         <Link to={`${match.url}/rendering`}>
//           Rendering with React
//         </Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/components`}>
//           Components
//         </Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/props-v-state`}>
//           Props v. State
//         </Link>
//       </li>
//     </ul>

//     <Route path={`${match.url}/:topicId`} component={Topic}/>
//     <Route exact path={match.url} render={() => (
//       <h3>Please select a topic.</h3>
//     )}/>
//   </div>
// )

// const Topic = ({ match }) => (
//   <div className="container">
//     <h3>{match.params.topicId}</h3>
//   </div>
// )


export default BasicDisplay;