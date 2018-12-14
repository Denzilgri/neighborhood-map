import React from 'react';

class Location extends React.Component {
    /**
     * Render method to render Location component
     */
    render() {
        return (
            <li role="option" key={this.props.id}
                className="box" tabIndex="0"
                onKeyPress={
                    this.props.openInfoWindow.bind(this, this.props.data.marker)
                }
                onClick={
                    this.props.openInfoWindow.bind(this, this.props.data.marker)
                }>
                {this.props.data.longname}
            </li>
        );
    }
}

export default Location;