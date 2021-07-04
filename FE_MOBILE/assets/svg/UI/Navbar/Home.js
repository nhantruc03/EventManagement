import React, { Component } from 'react';

import Svg, { Path, Rect } from 'react-native-svg'

export default class HomeIcon extends Component {
    render() {
        return (
            <Svg name={this.props.iconName} width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Rect width="48" height="48" fill="white" fill-opacity="0.01" />
                <Path d="M9 18V42H39V18L24 6L9 18Z" fill={this.props.color} />
                <Path d="M9 42V18L4 22L24 6L44 22L39 18V42H9Z" stroke={this.props.color} stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <Path d="M19 29V42H29V29H19Z" fill="#FFF" stroke={this.props.color} stroke-width="4" stroke-linejoin="round" />
                <Path d="M9 42H39" stroke={this.props.color} stroke-width="4" stroke-linecap="round" />
            </Svg>
        );
    }
}

