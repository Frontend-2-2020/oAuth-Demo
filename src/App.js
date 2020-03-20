import React, {Component} from 'react';
import { SwatchesPicker } from 'react-color';
import {API, TOKEN} from "./API";

class App extends Component {
  state = {
    color: '#fff'
  };

  componentDidMount() {
      if(TOKEN){
          this.getUserData();
      }
  }

  getUserData = () => {
      API.get("api/user").then(response => {
          console.log(response);
          this.setState({user: response.data})
      })
  }

    handleChangeComplete = (color) => {
        this.setState({ color: color.hex });
    };

    register = () => {
        API.post("api/users", {
            "first_name": document.querySelector("[name=first_name]").value,
            "last_name": document.querySelector("[name=last_name]").value,
            "email": document.querySelector("[name=email]").value,
            "password": document.querySelector("[name=password]").value,
            "favorite_color": this.state.color,
            "avatar": "https://api.adorable.io/avatars/285/" + document.querySelector("[name=email]").value
        }).then(response => {
            alert(response.statusText);
        });
    };

    login = () => {
        API.post("oauth/token", {
            'grant_type': 'password',
            'client_id': 2,
            'client_secret': 'iwrHFPcaiQ3bZTzHEwQpYkpiuHUlbIOJ9SAI6DLI',
            "username": document.querySelector("[name=login_email]").value,
            "password": document.querySelector("[name=login_password]").value,
        }).then(response => {
            window.localStorage.setItem("DEMO_LOGIN_OAUTHTOKEN", response.data.access_token);
            API.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
            this.getUserData();
        });
    };

    getposts = () => {
        API.get("api/posts").then(response => {
            alert(response.statusText);
        }).catch(e => {
            alert(e.response.statusText)
        });
    };

    logout = () => {
        window.localStorage.setItem("DEMO_LOGIN_OAUTHTOKEN", undefined);
        API.defaults.headers.common['Authorization'] = undefined;
        this.setState({user: undefined});
    }

  render() {
        const {user} = this.state;
    return (
        <div className="App">
            {user && (
                <p>Hi, {user.first_name}! <button onClick={this.logout}>logout</button></p>
            )}

            <h1>Check if you can read posts</h1>

            <p><button onClick={this.getposts}>getposts</button></p>
          <h1>Register</h1>

          <p>
            <label htmlFor="first_name">first_name</label>
            <input type="text" name="first_name"/>
          </p>

          <p>
            <label htmlFor="last_name">last_name</label>
            <input type="text" name="last_name"/>
          </p>

          <p>
            <label htmlFor="email">email</label>
            <input type="text" name="email"/>
          </p>

          <p>
            <label htmlFor="password">password</label>
            <input type="password" name="password"/>
          </p>


            <label htmlFor="favorite_color">favorite_color</label>
            <SwatchesPicker
                color={ this.state.color }
                onChangeComplete={ this.handleChangeComplete }
            />

            <br/><br/>

            <button onClick={this.register}>Register</button>


          <br/>
          <h1>Login</h1>
            <p>
                <label htmlFor="email">email</label>
                <input type="text" name="login_email"/>
            </p>

            <p>
                <label htmlFor="password">password</label>
                <input type="password" name="login_password"/>
            </p>

            <button onClick={this.login}>Login</button>
        </div>
    );
  }
}

export default App;
