// import React from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import NavBar from './Navbar.jsx';
// import TextField from 'material-ui/TextField';
// import FlatButton from 'material-ui/FlatButton';

// class Login extends React.Component {
//   constructor (props) {
//     super(props);
//     this.state = {
//       formData: {
//         username: '',
//         password: '',
//       },
//       didLoginFail: false,
//       errorCode: null,
//       errorMessage: '',
//       errorType: ''
//     }
//   }

//   handleInputChanges (event) {
//     const { formData } = this.state;
//     formData[event.target.name] = event.target.value;
//     this.setState({ formData });
//   }

//   logUserIn() {
//     let user = this.state.formData;
//     axios.post('/login', user)
//       .then((response) => {
//         let userId = response.data.userId;
//         this.props.logUserIn(userId);
//         this.props.history.push('/');
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 401) {
//           console.log('error authenticating user errors', error.response);
//           var message = error.response.data.error;
//           this.setState({
//             didLoginFail: true,
//             errorCode: 401,
//             errorMessage: message,
//             errorType: message.includes('username') ? 'username' : 'password'
//           })
//         } else {
//           console.log('Error in login component:', error)
//           this.setState({
//             didLoginFail: true,
//             errorCode: 500
//           })   
//         }
//       });
//   }

//   render() {
//     const {formData} = this.state;
//     return (
//       <div>
//         <NavBar isLoggedIn={false} />
//         <div className='body-container'>
//           <div className='form'>
//             <TextField
//               value={formData.username}
//               hintText="Username"
//               errorText={this.state.errorType === 'username' && this.state.errorMessage}
//               floatingLabelText="Username"
//               name='username'
//               onChange = {this.handleInputChanges.bind(this)}
//             />
//           <br />
//           <br/>
//             <TextField
//               value={formData.password}
//               type="password"
//               hintText="Password"
//               errorText={this.state.errorType === 'password' && this.state.errorMessage}
//               floatingLabelText="Password"
//               name='password'
//               onChange = {this.handleInputChanges.bind(this)}
//             />
//           <br />
//           <br/>
//           {this.state.didLoginFail && 
//             <span className="error-text">
//               {this.state.errorCode === 401 || <span>Our servers are having issues. Please try later</span>}
//             </span>
//           }
//           <button className='btn' onClick={this.logUserIn.bind(this)}>Log In</button>
//           <br/>
//           <br/>
//           <div>
//             <span>Don't have an account? <br/>Create one!</span>
//             <br/>
//             <Link to="/signup">
//               <button className='btn'>Sign Up</button>
//             </Link>
//           </div>
//         </div>
//           </div>
//       </div>
//     );
//   }
// }

// export default Login;