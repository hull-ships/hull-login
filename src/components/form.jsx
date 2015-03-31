import React from 'react';
import t from 'tcomb-form';

const TCombForm = t.form.Form;

export default React.createClass({
  getInitialState: function() {
    return {
      value: {},
      isDisabled: true
    }
  },

  handleChange: function(changes) {
    var value = this.refs.form.getValue();

    this.setState({
      value: changes,
      isDisabled: !value
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var value = this.refs.form.getValue();
    this.props.onSubmit(value);
  },

  render: function() {
    console.log(this.props)
    return (
      <form onSubmit={this.handleSubmit}>
        <TCombForm ref='form' type={this.props.type} options={this.props.options} value={this.state.value} onChange={this.handleChange} />
        <button className='small button radius expand success' disabled={this.state.isDisabled} type='submit'>{this.props.submitMessage}</button>
      </form>
    );
  }
});


