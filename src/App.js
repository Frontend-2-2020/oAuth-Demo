import React, {Component} from 'react';
import { SwatchesPicker } from 'react-color';
import {API, TOKEN} from "./API";

class App extends Component {
  state = {
      // Default kleur van onze Colorpicker
    color: '#fff'
  };

  componentDidMount() {
      if(TOKEN){
          // Als er een token is (uit local storage) dan gaan we de gebruikersgevens ophalen
          this.getUserData();
      }
  }

  getUserData = () => {
      // Een call naar dit enpoint haalt de gebruikersgevens op voor de momenteel ingelogde persoon. Dit enpoint heeft
      // dus sowieso de Authorization token nodig
      API.get("api/user").then(response => {
          // Als dat lukt dan steken we die data in de state. Hiervoor was state.user dus undefined.
          this.setState({user: response.data})
      })
  }

    handleChangeComplete = (color) => {
        // Het kleur component werkt door de huidig geselecteerde kleur in de state op te slaan, dit is heel handig
        // om daar bij het versturen dan de waarde van uit te lezen.
        this.setState({ color: color.hex });
    };

    register = () => {
        // Aanmaken van een user. Alle waarden worden uit de input velden gehaald met basic JS, de kleur daarintegen
        // Halen we uit de state.

        // Velden die nodig zijn worden bepaald door de API

        // Avatar is een url naar een foto, in dit geval de adorable.io avatar generator.

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
        // Bij een login doen we een call naar oauth/token, de velden die we hier moeten aan meegeven zijn standaard
        // voor oauth2.

        // Client id/secret moet je krijgen van de API of zoals bij Facebook kan je die aanvragen in de interface.

        API.post("oauth/token", {
            'grant_type': 'password',
            'client_id': 2,
            'client_secret': 'iwrHFPcaiQ3bZTzHEwQpYkpiuHUlbIOJ9SAI6DLI',
            "username": document.querySelector("[name=login_email]").value,
            "password": document.querySelector("[name=login_password]").value,
        }).then(response => {
            // Als die call lukt doen we 3 dingen:

            // We slaan de token op in localstorage, dit zodat we na het herladen van de pagina nog steeds verder kunnen
            // met deze token. In API.js stellen we deze token onmiddellijk in bij het inladen van de pagina als deze
            // beschikbaar is
            window.localStorage.setItem("DEMO_LOGIN_OAUTHTOKEN", response.data.access_token);

            // Om vanaf nu onze API requests te voorzien van een token moeten we dit als volgt instellen.
            // Volgende refresh is dit niet meer nodig want dan doen we exact dit in de API.js
            API.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;

            // Na het juist instellen van alles kunnen we gaan ophalen wie er is ingelogd om dit dan weer te geven op
            // de pagina
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
        // Ook bij logout doen we eigenlijk 3 dingen, namelijk het omgekeerde van de login.

        // We verwijderen de token uit localstorage, zodanig dat een user niet opnieuw is ingelogd na een page refresh
        window.localStorage.setItem("DEMO_LOGIN_OAUTHTOKEN", undefined);

        // We verwijderen de token uit onze API calls voor de huidige sessie.
        API.defaults.headers.common['Authorization'] = undefined;

        // We verwijderen de user uit de state
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
