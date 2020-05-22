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
                    <h1>Hello World</h1>
                    <EquipmentSearchForm/>
                </div>
        );
    }
}

export default App;
