import React, {Component} from "react";
import Select from "react-select";
import {jobList} from "../classes/Param"

class ItemSeach extends Component{

    constructor(props) {
        super(props);

        this.state = {
            job: null,
            lvl_min: 480,
            lvl_max: null,
            search: null,
        };

        this.select2Jobs = [];

        this.select2Jobs = Object.keys(jobList).map((key, value) => {
            return (
                {value: key, label: jobList[key].label_fr}
            )
        });

    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    };

    handleChangeSelect = (selectedOption) => {
        this.setState({job: selectedOption.value});
    };

    render(){
        return (
            <form onSubmit={this.search} className={"search form-inline"}>
                <div className="form-group ">
                    <label htmlFor={'name'}> Nom :</label>
                    <input type='text' name={'search'} id={'search'} onChange={this.handleChange}
                           value={this.state.search}
                           className="form-control-sm"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={'job'}> Classe :</label>
                    <Select name={'job'} id={'job'} onChange={this.handleChangeSelect} className="select2"
                            value={{value: this.state.job, label: jobList[this.state.job].label_fr}}
                            options={this.select2Jobs}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={'lvl_min'}> Level mini :</label>
                    <input type='number' name={'lvl_min'} id={'lvl_min'} onChange={this.handleChange}
                           value={this.state.lvl_min}
                           className="form-control-sm ilvl"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor={'lvl_min'}> Level maxi :</label>
                    <input type='number' name={'lvl_max'} id={'lvl_max'} onChange={this.handleChange}
                           className="form-control-sm ilvl"
                           value={this.state.lvl_max}/>
                </div>

                <input type="submit" className={"btn btn-primary btn-sm"} value="Rechercher"/>
            </form>
        )
    }

}

export default ItemSeach;