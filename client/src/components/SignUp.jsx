// import React from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import NavBar from './Navbar.jsx';
// import FlatButton from 'material-ui/FlatButton';
// import { ValidatorForm } from 'react-form-validator-core';
// import { TextValidator} from 'react-material-ui-form-validator';

// class SignUp extends React.Component {
//   constructor (props) {
//     super(props);
//     this.state = {
//       formData: {
//         username: '',
//         email: '',
//         firstName: '',
//         lastName: '',
//         phone: '',
//         password: '',
//         avatarUrl: '',
//       },
//       submitted: false,
//       didSignupFail: false,
//       errorCode: null
//     }
//   }


//   handleInputChanges (event) {
//     const { formData } = this.state;
//     formData[event.target.name] = event.target.value;
//     this.setState({ formData });
//   }

//   signUserUp() {
//     this.setState({ submitted: true }, () => {
//         setTimeout(() => this.setState({ submitted: false }), 5000);
//     });
    
//     let user = this.state.formData;

//     axios.post('/signup', user)
//       .then((response) => {
//         let userId = response.data.userId;
//         this.props.logUserIn(userId);
//         this.props.history.push('/');
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 422) {
//           console.log('error authenticating user errors', error.response)
//           this.setState({
//             didSignupFail: true,
//             errorCode: 422
//           })
//         } else {
//           console.log('Error in component', error.response)
//           this.setState({
//             didSignupFail: true,
//             errorCode: 500
//           })   
//         }
//       });
//   }

//   componentWillMount() {
//       // custom rule will have name 'isPasswordMatch'
//     ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
//       if (value !== this.state.formData.password) {
//           return false;
//       }
//       return true;
//     });
//   }

//   render() {

//     const { formData, submitted } = this.state;
//     return (
//       <div>
//         <NavBar isLoggedIn={false} />
//         <div className='body-container'>
//           <div className='form'>
//             <ValidatorForm
//               ref="form"
//               onSubmit={this.signUserUp.bind(this)}
//               onError={errors => console.log(errors)}
//             >
//               <TextValidator
//                 floatingLabelText="Username"
//                 onChange={this.handleInputChanges.bind(this)}
//                 name="username"
//                 value={formData.username}
//                 validators={['required', 'isString', 'minStringLength:4', 'maxStringLength:20']}
//                 errorMessages={['this field is required', 'invalid input', 'must be at least 4 character', 'must not excede 20 characters']}
//               /><br/>
//               <TextValidator
//                 floatingLabelText="First Name"
//                 onChange={this.handleInputChanges.bind(this)}
//                 name="firstName"
//                 value={formData.firstName}
//                 validators={['required', 'isString', 'minStringLength:1', 'maxStringLength:20']}
//                 errorMessages={['this field is required', 'invalid input', 'this field is required', 'must not excede 20 characters']}
//               /><br/>
//               <TextValidator
//                 floatingLabelText="Last Name"
//                 onChange={this.handleInputChanges.bind(this)}
//                 name="lastName"
//                 value={formData.lastName}
//                 validators={['required', 'isString', 'minStringLength:1', 'maxStringLength:20']}
//                 errorMessages={['this field is required', 'invalid input', 'this field is required', 'must not excede 20 characters']}
//               /><br/>
//               <TextValidator
//                 floatingLabelText="Email Address"
//                 onChange={this.handleInputChanges.bind(this)}
//                 name="email"
//                 value={formData.email}
//                 validators={['required', 'isEmail', 'minStringLength:7', 'maxStringLength:64']}
//                 errorMessages={['this field is required', 'not a valid email address', 'must enter a unique email address', 'must not excede 64 characters']}
//               /><br/>
//               <TextValidator
//                 floatingLabelText="Phone Number"
//                 onChange={this.handleInputChanges.bind(this)}
//                 name="phone"
//                 value={formData.phone}
//                 validators={['required', 'isNumber', 'minStringLength:10', 'maxStringLength:11']}
//                 errorMessages={['this field is required', 'not a valid phone number', 'example: 7895551234', 'must not excede 11 characters']}
//               /><br/>
//               <TextValidator
//                 floatingLabelText="Password"
//                 onChange={this.handleInputChanges.bind(this)}
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 validators={['required', 'isString', 'minStringLength:4', 'maxStringLength:64']}
//                 errorMessages={['this field is required', 'not a valid email address', 'must be at least 4 character', 'must not excede 64 characters']}
//               /><br/>
//               <TextValidator
//                 floatingLabelText="Re-enter password"
//                 onChange={this.handleInputChanges.bind(this)}
//                 name="repeatPassword"
//                 type="password"
//                 value={formData.repeatPassword}
//                 validators={['required', 'isPasswordMatch']}
//                 errorMessages={['this field is required', 'must match previous field']}
//               /><br/>
//               <TextValidator
//                 floatingLabelText="Avatar URL (Optional)"
//                 onChange={this.handleInputChanges.bind(this)}
//                 value={formData.avatarUrl}
//                 name="avatarUrl"
//               /><br/>
//             <div>
//               <button className='btn' onClick={this.signUserUp.bind(this)}>Create Account</button>
//               {this.state.didSignupFail && 
//                 <span className="error-text">
//                   {this.state.errorCode === 422
//                     ? <span>Username, Phone Number, or Email is not unique. Please try again.</span>
//                     : <span>Our servers are having issues. Please try later</span>
//                   }
//                 </span>
//               }
//             </div>
//           </ValidatorForm>
//           <div>
//             <br/>
//             <span>Already a member?</span>
//             <br/>
//             <Link to="/login"><button className='btn'>Sign in</button></Link>
//           </div>
//         </div>
//         </div>
//       </div>
//     );
//   }
// }
// export default SignUp;
