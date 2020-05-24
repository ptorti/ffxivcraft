import React, {Component} from 'react';
import EquipmentSearchForm from './EquipmentSearchForm'


class App extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            classes: null
        }

    }


    render() {
        return (
                <div className="App">

                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <a className="navbar-brand" href="#"><i className="xiv-FFXIVMeteo"/> FFXIV Craft</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </nav>
                    <EquipmentSearchForm/>
                </div>
        );
    }
}

export default App;
