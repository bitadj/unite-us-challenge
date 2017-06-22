import React, { Component } from 'react';
import './App.css';
import rp from 'request-promise';

class App extends Component {
  constructor(){
    super();
    this.state = { 
      options: [],
      firstName: "",
      lastName: "",
      email: "",
      serviceType: "",
      checkbox: false,
      textArea: " ",
      completed: false,
      value: "selection"
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    var options = {
      uri: 'http://localhost:49567/api/service-types',
      json: true
    };
    rp(options).then( ({data}) => {
      this.setState({
        options: data
      })
    }).catch(err => console.log(err))
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.completed) return alert("Your request has already been submitted.")

    const { firstName, lastName, email, serviceType, textArea } = this.state;
    var options = {
      method: 'POST',
      uri: 'http://localhost:49567/api/assistance-requests',
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "cache-control": "no-cache"
      },
      body: {
        "assistance_request": {
          "contact": {
            "first_name": firstName,
            "last_name": lastName,
            "email": email
          },
          "service_type": serviceType,
          "description": textArea
        }
      },
      json: true,
      resolveWithFullResponse: true
    };

    rp(options).then( response => {
      this.setState({ completed: true })
      alert("Your assistance request has been successfully submitted.")
    }).catch({statusCode: 401}, err => alert("Sorry, you are not authorized to make this request.", err))
      .catch({statusCode: 500}, err => alert("Oh no! Something completely unexpected happened!"))
      .catch({statusCode: 503}, err => alert("We're down!!!!!! Come back later.....(please)"))
  }

  handleChange(key) { 
    return ({ target }) => {
      this.setState({[key]: key === "checkbox" ? target.checked : target.value})
    };
  }

  render() {
    const { options } = this.state;
    const optionsjsx = options.map(({ id, display_name }) => <option value={ id }>{ display_name }</option>)

    return (
      <div className="App container centered">
        <form onSubmit={ this.handleSubmit } >
          <h1>New Assistance Request</h1>
          <hr/>

          <input onChange={this.handleChange("firstName")} type="text" placeholder="First Name" className="col-sm-12 form-control" required />
          <div className="required">required</div>
          
          <input onChange={this.handleChange("lastName")} type="text" placeholder="Last Name" className="col-sm-12 form-control" required/>
          <div className="required">required</div>
          
          <input onChange={ this.handleChange("email") } type="email" placeholder="Email Address" className="col-sm-12 form-control" required/>
          <div className="required">required</div>
          
          <select onChange={ this.handleChange("serviceType") } name="Select Service Type" className="col-sm-12 form-control dropdown" required >
            <option disabled selected value="" > Select Service Type </option>
            { optionsjsx }
          </select>
          <div className="required">required</div> 
          
          <textarea onChange={this.handleChange("textArea")} cols="30" rows="10" placeholder="Additional Information" className="col-sm-12 form-control" ></textarea>
          
          <div className="checkbox">
            <label htmlFor="privacy">
              <input onChange={this.handleChange("checkbox")} type="checkbox" id="privacy" required/> 
                I hearby accept the terms of service for THE NETWORK and the Privacy Policy.
            </label>
          </div>

          <input type="submit" value="Get Assistance" className="pull-right col-sm-2 btn btn-primary"/>
        </form>
      </div>
    );
  }
}

export default App;
