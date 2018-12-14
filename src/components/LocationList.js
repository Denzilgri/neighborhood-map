import React, { Component } from 'react';
import Location from './Location';

class LocationList extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            'locations': '',
            'query': '',
            'suggestions': true,
        };

        this.filterLocations = this.filterLocations.bind(this);
        this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }

    /**
     * Filter Locations based on user query
     */
    filterLocations(event) {
        this.props.closeInfoWindow();
        const { value } = event.target;
        const locations = [];
        this.props.locations.forEach(function (location) {
            if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            'locations': locations,
            'query': value
        });
    }

    componentWillMount() {
        this.setState({
            'locations': this.props.locations
        });
    }

    /**
     * Show and hide suggestions
     */
    toggleSuggestions() {
        this.setState({
            'suggestions': !this.state.suggestions
        });
    }

    /**
     * Render function of LocationList
     */
    render() {
        return (
            <div className="search">
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field-box" type="text" placeholder="Filter Suggestions"
                    value={this.state.query} onChange={this.filterLocations} />
                <ul tabIndex="-1">
                    {this.state.suggestions && (this.state.locations.map(function (listItem, index) {
                        return (
                            <Location key={index} id={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem}
                            />)
                    }, this))}
                </ul>
                <button className="button" onClick={this.toggleSuggestions}>Toggle Suggestions</button>
            </div>
        );
    }
}

export default LocationList;