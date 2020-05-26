import React, {Component} from "react";
import {Table as Table2, Image} from "react-bootstrap";
import Table from "../components_ui/Table";

class IngredientTable extends Component {

    /**
     *
     * @param {Ingredient[]} ingredients
     */
    constructor({ingredients}) {
        super(ingredients);

        this.state = {
            ingredients: ingredients ?? []
        }
    }

    convertToArray = () => {
        const header = ["", "Qté", "Nom"];
        const body = [];
        this.state.ingredients.map(ingredient => {
            body.push([
                <Image src={ingredient.iconUrl}/>,
                ingredient.quantity,
                ingredient.name
            ])
        });
        return {header, body}
    };

    render() {

        const {header, body} = this.convertToArray();

        return (
            <Table header={header} body={body}/>
        )
    }
}

export default IngredientTable;