import React from 'react';
import {Grid, Form, Button, Segment, Header, Message, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import firebase from "../../firebase.js";
import md5 from 'md5';

class Register extends React.Component {

    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    };

    isformValid = () => {
        let errors = [];
        let error;

        if(this.isFormEmpty(this.state)){
            // throw error
            error = {message: 'Fill in All Fields'};
            this.setState({errors: errors.concat(error)})
            return false;

        } else if(!this.isPasswordValid(this.state)) {
            // throw error
            error = { message: "Password Didn't Match or Less Then 6 Characters" };
            this.setState({errors: errors.concat(error)});
            return false;

        } else {
            // form valid
            return true;
        }
    }

    isFormEmpty = ({username, email, password, passwordConfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if(password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if(password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.isformValid()){
        this.setState({errors: [], loading:true});
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                })
                .then(()=>{
                    this.saveUser(createdUser).then(()=>{
                        console.log("User Saved!");
                    })
                })
                .catch(err => {
                    console.log(err);
                    this.setState({errors: this.state.errors.concat(err), loading: false})
                })
            })
            .catch(err => {
                console.error(err);
                this.setState({errors: this.state.errors.concat(err), loading: false})
            })
        }
    }

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    handleInpurError = (errors, inputName) => {
        return errors.some(error => 
            error.message.toLowerCase().includes(inputName)) 
            ?'error':""
    }

    render() {
        const {
            username, 
            email, 
            password, 
            passwordConfirmation, 
            errors,
            loading
        } = this.state;

        return(
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h2" icon color="black" textAlign="center">
                        <Icon name="code" color="black"/>
                        Register For BM-TeamChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" 
                            placeholder="Username" onChange={this.handleChange} type="text" 
                            value={username}
                            />

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" 
                            placeholder="Email Address" onChange={this.handleChange} type="email" 
                            value={email}
                            className={this.handleInpurError(errors, 'email')}
                            />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" 
                            placeholder="Password" onChange={this.handleChange} type="password" 
                            value={password}
                            className={this.handleInpurError(errors, 'password')}
                            />

                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" 
                            placeholder="Password Confirmation" onChange={this.handleChange} type="password" 
                            value={passwordConfirmation}
                            className={this.handleInpurError(errors, 'password')}
                            />

                            <Button disabled={loading} className={loading ? 'loading' : ''} color="black" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Errors</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already User? <Link to="/login">Login</Link> </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;