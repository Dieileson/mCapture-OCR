import React, { Component } from 'react';

export default class Deferred extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }
    componentDidMount() {
        this.props.promise.then(value => {
            this.setState({value});
        });
    }
    render() {
        const then = this.props.then || (value => value);
        return then(this.state.value).substring(0, this.state.value.length - 1);
    }
}